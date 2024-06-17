import React, { ChangeEvent } from "react";

type CheckboxChangeHandler = (event: ChangeEvent<HTMLInputElement>) => void;

const Filters = ({
  checkboxFilters,
  handleCheckboxChange,
  filterOptions = []
}: {
  checkboxFilters: Record<string, boolean>;
  handleCheckboxChange: CheckboxChangeHandler;
  filterOptions: string[];
}) => {
  return (
    <details className="collapse collapse-arrow bg-lightblue">
      <summary className="collapse-title text-xl font-medium">Filters</summary>
      <div className="collapse-content bg-lightblue ">
        <div className="grid grid-cols-2 gap-4 mt-3">
          {filterOptions.map((key) => (
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
      </div>
    </details>
  );
};

export default Filters;
