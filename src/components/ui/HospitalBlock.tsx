import React, { useEffect, useRef } from "react";
import renderProperty from "../../utils/renderProperty";
import { Hospital } from "../../types/types";
const HospitalBlock = ({
    hospital,
    expanded,
    setExpandedHospital,
}: {
    hospital: Hospital;
    expanded: boolean;
    setExpandedHospital: (hospital?: Hospital) => void;
}) => {
    const blockRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        if (expanded && blockRef.current) {
            blockRef.current.scrollIntoView({
                behavior: "smooth",
                block: "start",
            });
        }
    }, [expanded]);

    const toggleExpanded = (hospital?: Hospital) => {
        setExpandedHospital(expanded ? undefined : hospital);
    };

    return (
        <div
            ref={blockRef}
            className="card mb-4 cursor-pointer transition-shadow hover:shadow-lg"
            onClick={() => toggleExpanded(hospital)}>
            <h3 className="text-lg font-semibold">{hospital.Hospital}</h3>
            <p className="text-sm text-gray-600">
                {hospital.City}, {hospital.State}
            </p>
            {expanded && (
                <div className="mt-4 space-y-2">
                    {Object.entries(hospital).map(
                        ([key, value]) =>
                            key !== "Hospital" &&
                            key !== "City" &&
                            key !== "State" &&
                            key !== "Lat" &&
                            key !== "Long" && (
                                <div key={key}>
                                    {renderProperty(key, value)}
                                </div>
                            )
                    )}
                </div>
            )}
        </div>
    );
};
export default HospitalBlock;
