import React from "react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full bg-muted text-muted-foreground py-8 px-4 md:px-20">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        {/* Left Side */}
        <div className="text-center md:text-left">
          <p>&copy; {new Date().getFullYear()} Inideg. All rights reserved.</p>
        </div>

        {/* Right Side - Links */}
        <div className="flex space-x-6 text-sm">
          <Link href="/privacy" className="hover:text-foreground transition">
            Privacy Policy
          </Link>
          <Link href="/terms" className="hover:text-foreground transition">
            Terms of Service
          </Link>
          <Link href="/contact" className="hover:text-foreground transition">
            Contact
          </Link>
        </div>
      </div>
    </footer>
  );
}
