import React from "react";
import ThemeSwitcher from "../common/ThemeSwitcher";

export default function Navbar() {
  return (
    <div className="flex w-full bg-transparent fixed justify-between">
      <p className="md:mt-6 md:ml-10">Inideg</p>
      <div className="md:flex hidden justify-between gap-3 mt-6 px-10 ml-20 text-md w-full">
        <div>
          <ul className="flex justify-between gap-3">
            <li>Home</li>
            <li>Categories</li>
            <li>Businesses</li>
            <ThemeSwitcher />
          </ul>
        </div>
      </div>
      <div className=" justify-between gap-3 md:flex hidden mt-6">
        <p>Login</p>
        <p>Sign Up</p>
      </div>
      <div className="md:hidden flex px-20">|||</div>
    </div>
  );
}
