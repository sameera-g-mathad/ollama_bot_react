import React from "react";

interface sidebarInterface {
    isOpen: boolean
}
export const SideBar: React.FC<sidebarInterface> = ({ isOpen }) => {
    return <div className={`transition-all duration-500 top-0 left-0 absolute h-full border bg-gray-200 ${isOpen ? 'w-72 opacity-100' : 'w-0 opacity-0'}`}>
        <div className="!mt-16">
            SideBar
        </div>
    </div>;
};
