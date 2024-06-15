// src/components/ui/Filters.tsx
import React, { ChangeEvent } from "react";

type CheckboxChangeHandler = (event: ChangeEvent<HTMLInputElement>) => void;

const Filters = ({
  checkboxFilters,
  handleCheckboxChange,
}: {
  checkboxFilters: Record<string, boolean>;
  handleCheckboxChange: CheckboxChangeHandler;
}) => {
  return (
    <div className="grid grid-cols-2 gap-4 mt-3">
      {Object.keys(checkboxFilters).map((key) => (
        <label key={key} className="flex items-center space-x-2">
          <input
            type="checkbox"
            name={key}
            checked={checkboxFilters[key]}
            onChange={handleCheckboxChange}
            className="checkbox h-5 w-5 text-darkgreen"
          />
          <span className="text-gray-700">{key}</span>
        </label>
      ))}
    </div>
  );
};

export default Filters;
