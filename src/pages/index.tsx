"use client";

import React, { useState, useEffect, useRef } from "react";
import Navbar from "@/components/ui/Navbar";
import HospitalBlock from "@/components/ui/HospitalBlock";
import MapComponent from "@/components/ui/MapComponent";
import Filters from "@/components/ui/Filters";
import ScrollArea from "@/components/ui/ScrollArea";
import { useFetchHospitals, Hospital } from "@/hooks/useFetchHospitals";
import { metadata } from "../metadata";

const HomePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState("reproductive");
  const { hospitals, filteredHospitals, setFilteredHospitals } = useFetchHospitals(activeTab);
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedHospital, setExpandedHospital] = useState<Hospital | null>(null);
  const hospitalRefs = useRef<(HTMLDivElement | null)[]>([]);

  const reproductiveFilters = {
    "Medication abortion": false,
    "Surgical abortion": false,
    "Birth control": false,
    "Contraceptive counseling": false,
    "Hospital pharmacy dispenses contraception": false,
    "Removal of contraceptive devices": false,
    "Tubal ligations": false,
    Vasectomies: false,
    "Emergency Contraception w/SA": false,
    "Emergency Contraception w/out SA": false,
    "Infertility Counseling": false,
    "Infertility testing and diagnoses": false,
    "Infertility treatment including IVF": false,
    "HIV testing": false,
    "HIV treatment": false,
    "PrEP and PEP w/counseling": false,
    "STD testing/treatment": false,
    "Treating miscarriages and ectopic pregnancies": false,
    "Pregnancy counseling": false,
    "Pregnancy genetic counseling": false,
    "Pregnancy Labor and Delivery": false,
    "Pregnancy NICU": false,
    "Pregnancy prenatal care": false,
    "Pregnancy Postnatal Care": false,
    "Pregnancy Ultrasound": false,
  };

  const endOfLifeFilters = {
    "Behavioral/Substance?": false,
    "Recent enough for use?": false,
    "Incorrect form?": false,
    "Written Policies & Procedures on ACP and AD": false,
    "Offers info and support for ACP": false,
    "Asks patient about ACP": false,
    "Assists patients with ACP": false,
    "Provides EOL education": false,
    "Provides treatment option evaluation": false,
    "Provides hospice care": false,
    "Provides palliative care": false,
    "Provides spiritual care": false,
    "Provides ethics consultation services": false,
    "Provide referrals/resources for palliative care": false,
    "Provides pain and symptom consultation": false,
    "Reviews and Honors POLST": false,
    "DWD: allows providers to participate": false,
    "Provides DWD educational materials": false,
    "Pharmacies dispense DWD medication": false,
    "Patients can self-admin DWD medication at hospital": false,
  };

  const [checkboxFilters, setCheckboxFilters] = useState(reproductiveFilters);

 useEffect(() => {
   const newFilters = activeTab === "reproductive" ? { ...reproductiveFilters } : { ...endOfLifeFilters };
   setCheckboxFilters((prevFilters) => ({
     ...prevFilters,
     ...newFilters,
   }));
 }, [activeTab]);

  const handleMarkerClick = (hospital: Hospital) => {
    const index = hospitals.indexOf(hospital);
    if (index !== -1 && hospitalRefs.current[index]) {
      hospitalRefs.current[index]?.scrollIntoView({ behavior: "smooth" });
    }
    setExpandedHospital(hospital);
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const term = event.target.value.toLowerCase();
    setSearchTerm(term);
  };

  useEffect(() => {
    const filtered = hospitals.filter((hospital) => {
      const matchesSearchTerm =
        hospital.Hospital.toLowerCase().includes(searchTerm) ||
        (hospital.City && hospital.City.toLowerCase().includes(searchTerm)) ||
        (hospital.State && hospital.State.toLowerCase().includes(searchTerm));

      const matchesCheckboxFilters = Object.entries(checkboxFilters).every(
        ([key, value]) =>
          !value || (hospital[key] && hospital[key].toLowerCase() === "yes")
      );

      return matchesSearchTerm && matchesCheckboxFilters;
    });

    setFilteredHospitals(filtered);
  }, [searchTerm, checkboxFilters, hospitals, setFilteredHospitals]);

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = event.target;
    setCheckboxFilters((prev) => ({ ...prev, [name]: checked }));
  };

  const handleSetExpandedHospital = (hospital?: Hospital) => {
    setExpandedHospital(hospital ?? null);
  };

  return (
    <div className="flex flex-col min-h-screen bg-graywhite font-poppins">
      <Navbar onTabChange={setActiveTab} />
      <div className="flex flex-1 w-full h-full flex-col lg:flex-row px-4 lg:px-20">
        <div className="flex flex-col w-full lg:w-3/4 p-5">
          <div className="flex items-center justify-between p-3 border border-gray-300 rounded-md mb-5 bg-lightblue">
            <h2 className="text-xl mb-0">Hospital Search</h2>
            <input
              type="text"
              placeholder="Type here"
              value={searchTerm}
              onChange={handleSearch}
              className="input input-bordered w-full lg:w-auto"
            />
          </div>
          <div className="border border-gray-300 rounded-md">
            <MapComponent
              apiKey={process.env.NEXT_PUBLIC_GOOGLE_API_KEY ?? ""}
              mapId={process.env.NEXT_PUBLIC_MAP_ID ?? ""}
              hospitals={filteredHospitals}
              onMarkerClick={handleMarkerClick}
            />
          </div>
          <div className="mt-5">
            <Filters
              checkboxFilters={checkboxFilters}
              handleCheckboxChange={handleCheckboxChange}
              filterOptions={Object.keys(checkboxFilters)}
            />
          </div>
        </div>
        <div className="flex flex-col w-full lg:w-1/4 p-5 h-full">
          <ScrollArea className="p-5 border border-gray-300 rounded-md bg-lightblue overflow-y-auto" style={{ height: '800px' }}>
            {filteredHospitals.map((hospital, index) => (
              <div
                key={index}
                ref={(el) => {
                  if (el) {
                    hospitalRefs.current[index] = el;
                  }
                }}>
                <HospitalBlock
                  key={hospital.id}
                  hospital={hospital}
                  expanded={expandedHospital === hospital}
                  setExpandedHospital={handleSetExpandedHospital}
                />
              </div>
            ))}
          </ScrollArea>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
