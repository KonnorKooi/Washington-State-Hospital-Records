import React, { ChangeEvent, useState } from "react";

type FilterType = Record<string, boolean>;

type CheckboxChangeHandler = (event: ChangeEvent<HTMLInputElement>) => void;

const Filters = ({
    checkboxFilters,
    handleCheckboxChange,
    filterOptions = [],
}: {
    checkboxFilters: FilterType;
    handleCheckboxChange: CheckboxChangeHandler;
    filterOptions: string[];
}) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="card bg-primary bg-opacity-10">
            <button
                className="text-xl font-semibold flex justify-between items-center w-full"
                onClick={() => setIsOpen(!isOpen)}>
                Filters
                <svg
                    className={`w-6 h-6 transition-transform ${
                        isOpen ? "transform rotate-180" : ""
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                    />
                </svg>
            </button>
            {isOpen && (
                <div className="grid grid-cols-2 gap-4 p-4">
                    {filterOptions.map((key) => (
                        <label
                            key={key}
                            className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                name={key}
                                checked={checkboxFilters[key]}
                                onChange={handleCheckboxChange}
                                className="form-checkbox h-5 w-5 text-secondary"
                            />
                            <span className="text-sm">{key}</span>
                        </label>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Filters;
