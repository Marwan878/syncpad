"use client";

import { CollaborationUser } from "@/types/live-collaborating-user";
import { Editor } from "@tiptap/react";
import { useEffect, useState } from "react";
import { WebsocketProvider } from "y-websocket";
import Caret from "./caret";
import Pointer from "../ui/pointer";
import { createPortal } from "react-dom";

interface CollaborationIndicatorsProps {
  editor: Editor | null;
  provider: WebsocketProvider | null;
}

export default function CollaborationIndicators({
  editor,
  provider,
}: Readonly<CollaborationIndicatorsProps>) {
  const [users, setUsers] = useState<Map<string, CollaborationUser>>(new Map());

  // Update users when one of them changes their awareness
  useEffect(() => {
    if (!provider) return;

    const updateUsers = () => {
      const awareness = provider.awareness;
      const states = awareness.getStates();
      const newUsers = new Map<string, CollaborationUser>();

      states.forEach((state, clientId) => {
        if (clientId === awareness.clientID) return; // Skip own cursor

        const user = state.user as CollaborationUser;

        if (user) {
          newUsers.set(clientId.toString(), user);
        }
      });

      setUsers(newUsers);
    };

    // Listen to awareness changes
    provider.awareness.on("change", updateUsers);

    return () => {
      provider.awareness.off("change", updateUsers);
    };
  }, [provider]);

  // Update local cursor position in awareness
  useEffect(() => {
    if (!editor || !provider) return;

    let updateTimeout: NodeJS.Timeout;

    const updateLocalCursor = () => {
      // Clear any pending updates to avoid excessive calls
      clearTimeout(updateTimeout);

      // Delay the cursor update slightly to avoid conflicts with ongoing transactions
      updateTimeout = setTimeout(() => {
        try {
          const { from, to } = editor.state.selection;

          const isText = editor.state.doc.resolve(from).parent.isTextblock;

          const localState = provider.awareness.getLocalState();
          if (!localState) return;

          const user = localState.user as CollaborationUser;

          const newUser: CollaborationUser = {
            ...user,
            cursor: {
              anchor: from,
              head: to,
              position: {
                x: editor.view.coordsAtPos(from).left + window.scrollX,
                y: editor.view.coordsAtPos(from).top + window.scrollY,
                height:
                  editor.view.coordsAtPos(from).bottom -
                  editor.view.coordsAtPos(from).top,
                width:
                  editor.view.coordsAtPos(to).left -
                  editor.view.coordsAtPos(from).left,
              },
              type: isText ? "caret" : "mouse",
            },
          };

          provider.awareness.setLocalStateField("user", newUser);
        } catch (error) {
          // Ignore coordinate calculation errors during rapid state changes
          console.debug(
            "Cursor position update skipped due to state change:",
            error
          );
        }
      }, 10); // Small delay to allow transactions to complete
    };

    editor.on("selectionUpdate", updateLocalCursor);
    editor.on("transaction", updateLocalCursor);

    const _setCursorType = (type: "caret" | "mouse") => {
      const localState = provider.awareness.getLocalState();
      if (!localState) return;
      provider.awareness.setLocalStateField("user", {
        ...localState.user,
        cursor: {
          ...localState.user.cursor,
          type,
        },
      });
    };

    const handleMouseMove = (e: MouseEvent) => {
      if ((e.target as HTMLElement)?.tagName === "IMG") {
        _setCursorType("mouse");
      }
    };

    document.addEventListener("mousemove", handleMouseMove);

    const handleBlur = () => {
      _setCursorType("mouse");
    };

    editor.on("blur", handleBlur);
    editor.on("focus", updateLocalCursor);

    updateLocalCursor();

    return () => {
      clearTimeout(updateTimeout);
      editor.off("selectionUpdate", updateLocalCursor);
      editor.off("transaction", updateLocalCursor);
      editor.off("blur", handleBlur);
      document.removeEventListener("mousemove", handleMouseMove);
      provider.awareness.setLocalStateField("user", undefined);
    };
  }, [editor, provider]);

  if (!editor || !provider) return null;

  return (
    <>
      {Array.from(users.entries()).map(([clientId, user]) => {
        const cursor = user.cursor;
        if (!cursor) return null;

        if (cursor.type === "caret") {
          return <Caret key={clientId} user={user} />;
        }

        return createPortal(
          <Pointer
            key={clientId}
            username={user.name}
            className="absolute"
            style={{
              top: cursor.position.y,
              left: cursor.position.x,
              color: user.color,
            }}
          />,
          document.body
        );
      })}
    </>
  );
}
