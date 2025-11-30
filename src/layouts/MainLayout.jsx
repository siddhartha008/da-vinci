import React from 'react';

const MainLayout = ({ children }) => {
    return (
        <div className="w-full min-h-screen bg-[#FDFBF7] text-slate-800 font-sans">
            {children}
        </div>
    );
};

export default MainLayout;
