// src/components/ui/Navbar.tsx
import React, { useState } from "react";
import Image from 'next/image';

const Navbar = () => {
  const [activeTab, setActiveTab] = useState("reproductive");

  return (
    <div className="navbar bg-darkblue">
      <div className="flex-1 flex items-center">
        <Image src="/images/logo_nobg.png" alt="Logo" width={40} height={40}  />
        <a className="btn btn-ghost text-xl">WA Care Access Transparency Project</a>
      </div>
      <div className="flex-none">
        <div role="tablist" className="tabs tabs-boxed">
          <a
            role="tab"
            className={`tab ${activeTab === "reproductive" ? "tab-active" : ""}`}
            onClick={() => setActiveTab("reproductive")}
          >
            Reproductive Info
          </a>
          <a
            role="tab"
            className={`tab ${activeTab === "end_of_life" ? "tab-active" : ""}`}
            onClick={() => setActiveTab("end_of_life")}
          >
            End of Life Services Info
          </a>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
