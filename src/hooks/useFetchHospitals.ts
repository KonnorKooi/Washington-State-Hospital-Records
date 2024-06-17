import { useEffect, useState } from "react";
import Papa from "papaparse";

export interface Hospital {
    id: string;
    Hospital: string;
    City?: string;
    State?: string;
    Lat: number;
    Long: number;
    [key: string]: any; // For dynamic properties
}

export const useFetchHospitals = (tab: string) => {
    const [hospitals, setHospitals] = useState<Hospital[]>([]);
    const [filteredHospitals, setFilteredHospitals] = useState<Hospital[]>([]);

    useEffect(() => {
        const csvFile = tab === "reproductive" ? "/data/reproductive.csv" : "/data/endoflife.csv";

        fetch(csvFile)
            .then((response) => response.text())
            .then((data) => {
                Papa.parse(data, {
                    header: true,
                    skipEmptyLines: true,
                    complete: (result) => {
                        const parsedData = result.data.map((hospital: any) => ({
                            ...hospital,
                            Lat: parseFloat(hospital.Lat),
                            Long: parseFloat(hospital.Long),
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
    }, [tab]);

    return { hospitals, filteredHospitals, setFilteredHospitals };
};
