"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Home, User, MessageCircle, TrendingUp, ClipboardList } from "lucide-react";

export default function BottomNav() {
  const pathname = usePathname();

  const tabs = [
    { name: "Home", href: "/dashboard", icon: Home },
    { name: "Registro", href: "/register", icon: ClipboardList },
    { name: "Chatbot", href: "/chatbot", icon: MessageCircle },
    { name: "Progreso", href: "/progress", icon: TrendingUp },
    { name: "Usuario", href: "/profile", icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-sm py-2 px-4 flex justify-between z-50">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const active = pathname === tab.href;

        return (
          <Link
            key={tab.name}
            href={tab.href}
            className="flex flex-col items-center text-xs"
          >
            <Icon
              size={24}
              className={
                active
                  ? "text-[var(--color-primary)]"
                  : "text-[var(--color-gray)]"
              }
            />
            <span
              className={
                active
                  ? "text-[var(--color-primary)] font-semibold"
                  : "text-[var(--color-gray)]"
              }
            >
              {tab.name}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
