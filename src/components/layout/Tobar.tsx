"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Phone, Mail, RefreshCw } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const LANGUAGES = {
  EN: { 
    code: "EN", 
    label: "English", 
    flag: "🇺🇸",
    flagImg: "/en.png" 
  },
  KH: { 
    code: "KH", 
    label: "ភាសាខ្មែរ", 
    flag: "🇰🇭",
    flagImg: "/kh.png"
  },
};

const CURRENCIES = {
  USD: { 
    code: "USD", 
    symbol: "$", 
    flag: "🇺🇸",
    flagImg: "/en.png"
  },
  KHR: { 
    code: "KHR", 
    symbol: "៛", 
    flag: "🇰🇭",
    flagImg: "/kh.png"
  },
};

export default function TopBar() {
  const { user } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [language, setLanguage] = useState<"EN" | "KH">("EN");
  const [currency, setCurrency] = useState<"USD" | "KHR">("USD");

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleLanguage = () => {
    setLanguage(prev => prev === "EN" ? "KH" : "EN");
  };

  const toggleCurrency = () => {
    setCurrency(prev => prev === "USD" ? "KHR" : "USD");
  };

  if (!mounted) return null;

  const currentLang = LANGUAGES[language];
  const currentCurr = CURRENCIES[currency];

  return (
    <div className="bg-gray-900  border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-9">
          {/* Left Section - Contact Info */}
          <div className="hidden lg:flex items-center gap-6 text-xs text-white">
            <div className="flex items-center gap-2">
              <Phone className="h-3 w-3 text-gray-400" />
              <span>Free shipping over $100</span>
            </div>
            <a 
              href="mailto:support@mystore.com" 
              className="flex items-center gap-2 hover:text-blue-900 transition-colors"
            >
              <Mail className="h-3 w-3 text-gray-400" />
              <span>support@mystore.com</span>
            </a>
          </div>

          {/* Right Section - User Actions */}
          <div className="flex items-center gap-3 ml-auto text-xs">
            {/* Track Order */}
            <Link 
              href="/track-order" 
              className="hidden sm:block text-white hover:text-blue-900 transition-colors"
            >
              Track Order
            </Link>

            {/* Help Center */}
            <Link 
              href="/help" 
              className="hidden sm:block text-white hover:text-blue-900 transition-colors"
            >
              Help
            </Link>

            {/* Divider */}
            <div className="hidden sm:block h-3 w-px bg-gray-200"></div>

            {/* Account Link */}
            <Link 
              href={user ? "/account" : "/login"}
              className="text-white hover:text-blue-900 transition-colors"
            >
              {user ? `Hi, ${user.displayName?.split(' ')[0] || 'User'}` : 'Sign In'}
            </Link>

            {/* Divider */}
            <div className="h-3 w-px bg-gray-200"></div>

            {/* Language Toggle */}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1.5 text-white hover:text-blue-900 transition-all py-1 px-2 rounded hover:bg-gray-50 group"
              title={`Switch to ${language === "EN" ? "Khmer" : "English"}`}
            >
              <Image
                src={currentLang.flagImg}
                alt={currentLang.code}
                width={16}
                height={12}
                className="object-cover rounded-sm"
                unoptimized
              />
              <span className="font-medium">{currentLang.code}</span>
              <RefreshCw className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>

            {/* Currency Toggle */}
            <button
              onClick={toggleCurrency}
              className="flex items-center gap-1.5 text-white hover:text-blue-900 transition-all py-1 px-2 rounded hover:bg-gray-50 group"
              title={`Switch to ${currency === "USD" ? "Khmer Riel" : "US Dollar"}`}
            >
              <Image
                src={currentCurr.flagImg}
                alt={currentCurr.code}
                width={16}
                height={12}
                className="object-cover rounded-sm"
                unoptimized
              />
              <span className="font-medium text-xs">{currentCurr.symbol}</span>
              <span className="font-medium">{currentCurr.code}</span>
              <RefreshCw className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}