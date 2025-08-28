"use client";

import { fetchWithAuth } from "@/lib/fetch-with-auth";
import getRandomHex from "@/lib/utils/get-random-hex";
import { CollaborationUser } from "@/types/live-collaborating-user";
import { User } from "@/types/user";
import { useAuth } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";
import { Editor } from "@tiptap/react";
import { useEffect, useReducer } from "react";
import { createPortal } from "react-dom";
import { WebsocketProvider } from "y-websocket";
import Pointer from "../ui/pointer";
import Caret from "./caret";

interface CollaborationIndicatorsProps {
  editor: Editor | null;
  provider: WebsocketProvider | null;
}

const initialUser: CollaborationUser = {
  name: "Loading...",
  color: "#" + getRandomHex(),
  cursor: {
    anchor: 0,
    head: 0,
    position: {
      x: 0,
      y: 0,
    },
    height: 0,
    width: 0,
    type: "caret",
  },
};

export default function CollaborationIndicators({
  editor,
  provider,
}: Readonly<CollaborationIndicatorsProps>) {
  const [, rerender] = useReducer((x) => -x, 1);
  const { getToken, userId, isLoaded: isAuthLoaded } = useAuth();

  const { data: user } = useQuery({
    queryKey: ["user", userId],
    queryFn: async () => {
      const token = await getToken();
      const user = await fetchWithAuth<User>({
        relativeUrl: `/users/${userId}`,
        token,
        userId,
      });

      return user;
    },
    enabled: isAuthLoaded,
  });

  // Update users when one of them changes their awareness
  useEffect(() => {
    if (!provider) return;

    provider.awareness.on("change", rerender);

    return () => {
      provider.awareness.off("change", rerender);
    };
  }, [provider]);

  // Update local cursor position in awareness
  useEffect(() => {
    if (!editor || !provider || !user?.name) return;

    let updateTimeout: NodeJS.Timeout;

    const updateLocalCursor = (e?: MouseEvent) => {
      // Clear any pending updates to avoid excessive calls
      clearTimeout(updateTimeout);

      // Delay the cursor update slightly to avoid conflicts with ongoing transactions
      updateTimeout = setTimeout(() => {
        try {
          const { from, to } = editor.state.selection;

          // Get user info from local state
          const localState = provider.awareness.getLocalState();
          const prevUser = (localState?.user ??
            initialUser) as CollaborationUser;

          const isText = editor.state.doc.resolve(from).parent.isTextblock;

          let newPosition = { x: 0, y: 0 };

          if (isText) {
            newPosition = {
              x: editor.view.coordsAtPos(from).left + window.scrollX,
              y: editor.view.coordsAtPos(from).top + window.scrollY,
            };
          } else if (e) {
            newPosition = {
              x: e.pageX,
              y: e.pageY,
            };
          }

          const updatedUser: CollaborationUser = {
            ...prevUser,
            name: user.name,
            cursor: {
              anchor: from,
              head: to,
              position: newPosition,
              height:
                editor.view.coordsAtPos(from).bottom -
                editor.view.coordsAtPos(from).top,
              width: Math.max(
                1,
                editor.view.coordsAtPos(to).left -
                  editor.view.coordsAtPos(from).left
              ),
              type: isText ? "caret" : "mouse",
            },
          };

          provider.awareness.setLocalStateField("user", updatedUser);

          console.log(provider.awareness.getStates());
        } catch (error) {
          // Ignore coordinate calculation errors during rapid state changes
          console.debug(
            "Cursor position update skipped due to state change:",
            error
          );
        }
      }, 4); // Small delay to allow transactions to complete
    };

    editor.on("selectionUpdate", () => updateLocalCursor());
    editor.on("transaction", () => updateLocalCursor());
    editor.on("focus", () => updateLocalCursor());
    document.addEventListener("mousemove", updateLocalCursor);

    updateLocalCursor();

    return () => {
      clearTimeout(updateTimeout);
      editor.off("selectionUpdate", () => updateLocalCursor());
      editor.off("transaction", () => updateLocalCursor());
      editor.off("focus", () => updateLocalCursor());
      document.removeEventListener("mousemove", updateLocalCursor);
      provider.awareness.setLocalState(null);
    };
  }, [editor, provider, user?.name]);

  if (!editor || !provider) return null;

  return Array.from(provider.awareness.getStates().entries()).map(
    ([clientId, state]) => {
      const user = state.user;
      const currentUserClientId = provider.awareness.clientID;
      if (
        !user?.cursor ||
        !user.name ||
        !user.color ||
        currentUserClientId === clientId
      )
        return null;

      if (user.cursor.type === "caret") {
        return <Caret key={clientId} user={user} />;
      }

      return createPortal(
        <Pointer
          key={clientId}
          username={user.name}
          wrapperClassName="absolute"
          style={{
            top: user.cursor.position.y,
            left: user.cursor.position.x,
            color: user.color,
          }}
        />,
        document.body
      );
    }
  );
}
