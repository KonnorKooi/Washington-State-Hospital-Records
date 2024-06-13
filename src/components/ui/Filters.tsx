import React from "react";

const Filters = ({ checkboxFilters, handleCheckboxChange }) => {
  return (
    <div className="grid grid-cols-2 gap-4 mt-3">
      {Object.keys(checkboxFilters).map((key) => (
        <label key={key} className="flex items-center space-x-2">
          <input
            type="checkbox"
            name={key}
            checked={checkboxFilters[key]}
            onChange={handleCheckboxChange}
            className="form-checkbox h-5 w-5 text-accent"
          />
          <span>{key}</span>
        </label>
      ))}
    </div>
  );
};

export default Filters;
