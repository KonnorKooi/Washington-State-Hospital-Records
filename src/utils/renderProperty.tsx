import React from "react";

const renderProperty = (label: string, value: any) => {
  const isYesNo = (val: any) => {
    return typeof val === "string" && (val.toLowerCase() === "yes" || val.toLowerCase() === "no");
  };

  const getClassName = (val: any) => {
    if (isYesNo(val)) {
      return val.toLowerCase() === "yes" ? "text-green-500" : "text-red-500";
    }
    return "";
  };

  return (
    <div className={getClassName(value)}>
      {label}: {value || "N/A"}
    </div>
  );
};

export default renderProperty;
