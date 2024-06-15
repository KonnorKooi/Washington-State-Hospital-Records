// hooks/useFetchHospitals.ts
import { useEffect, useState } from "react";
import Papa from "papaparse";
import { Hospital } from "../types/types";

export const useFetchHospitals = () => {
    const [hospitals, setHospitals] = useState<Hospital[]>([]);
    const [filteredHospitals, setFilteredHospitals] = useState<Hospital[]>([]);

    useEffect(() => {
        fetch("/data/hospitals.csv")
            .then((response) => response.text())
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

    return { hospitals, filteredHospitals, setFilteredHospitals };
};
export type { Hospital };

