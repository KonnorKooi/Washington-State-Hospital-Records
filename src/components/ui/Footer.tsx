import React from "react";

const Footer: React.FC = () => {
    return (
        <footer className="footer footer-center p-10 bg-base-300 text-primary-content">
            <aside>
                <p className="font-bold">
                    All data is sourced from <br />
                    <a
                        href="https://doh.wa.gov/data-statistical-reports/healthcare-washington/hospital-and-patient-data/hospital-policies"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="link link-hover underline">
                        The Washington State Department of Health.
                    </a>
                </p>
                <p>Copyright © 2024 - All right reserved</p>
            </aside>
        </footer>
    );
};

export default Footer;
