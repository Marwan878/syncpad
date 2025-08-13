"use client";

import { CollaborationUser } from "@/types/live-collaborating-user";
import { Editor } from "@tiptap/react";
import { useEffect, useState } from "react";
import { WebsocketProvider } from "y-websocket";
import Caret from "./caret";

interface CollaborationCaretsProps {
  editor: Editor | null;
  provider: WebsocketProvider | null;
}

export function CollaborationCarets({
  editor,
  provider,
}: Readonly<CollaborationCaretsProps>) {
  const [users, setUsers] = useState<Map<string, CollaborationUser>>(new Map());

  // Update users when awareness changes
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
          newUsers.set(clientId.toString(), {
            name: user.name,
            color: user.color,
            cursor: state.cursor,
          });
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

    const updateLocalCursor = () => {
      const { from, to } = editor.state.selection;

      provider.awareness.setLocalStateField("cursor", {
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
      });
    };

    editor.on("selectionUpdate", updateLocalCursor);
    editor.on("transaction", updateLocalCursor);

    return () => {
      editor.off("selectionUpdate", updateLocalCursor);
      editor.off("transaction", updateLocalCursor);
      provider.awareness.setLocalStateField("cursor", null);
    };
  }, [editor, provider]);

  if (!editor || !provider) return null;

  return (
    <>
      {Array.from(users.entries()).map(([clientId, user]) => {
        const position = user.cursor;
        if (!position) return null;

        return <Caret key={clientId} user={user} />;
      })}
    </>
  );
}
