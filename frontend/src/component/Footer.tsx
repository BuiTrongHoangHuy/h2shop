import React from "react";
import { Globe } from "lucide-react";

const Footer: React.FC = () => {
    return (
        <footer className="bg-neutral-900 text-white text-sm px-4 py-6 flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 text-neutral-400">
                <span className="flex items-center space-x-1">
                    <Globe className="w-4 h-4 text-white" />
                    <span>Vietnam</span>
                </span>
                <span>|</span>
                <span>English (US)</span>
                <span>|</span>
                <span>₫ (VND)</span>
            </div>

            <div className="flex flex-wrap justify-center md:justify-end space-x-5 mt-2 md:mt-0 text-neutral-400">
                <a href="#" className="hover:underline">Terms of Use</a>
                <a href="#" className="hover:underline">Privacy</a>
                <a href="#" className="hover:underline">Interest-based ads</a>
                <a href="#" className="hover:underline">Local Shops</a>
                <a href="#" className="hover:underline">Regions</a>
            </div>
        </footer>
    );
};

export default Footer;
