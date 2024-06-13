"use client";
import React, { useState, useEffect, useRef } from "react";
import Navbar from "@/components/ui/Navbar";
import Papa from "papaparse";
import HospitalBlock from "@/components/ui/HospitalBlock";
import MapComponent from "@/components/ui/MapComponent";
import Filters from "@/components/ui/Filters";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Hospital {
  id: string;
  Hospital: string;
  City?: string;
  State?: string;
  Lat: string;
  Long: string;
  [key: string]: any; // For dynamic properties
}

const HomePage: React.FC = () => {
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredHospitals, setFilteredHospitals] = useState<Hospital[]>([]);
  const [expandedHospital, setExpandedHospital] = useState<Hospital | null>(
    null
  ); // Added state for expanded hospital
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

  useEffect(() => {
    fetch("/data/hospitals.csv")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.text();
      })
      .then((data) => {
        Papa.parse(data, {
          header: true,
          skipEmptyLines: true,
          complete: (result) => {
            const parsedData = result.data.map((hospital: any) => ({
              ...hospital,
              lat: parseFloat(hospital.Lat),
              long: parseFloat(hospital.Long),
            }));
            setHospitals(parsedData);
            setFilteredHospitals(parsedData);
          },
          error: (error: any) => {
            console.error("Error parsing the CSV file:", error);
          },
        });
      })
      .catch((error) => console.error("Error fetching the CSV file:", error));
  }, []);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const term = event.target.value.toLowerCase();
    setSearchTerm(term);
    // console.log("apikey:", process.env.NEXT_PUBLIC_GOOGLE_API_KEY);
    // console.log("apikey:", process.env.NEXT_PUBLIC_MAP_ID);
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
  }, [searchTerm, checkboxFilters, hospitals]);

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = event.target;
    setCheckboxFilters((prev) => ({ ...prev, [name]: checked }));
  };

  return (
    <div className="flex flex-col h-screen">
      <Navbar />
      <div className="flex flex-1 w-full h-full">
        <div className="flex flex-col w-1/4 p-5 border-r border-gray-200">
          <ScrollArea className="p-5 border border-gray-200 rounded-md overflow-y-auto flex-1">
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
        <div className="flex flex-col flex-1 p-5">
          <div className="p-5 border border-gray-200 rounded-md mb-5">
            <h2 className="text-2xl font-bold mb-3">Hospital Search</h2>
            <input
              type="text"
              placeholder="Search hospitals..."
              value={searchTerm}
              onChange={handleSearch}
              className="p-2 w-full border border-gray-300 rounded-md"
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
          <div className="p-5 border border-gray-200 rounded-md mt-5">
            <Filters
              checkboxFilters={checkboxFilters}
              handleCheckboxChange={handleCheckboxChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
