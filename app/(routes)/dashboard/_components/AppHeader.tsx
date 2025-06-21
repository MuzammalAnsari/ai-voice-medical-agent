"use client";

import { UserButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";

const menuOptions = [
  { id: 1, label: "Home", path: "/home" },
  { id: 2, label: "History", path: "/history" },
  { id: 3, label: "Pricing", path: "/pricing" },
  { id: 4, label: "Profile", path: "/profile" },
];

export default function AppHeader() {
  return (
    <header className="flex items-center justify-between py-4 bg-white shadow-sm sticky top-0 z-50 px-10 md:px-20 lg:px-40">
      {/* Logo */}
      <Link href="/">
        <Image src="/logo.svg" alt="Logo" width={160} height={80} priority />
      </Link>

      {/* Navigation */}
      <nav>
        <ul className="flex items-center gap-6 text-gray-700 text-sm font-medium">
          {menuOptions.map((option) => (
            <li key={option.id}>
              <Link
                href={option.path}
                className="hover:font-bold transition-colors duration-200"
              >
                {option.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <UserButton />
    </header>
  );
}
