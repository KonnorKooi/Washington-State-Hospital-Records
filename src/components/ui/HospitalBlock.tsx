import React, { useEffect, useRef, useState } from "react";
interface Hospital {
  id: string;
  Hospital: string;
  City?: string;
  State?: string;
  Lat: string;
  Long: string;
  [key: string]: any; // For dynamic properties
}

type HospitalBlockProps = {
  hospital: Hospital;
  expanded: boolean;
  setExpandedHospital: React.Dispatch<React.SetStateAction<Hospital | null>>;
};

const HospitalBlock: React.FC<HospitalBlockProps> = ({
  hospital,
  expanded,
  setExpandedHospital,
}) => {
  const blockRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (expanded) {
      if (blockRef.current) {
        blockRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  }, [expanded]);

  const toggleExpanded = () => {
    setExpandedHospital(expanded ? null : hospital);
  };

  const isYesNo = (value: string | undefined) => {
    return (
      value && (value.toLowerCase() === "yes" || value.toLowerCase() === "no")
    );
  };

  return (
    <div
      ref={blockRef}
      className="border p-4 rounded-md cursor-pointer mb-4 bg-graywhite"
      onClick={toggleExpanded}>
      <div className="font-bold">{hospital.Hospital}</div>
      <div>
        {hospital.City}, {hospital.State}
      </div>
      {expanded && (
        <div className="mt-4 space-y-2">
          <div
            className={
              isYesNo(hospital.Address)
                ? hospital.Address.toLowerCase() === "yes"
                  ? "text-green-500"
                  : "text-red-500"
                : ""
            }>
            Address: {hospital.Address || "N/A"}
          </div>
          <div
            className={
              isYesNo(hospital.City)
                ? hospital.City?.toLowerCase() === "yes"
                  ? "text-green-500"
                  : "text-red-500"
                : ""
            }>
            City: {hospital.City || "N/A"}
          </div>
          <div
            className={
              isYesNo(hospital.State)
                ? hospital.State?.toLowerCase() === "yes"
                  ? "text-green-500"
                  : "text-red-500"
                : ""
            }>
            State: {hospital.State || "N/A"}
          </div>
          <div
            className={
              isYesNo(hospital["Zip Code"])
                ? hospital["Zip Code"].toLowerCase() === "yes"
                  ? "text-green-500"
                  : "text-red-500"
                : ""
            }>
            Zip Code: {hospital["Zip Code"] || "N/A"}
          </div>
          <div
            className={
              isYesNo(hospital.Contact)
                ? hospital.Contact.toLowerCase() === "yes"
                  ? "text-green-500"
                  : "text-red-500"
                : ""
            }>
            Contact: {hospital.Contact || "N/A"}
          </div>
          <div
            className={
              isYesNo(hospital["Phone number"])
                ? hospital["Phone number"].toLowerCase() === "yes"
                  ? "text-green-500"
                  : "text-red-500"
                : ""
            }>
            Phone Number: {hospital["Phone number"] || "N/A"}
          </div>
          <div
            className={
              isYesNo(hospital["Date signed"])
                ? hospital["Date signed"].toLowerCase() === "yes"
                  ? "text-green-500"
                  : "text-red-500"
                : ""
            }>
            Date Signed: {hospital["Date signed"] || "N/A"}
          </div>
          <div
            className={
              hospital["Behavioral/Substance?"].toLowerCase() === "true"
                ? "text-green-500"
                : "text-red-500"
            }>
            Behavioral/Substance: {hospital["Behavioral/Substance?"] || "N/A"}
          </div>
          <div
            className={
              isYesNo(hospital["Medication abortion"])
                ? hospital["Medication abortion"].toLowerCase() === "yes"
                  ? "text-green-500"
                  : "text-red-500"
                : ""
            }>
            Medication Abortion: {hospital["Medication abortion"] || "N/A"}
          </div>
          <div
            className={
              isYesNo(hospital["Referrals for abortions"])
                ? hospital["Referrals for abortions"].toLowerCase() === "yes"
                  ? "text-green-500"
                  : "text-red-500"
                : ""
            }>
            Referrals for Abortions:{" "}
            {hospital["Referrals for abortions"] || "N/A"}
          </div>
          <div
            className={
              isYesNo(hospital["Surgical abortion"])
                ? hospital["Surgical abortion"].toLowerCase() === "yes"
                  ? "text-green-500"
                  : "text-red-500"
                : ""
            }>
            Surgical Abortion: {hospital["Surgical abortion"] || "N/A"}
          </div>
          <div
            className={
              isYesNo(hospital["Birth control"])
                ? hospital["Birth control"].toLowerCase() === "yes"
                  ? "text-green-500"
                  : "text-red-500"
                : ""
            }>
            Birth Control: {hospital["Birth control"] || "N/A"}
          </div>
          <div
            className={
              isYesNo(hospital["Contraceptive counseling"])
                ? hospital["Contraceptive counseling"].toLowerCase() === "yes"
                  ? "text-green-500"
                  : "text-red-500"
                : ""
            }>
            Contraceptive Counseling:{" "}
            {hospital["Contraceptive counseling"] || "N/A"}
          </div>
          <div
            className={
              isYesNo(hospital["Hospital pharmacy dispenses contraception"])
                ? hospital[
                    "Hospital pharmacy dispenses contraception"
                  ].toLowerCase() === "yes"
                  ? "text-green-500"
                  : "text-red-500"
                : ""
            }>
            Hospital Pharmacy Dispenses Contraception:{" "}
            {hospital["Hospital pharmacy dispenses contraception"] || "N/A"}
          </div>
          <div
            className={
              isYesNo(hospital["Removal of contraceptive devices"])
                ? hospital["Removal of contraceptive devices"].toLowerCase() ===
                  "yes"
                  ? "text-green-500"
                  : "text-red-500"
                : ""
            }>
            Removal of Contraceptive Devices:{" "}
            {hospital["Removal of contraceptive devices"] || "N/A"}
          </div>
          <div
            className={
              isYesNo(hospital["Tubal ligations"])
                ? hospital["Tubal ligations"].toLowerCase() === "yes"
                  ? "text-green-500"
                  : "text-red-500"
                : ""
            }>
            Tubal Ligations: {hospital["Tubal ligations"] || "N/A"}
          </div>
          <div
            className={
              isYesNo(hospital.Vasectomies)
                ? hospital.Vasectomies.toLowerCase() === "yes"
                  ? "text-green-500"
                  : "text-red-500"
                : ""
            }>
            Vasectomies: {hospital.Vasectomies || "N/A"}
          </div>
          <div
            className={
              isYesNo(hospital["Emergency Contraception w/SA"])
                ? hospital["Emergency Contraception w/SA"].toLowerCase() ===
                  "yes"
                  ? "text-green-500"
                  : "text-red-500"
                : ""
            }>
            Emergency Contraception w/SA:{" "}
            {hospital["Emergency Contraception w/SA"] || "N/A"}
          </div>
          <div
            className={
              isYesNo(hospital["Emergency Contraception w/out SA"])
                ? hospital["Emergency Contraception w/out SA"].toLowerCase() ===
                  "yes"
                  ? "text-green-500"
                  : "text-red-500"
                : ""
            }>
            Emergency Contraception w/out SA:{" "}
            {hospital["Emergency Contraception w/out SA"] || "N/A"}
          </div>
          <div
            className={
              isYesNo(hospital["Infertility Counseling"])
                ? hospital["Infertility Counseling"].toLowerCase() === "yes"
                  ? "text-green-500"
                  : "text-red-500"
                : ""
            }>
            Infertility Counseling:{" "}
            {hospital["Infertility Counseling"] || "N/A"}
          </div>
          <div
            className={
              isYesNo(hospital["Infertility testing and diagnoses"])
                ? hospital[
                    "Infertility testing and diagnoses"
                  ].toLowerCase() === "yes"
                  ? "text-green-500"
                  : "text-red-500"
                : ""
            }>
            Infertility Testing and Diagnoses:{" "}
            {hospital["Infertility testing and diagnoses"] || "N/A"}
          </div>
          <div
            className={
              isYesNo(hospital["Infertility treatment including IVF"])
                ? hospital[
                    "Infertility treatment including IVF"
                  ].toLowerCase() === "yes"
                  ? "text-green-500"
                  : "text-red-500"
                : ""
            }>
            Infertility Treatment including IVF:{" "}
            {hospital["Infertility treatment including IVF"] || "N/A"}
          </div>
          <div
            className={
              isYesNo(hospital["HIV testing"])
                ? hospital["HIV testing"].toLowerCase() === "yes"
                  ? "text-green-500"
                  : "text-red-500"
                : ""
            }>
            HIV Testing: {hospital["HIV testing"] || "N/A"}
          </div>
          <div
            className={
              isYesNo(hospital["HIV treatment"])
                ? hospital["HIV treatment"].toLowerCase() === "yes"
                  ? "text-green-500"
                  : "text-red-500"
                : ""
            }>
            HIV Treatment: {hospital["HIV treatment"] || "N/A"}
          </div>
          <div
            className={
              isYesNo(hospital["PrEP and PEP w/counseling"])
                ? hospital["PrEP and PEP w/counseling"].toLowerCase() === "yes"
                  ? "text-green-500"
                  : "text-red-500"
                : ""
            }>
            PrEP and PEP w/counseling:{" "}
            {hospital["PrEP and PEP w/counseling"] || "N/A"}
          </div>
          <div
            className={
              isYesNo(hospital["STD testing/treatment"])
                ? hospital["STD testing/treatment"].toLowerCase() === "yes"
                  ? "text-green-500"
                  : "text-red-500"
                : ""
            }>
            STD Testing/Treatment: {hospital["STD testing/treatment"] || "N/A"}
          </div>
          <div
            className={
              isYesNo(hospital["Treating miscarraiges and ectopic pregnancies"])
                ? hospital[
                    "Treating miscarraiges and ectopic pregnancies"
                  ].toLowerCase() === "yes"
                  ? "text-green-500"
                  : "text-red-500"
                : ""
            }>
            Treating Miscarriages and Ectopic Pregnancies:{" "}
            {hospital["Treating miscarraiges and ectopic pregnancies"] || "N/A"}
          </div>
          <div
            className={
              isYesNo(hospital["Pregnancy counseling"])
                ? hospital["Pregnancy counseling"].toLowerCase() === "yes"
                  ? "text-green-500"
                  : "text-red-500"
                : ""
            }>
            Pregnancy Counseling: {hospital["Pregnancy counseling"] || "N/A"}
          </div>
          <div
            className={
              isYesNo(hospital["Pregnancy genetic counseling"])
                ? hospital["Pregnancy genetic counseling"].toLowerCase() ===
                  "yes"
                  ? "text-green-500"
                  : "text-red-500"
                : ""
            }>
            Pregnancy Genetic Counseling:{" "}
            {hospital["Pregnancy genetic counseling"] || "N/A"}
          </div>
          <div
            className={
              isYesNo(hospital["Pregnancy Labor and Delivery"])
                ? hospital["Pregnancy Labor and Delivery"].toLowerCase() ===
                  "yes"
                  ? "text-green-500"
                  : "text-red-500"
                : ""
            }>
            Pregnancy Labor and Delivery:{" "}
            {hospital["Pregnancy Labor and Delivery"] || "N/A"}
          </div>
          <div
            className={
              isYesNo(hospital["Pregnancy NICU"])
                ? hospital["Pregnancy NICU"].toLowerCase() === "yes"
                  ? "text-green-500"
                  : "text-red-500"
                : ""
            }>
            Pregnancy NICU: {hospital["Pregnancy NICU"] || "N/A"}
          </div>
          <div
            className={
              isYesNo(hospital["Pregnancy prenatal care"])
                ? hospital["Pregnancy prenatal care"].toLowerCase() === "yes"
                  ? "text-green-500"
                  : "text-red-500"
                : ""
            }>
            Pregnancy Prenatal Care:{" "}
            {hospital["Pregnancy prenatal care"] || "N/A"}
          </div>
          <div
            className={
              isYesNo(hospital["Pregnancy Postnatal Care"])
                ? hospital["Pregnancy Postnatal Care"].toLowerCase() === "yes"
                  ? "text-green-500"
                  : "text-red-500"
                : ""
            }>
            Pregnancy Postnatal Care:{" "}
            {hospital["Pregnancy Postnatal Care"] || "N/A"}
          </div>
          <div
            className={
              isYesNo(hospital["Pregnancy Ultrasound"])
                ? hospital["Pregnancy Ultrasound"].toLowerCase() === "yes"
                  ? "text-green-500"
                  : "text-red-500"
                : ""
            }>
            Pregnancy Ultrasound: {hospital["Pregnancy Ultrasound"] || "N/A"}
          </div>
          <div
            className={
              isYesNo(hospital["Additional Comments"])
                ? hospital["Additional Comments"].toLowerCase() === "yes"
                  ? "text-green-500"
                  : "text-red-500"
                : ""
            }>
            Additional Comments: {hospital["Additional Comments"] || "N/A"}
          </div>
          <div
            className={
              isYesNo(hospital["Lat"])
                ? hospital["Lat"].toLowerCase() === "yes"
                  ? "text-green-500"
                  : "text-red-500"
                : ""
            }>
            Latitude: {hospital["Lat"] || "N/A"}
          </div>
          <div
            className={
              isYesNo(hospital["Long"])
                ? hospital["Long"].toLowerCase() === "yes"
                  ? "text-green-500"
                  : "text-red-500"
                : ""
            }>
            Longitude: {hospital["Long"] || "N/A"}
          </div>
        </div>
      )}
    </div>
  );
};

export default HospitalBlock;
