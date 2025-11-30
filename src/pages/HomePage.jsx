import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Upload, History, Settings, HelpCircle, Menu, X, LogOut } from 'lucide-react';
import logo from '../assets/logo.png';

const HomePage = ({ history, setHistory }) => {
    const navigate = useNavigate();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // Get all history items for display
    const displayHistory = history || [];

    return (
        <div className="min-h-screen bg-[#FDFBF7] relative overflow-hidden flex">
            {/* Mobile Menu Toggle */}
            <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="absolute top-6 left-6 z-50 lg:hidden p-2 rounded-full bg-[#E8F5EC] text-[#2D2D2D]"
            >
                {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Left Sidebar */}
            <div className={`
                fixed inset-y-0 left-0 z-40 w-72 bg-[#E8F5EC] p-8 flex flex-col gap-6 
                transform transition-transform duration-300 ease-in-out
                lg:relative lg:translate-x-0
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>
                <div className="flex-col items-center gap-3 mt-12 md:mt-0 flex">
                    <div className="w-24 h-24 rounded-full border-4 border-[#5FB57C] flex items-center justify-center bg-white">
                        <User className="text-[#2D2D2D]" size={48} />
                    </div>
                    <h2 className="text-4xl font-bold text-[#2D2D2D]">Young Inventor</h2>
                    <p className="text-lg text-[#2D2D2D]/70 font-bold">Team Alpha</p>
                </div>

                <div className="flex-1 flex flex-col gap-4 overflow-y-auto">
                    <h3 className="text-xl font-bold text-[#2D2D2D] border-b-2 border-[#2D2D2D]/10 pb-2">
                        Your Chats
                    </h3>
                    <ul className="space-y-3 text-[#2D2D2D]">
                        {displayHistory.map((item) => (
                            <li
                                key={item.id}
                                className="p-3 border-2 border-[#2D2D2D]/10 rounded-xl bg-white/50 hover:bg-white hover:border-[#5FB57C] cursor-pointer transition-all group"
                                onClick={() => navigate('/chat', { state: { chat: item } })}
                            >
                                <span className="text-lg font-semibold block truncate">{item.title}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                <button
                    className="flex items-center gap-3 text-[#2D2D2D] font-bold text-lg hover:text-[#FF6B6B] transition-colors mt-auto pt-4 border-t-2 border-[#2D2D2D]/10"
                    onClick={() => navigate('/')}
                >
                    <LogOut size={24} strokeWidth={2.5} />
                    Log Out
                </button>
            </div>

            {/* Center Content */}
            <div className="flex-1 flex flex-col items-start justify-start pt-24 md:pt-16 pl-8 md:pl-12 relative z-0">
                <h1 className="text-6xl font-bold text-[#2D2D2D] mb-2 font-handwriting">
                    Da Vinci
                </h1>
                <p className="text-lg text-[#2D2D2D]/80 max-w-xs md:max-w-none">
                    Sharpen your curiosity.
                </p>
            </div>

            {/* Right Side - Plant & Buttons Container */}
            <div className="fixed md:absolute right-[-31%] md:right-[-10%] lg:right-[5%] bottom-0 h-[75vh] md:h-[90vh] z-0 flex justify-end items-end pointer-events-none ">

                {/* 1. The Image */}
                <img
                    src={logo}
                    alt="Plant decoration"
                    className="h-full w-auto max-w-none object-contain object-bottom"
                />

                {/* 2. The Buttons */}
                <div className="absolute inset-0 pointer-events-auto">

                    {/* New Chat Button */}
                    <button
                        onClick={() => navigate('/chat')}
                        className="group flex flex-col items-center absolute top-[32%] right-[30%] md:top-[40%] md:right-[33.5%] lg:top-[42%] lg:right-[33%] z-10"
                    >
                        <div className="w-16 h-16 rounded-full border-2 border-[#5FB57C] bg-[#E8F5EC] hover:bg-[#FDFBF7] hover:border-[#4BA869] transition-all flex items-center justify-center group-hover:scale-110 transform duration-200 animate-float">
                            <Upload className="text-[#2D2D2D]" size={28} strokeWidth={2.5} />
                        </div>
                        <span className="mt-2 text-lg text-[#2D2D2D] font-bold">
                            New Chat
                        </span>
                    </button>

                    {/* History Button*/}
                    <button
                        onClick={() => navigate('/history')}
                        className="group flex flex-col items-center absolute top-[51%] right-[36%] md:top-[60%] md:right-[39%] lg:top-[62%] lg:right-[39%] z-10"
                    >
                        <div className="w-16 h-16 rounded-full border-2 border-[#5FB57C] bg-[#E8F5EC] hover:bg-[#FDFBF7] hover:border-[#4BA869] transition-all flex items-center justify-center group-hover:scale-110 transform duration-200 animate-float-delay-1">
                            <History className="text-[#2D2D2D]" size={28} strokeWidth={2.5} />
                        </div>
                        <span className="mt-2 text-lg text-[#2D2D2D] font-bold">
                            History
                        </span>
                    </button>

                    {/*Settings Button*/}
                    <button
                        onClick={() => navigate('/settings')}
                        className="group flex flex-col items-center absolute top-[69%] right-[39.5%] md:top-[80%] md:right-[43%] lg:top-[84%] lg:right-[44%] z-10"
                    >
                        <div className="w-16 h-16 rounded-full border-2 border-[#5FB57C] bg-[#E8F5EC] hover:bg-[#FDFBF7] hover:border-[#4BA869] transition-all flex items-center justify-center group-hover:scale-110 transform duration-200 animate-float-delay-2">
                            <Settings className="text-[#2D2D2D]" size={28} strokeWidth={2.5} />
                        </div>
                        <span className="mt-2 text-lg text-[#2D2D2D] font-bold">
                            Settings
                        </span>
                    </button>
                </div>
            </div>

            {/* Bottom Right - QuestionsCamp Link */}
            <a
                href="https://questionscamp.com"
                target="_blank"
                rel="noopener noreferrer"
                className="absolute bottom-8 right-8 flex flex-col items-center gap-2 z-20 group"
            >
                <div className="w-16 h-16 rounded-full bg-[#5FB57C] flex items-center justify-center shadow-lg cursor-pointer group-hover:scale-110 transition-transform">
                    <HelpCircle className="text-white" size={32} />
                </div>
                <span className="text-sm text-[#2D2D2D] font-medium group-hover:text-[#5FB57C] transition-colors">QuestionsCamp</span>
            </a>
        </div>
    );
};

export default HomePage;