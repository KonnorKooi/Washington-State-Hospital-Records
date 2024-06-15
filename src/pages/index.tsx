"use client";

import React, { useState, useEffect, useRef } from "react";
import Navbar from "@/components/ui/Navbar";
import HospitalBlock from "@/components/ui/HospitalBlock"; // Ensure this path is correct
import MapComponent from "@/components/ui/MapComponent"; // Ensure this path is correct
import Filters from "@/components/ui/Filters";
import ScrollArea from "@/components/ui/ScrollArea"; // Default import instead of named import
import { useFetchHospitals, Hospital } from "@/hooks/useFetchHospitals";
import { metadata } from "../metadata";

const HomePage: React.FC = () => {
  const { hospitals, filteredHospitals, setFilteredHospitals } = useFetchHospitals();
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedHospital, setExpandedHospital] = useState<Hospital | null>(null);
  const hospitalRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [checkboxFilters, setCheckboxFilters] = useState({
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
  });

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

  return (
    <div className="flex flex-col min-h-screen bg-graywhite font-poppins">
      <Navbar />
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
          <div className="flex-1">
            <MapComponent
              apiKey={process.env.NEXT_PUBLIC_GOOGLE_API_KEY ?? ""}
              mapId={process.env.NEXT_PUBLIC_MAP_ID ?? ""}
              hospitals={filteredHospitals}
              onMarkerClick={handleMarkerClick}
            />
          </div>
          <div className="p-5 border border-gray-300 rounded-md mt-5">
            <Filters
              checkboxFilters={checkboxFilters}
              handleCheckboxChange={handleCheckboxChange}
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
                  setExpandedHospital={setExpandedHospital}
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
