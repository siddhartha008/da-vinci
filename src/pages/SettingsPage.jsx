import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, Settings as SettingsIcon } from 'lucide-react';

const SettingsPage = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-[#FDFBF7] p-4 md:p-8">
            {/* Header */}
            <div className="max-w-4xl mx-auto mb-8">
                <button
                    onClick={() => navigate('/')}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg border-2 border-primary/20 bg-secondary hover:bg-primary/10 transition-colors group mb-6"
                >
                    <Home className="text-secondary-text group-hover:text-primary transition-colors" size={20} />
                    <span className="text-secondary-text group-hover:text-primary font-handwriting text-lg">Home</span>
                </button>

                <div className="text-center mb-8">
                    <div className="flex items-center justify-center gap-4 mb-4">
                        <SettingsIcon className="text-primary" size={48} />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-secondary-text font-handwriting mb-2">
                        Settings
                    </h1>
                    <p className="text-lg text-secondary-text/70 font-handwriting">
                        Customize your Da Vinci experience
                    </p>
                </div>
            </div>

            <div className="max-w-4xl mx-auto space-y-6">
                {/* Additional Settings  */}
                <div className="bg-secondary border-2 border-primary/20 rounded-2xl p-6 md:p-8 shadow-sm">
                    <h2 className="text-2xl font-bold text-secondary-text font-handwriting mb-4">
                        Additional Settings
                    </h2>
                    <div className="text-center py-10">
                        <p className="text-secondary-text/40 font-handwriting text-lg italic">
                            More settings coming soon...
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettingsPage;
