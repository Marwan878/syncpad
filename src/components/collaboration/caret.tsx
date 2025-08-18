import hexToRgba from "@/lib/utils/hex-to-rgba";
import { CollaborationUser } from "@/types/live-collaborating-user";
import { createPortal } from "react-dom";

type CaretProps = {
  user: CollaborationUser;
  className?: string;
};

export default function Caret({ user, className }: Readonly<CaretProps>) {
  if (!user.cursor) return null;

  return createPortal(
    <div
      className="absolute pointer-events-none z-10"
      style={{
        left: user.cursor.position.x,
        top: user.cursor.position.y,
        height: user.cursor.position.height,
        borderLeft: `2px solid ${user.color}`,
        width: `${user.cursor.position.width}px`,
        backgroundColor: hexToRgba(user.color, 0.2),
      }}
    >
      <div
        className="translate-y-[-1px] py-0.5 px-1.5 text-xs -left-[1px] -top-6 shadow-xs z-[11] text-white user-select-none font-semibold absolute whitespace-nowrap"
        style={{
          backgroundColor: user.color,
          borderRadius: "0.25rem",
          borderBottomLeftRadius: "0",
        }}
      >
        {user.name}
      </div>
    </div>,
    document.body
  );
}
