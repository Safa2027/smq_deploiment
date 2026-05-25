import { useState } from "react";

const initialNotifications = [
  { id: 1, text: "Karim Meziane a été ajouté", time: "Il y a 2 min", read: false },
  { id: 2, text: "Rôle de Nadia Ferhat modifié", time: "Il y a 1h", read: false },
  { id: 3, text: "Aya Terkmani connectée", time: "Il y a 3h", read: true },
  { id: 4, text: "Rôle de Nadia Ferhat modifié", time: "Il y a 1h", read: false },
];

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState(initialNotifications);

  const unread = notifications.filter(n => !n.read).length;

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  return (
    <div className="relative ml-auto mr-2">

      {/* Bell button */}
      <button
        onClick={() => setOpen(prev => !prev)}
        className="relative p-2 rounded-lg text-[#567C8E] hover:bg-slate-100 cursor-pointer"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20" height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>

        {unread > 0 && (
          <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
            {unread}
          </span>
        )}
      </button>

      {/* Popup */}
      {open && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-[90]"
            onClick={() => setOpen(false)}
          />

          {/* Dropdown panel */}
          <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-xl shadow-lg border border-slate-200 z-[100]">

            {/* Header */}
            <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
              <span className="text-sm font-semibold text-[#2F4157]">Notifications</span>
              {unread > 0 && (
                <span className="text-xs text-[#567C8E]">{unread} non lues</span>
              )}
            </div>

            {/* List */}
            <ul className="max-h-64 overflow-y-auto divide-y divide-slate-100">
              {notifications.length === 0 ? (
                <li className="px-4 py-6 text-center text-xs text-[#567C8E]">
                  Aucune notification
                </li>
              ) : notifications.map(n => (
                <li
                  key={n.id}
                  className={`px-4 py-3 flex gap-3 items-start ${!n.read ? "bg-blue-50/50" : ""}`}
                >
                  <span className={`mt-1.5 w-2 h-2 rounded-full flex-shrink-0 ${!n.read ? "bg-blue-500" : "bg-transparent"}`} />
                  <div>
                    <p className="text-xs text-[#1f2c3d] leading-snug">{n.text}</p>
                    <p className="text-[11px] text-[#567C8E] mt-0.5">{n.time}</p>
                  </div>
                </li>
              ))}
            </ul>

            {/* Footer */}
            {unread > 0 && (
              <div className="px-4 py-2 border-t border-slate-100 text-center">
                <button
                  onClick={markAllRead}
                  className="text-xs text-[#567C8E] hover:text-[#2F4157] cursor-pointer"
                >
                  Tout marquer comme lu
                </button>
              </div>
            )}

          </div>
        </>
      )}
    </div>
  );
}
