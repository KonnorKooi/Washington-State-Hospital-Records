import React, { useState } from "react";
import Image from "next/image";

const Navbar = ({ onTabChange }: { onTabChange: (tab: string) => void }) => {
    const [activeTab, setActiveTab] = useState("reproductive");

    const handleTabChange = (tab: string) => {
        setActiveTab(tab);
        onTabChange(tab);
    };

    return (
        <nav className="bg-darkblue p-2 sm:p-4 shadow-md">
            <div className="container mx-auto px-4">
                <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between">
                    <div className="flex items-center mb-4 sm:mb-0">
                        <Image
                            src="/images/logo_nobg.png"
                            alt="Logo"
                            width={40}
                            height={40}
                            className="mr-2 sm:mr-4 w-8 h-8 sm:w-10 sm:h-10"
                        />
                        <div>
                            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white">
                                Washington Care Access
                            </h1>
                            <p className="text-lightblue text-xs sm:text-sm md:text-base">
                                Transparency Initiative
                            </p>
                        </div>
                    </div>
                    <div className="flex space-x-2 sm:space-x-4 sm:mt-2">
                        <button
                            className={`px-3 py-1 sm:px-4 sm:py-2 text-sm sm:text-base font-medium transition-colors duration-200 border-b-4 ${
                                activeTab === "reproductive"
                                    ? "text-white border-white"
                                    : "text-lightblue border-lightblue hover:border-lightblue"
                            }`}
                            onClick={() => handleTabChange("reproductive")}>
                            Reproductive
                        </button>
                        <button
                            className={`px-3 py-1 sm:px-4 sm:py-2 text-sm sm:text-base font-medium transition-colors duration-200 border-b-4 ${
                                activeTab === "end_of_life"
                                    ? "text-white border-white"
                                    : "text-lightblue border-lightblue hover:border-lightblue"
                            }`}
                            onClick={() => handleTabChange("end_of_life")}>
                            End of Life
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
