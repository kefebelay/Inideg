"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";

type Theme = "light" | "dark" | "system";

export default function ThemeSwitcher() {
  const [theme, setTheme] = useState<Theme | undefined>(undefined);
  const mediaQueryRef = useRef<MediaQueryList | null>(null);

  useEffect(() => {
    const htmlElement = document.documentElement;
    const savedTheme = localStorage.getItem("theme") as Theme | null;

    if (savedTheme) {
      setTheme(savedTheme);
      htmlElement.classList.toggle("dark", savedTheme === "dark");
    } else {
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      setTheme("system");
      htmlElement.classList.toggle("dark", prefersDark);
    }

    mediaQueryRef.current = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e: MediaQueryListEvent) => {
      if (
        localStorage.getItem("theme") === "system" ||
        !localStorage.getItem("theme")
      ) {
        htmlElement.classList.toggle("dark", e.matches);
      }
    };

    mediaQueryRef.current.addEventListener("change", handleChange);

    return () => {
      if (mediaQueryRef.current) {
        mediaQueryRef.current.removeEventListener("change", handleChange);
      }
    };
  }, []);

  useEffect(() => {
    const htmlElement = document.documentElement;
    if (theme === undefined) return;

    if (theme === "system") {
      htmlElement.classList.toggle(
        "dark",
        window.matchMedia("(prefers-color-scheme: dark)").matches
      );
    } else {
      htmlElement.classList.toggle("dark", theme === "dark");
    }
  }, [theme]);

  const toggleTheme = (newTheme: Theme) => {
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);

    const htmlElement = document.documentElement;
    if (newTheme === "system") {
      htmlElement.classList.toggle(
        "dark",
        window.matchMedia("(prefers-color-scheme: dark)").matches
      );
    } else {
      htmlElement.classList.toggle("dark", newTheme === "dark");
    }
  };

  if (theme === undefined) {
    return null;
  }

  return (
    <div className="flex space-x-2">
      {theme === "dark" ? (
        <button
          onClick={() => toggleTheme("light")}
          className={`active:animate-spin duration-200`}
        >
          <Image src={"/images/sun.svg"} alt="light" height={32} width={34} />
        </button>
      ) : (
        <button
          onClick={() => toggleTheme("dark")}
          className={`active:animate-spin`}
        >
          <Image src={"/images/moon.svg"} alt="light" height={32} width={34} />
        </button>
      )}

      {/* <button
        onClick={() => toggleTheme("system")}
        className={`px-4 py-2 rounded-md ${
          theme === "system" ? "bg-brand-blue-500 text-white" : "hidden"
        } hover:bg-brand-blue-600 dark:hover:bg-brand-blue-400 transition-colors duration-200`}
      >
        <img
          src="http://googleusercontent.com/image_generation_content/3"
          alt="System Theme"
          style={{ width: "24px", height: "24px" }}
        />
      </button> */}
    </div>
  );
}
