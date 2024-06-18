import React, { useState } from "react";
import Image from "next/image";

const Navbar = ({ onTabChange }: { onTabChange: (tab: string) => void }) => {
  const [activeTab, setActiveTab] = useState("reproductive");

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    onTabChange(tab);
  };

  return (
    <div className="navbar bg-darkblue flex flex-col lg:flex-row">
      <div className="flex-1 flex items-center">
        <Image src="/images/logo_nobg.png" alt="Logo" width={40} height={40} />
        <div className="ml-2 text-2xl text-graywhite">
          WA Care Access Transparency
        </div>
      </div>
      <div className="flex-none mt-2 lg:mt-0">
        <div
          role="tablist"
          className="tabs tabs-boxed flex flex-row lg:flex-row">
          <a
            role="tab"
            className={`tab ${
              activeTab === "reproductive" ? "tab-active" : ""
            }`}
            onClick={() => handleTabChange("reproductive")}>
            Reproductive Info
          </a>
          <a
            role="tab"
            className={`tab ${activeTab === "end_of_life" ? "tab-active" : ""}`}
            onClick={() => handleTabChange("end_of_life")}>
            End of Life Services Info
          </a>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
