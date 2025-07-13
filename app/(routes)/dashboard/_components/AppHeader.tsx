"use client";

import { UserButton } from "@clerk/nextjs";
import { Stethoscope } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const menuOptions = [
  { id: 1, label: "Home", path: "/dashboard" },
  { id: 2, label: "History", path: "/dashboard/history" },
  { id: 3, label: "Billing", path: "/dashboard/billing" },
  { id: 4, label: "Profile", path: "/profile" },
];

export default function AppHeader() {
  return (
    <header className="flex items-center justify-between py-4 bg-white shadow-sm sticky top-0 z-50 px-10 md:px-20 lg:px-40">
      <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-teal-600 rounded-lg flex items-center justify-center">
                <Stethoscope className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold"><Link href="/">MedVoice AI</Link></span>
            </div>

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
