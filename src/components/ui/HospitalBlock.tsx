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
      blockRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [expanded]);

  const toggleExpanded = (hospital?: Hospital) => {
    setExpandedHospital(expanded ? undefined : hospital);
  };

  return (
    <div
      ref={blockRef}
      className="border p-4 rounded-md cursor-pointer mb-4 bg-graywhite"
      onClick={() => toggleExpanded(hospital)}>
      <div className="font-bold">{hospital.Hospital}</div>
      <div>
        {hospital.City}, {hospital.State}
      </div>
      {expanded && (
        <div className="mt-4 space-y-2">
          {Object.keys(hospital).map(
            (key) =>
              key !== "Hospital" &&
              key !== "City" &&
              key !== "State" &&
              key !== "Lat" &&
              key !== "Long" &&
              renderProperty(key, hospital[key])
          )}
        </div>
      )}
    </div>
  );
};

export default HospitalBlock;
