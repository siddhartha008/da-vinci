import React, { useState } from 'react';
import { User, HelpCircle, Plus, MessageSquare, Trash2, X } from 'lucide-react';

const Sidebar = ({ onNewProject }) => {
    const [history, setHistory] = useState([
        { id: 1, title: "The Flying Machine", date: "Today" },
        { id: 2, title: "City of Tomorrow", date: "Yesterday" },
        { id: 3, title: "Ocean Cleanup", date: "Last Week" },
        { id: 4, title: "Mars Colony", date: "Last Week" }
    ]);

    const [deleteModal, setDeleteModal] = useState({ show: false, id: null, title: '' });

    const handleDeleteClick = (id, title) => {
        setDeleteModal({ show: true, id, title });
    };

    const confirmDelete = () => {
        setHistory(history.filter(item => item.id !== deleteModal.id));
        setDeleteModal({ show: false, id: null, title: '' });
    };

    const cancelDelete = () => {
        setDeleteModal({ show: false, id: null, title: '' });
    };

    return (
        <>
            <div className="hidden md:flex w-64 h-full border-r-2 border-primary/20 p-6 flex-col relative bg-secondary">
                {/* Profile Section */}
                <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 rounded-full border-2 border-primary flex items-center justify-center bg-white">
                        <User className="text-secondary-text" size={24} />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-secondary-text font-bold font-handwriting text-lg">Young Inventor</span>
                        <span className="text-xs text-secondary-text/70 font-handwriting">Team Alpha</span>
                    </div>
                </div>

                {/* New Chat Button */}
                <button
                    onClick={onNewProject}
                    className="flex items-center gap-2 w-full p-3 rounded-xl border-2 border-primary/20 hover:bg-primary/10 transition-colors mb-8 group"
                >
                    <Plus className="text-secondary-text group-hover:scale-110 transition-transform" size={20} />
                    <span className="text-secondary-text font-handwriting text-lg">New Project</span>
                </button>

                {/* History List */}
                <div className="flex-1 overflow-y-auto">
                    <h3 className="text-secondary-text/40 font-handwriting text-sm mb-4 uppercase tracking-wider">Past Inventions</h3>
                    <div className="flex flex-col gap-2">
                        {history.map((item) => (
                            <div key={item.id} className="relative group/item">
                                <button className="text-left p-3 rounded-lg hover:bg-primary/5 transition-colors w-full">
                                    <div className="flex items-center gap-3">
                                        <MessageSquare size={16} className="text-secondary-text group-hover/item:text-primary transition-colors" />
                                        <div className="flex flex-col flex-1">
                                            <span className="text-secondary-text font-handwriting text-lg leading-none group-hover/item:text-primary">{item.title}</span>
                                            <span className="text-secondary-text font-handwriting mt-1 text-xs">{item.date}</span>
                                        </div>
                                    </div>
                                </button>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleDeleteClick(item.id, item.title);
                                    }}
                                    className="absolute top-2 right-2 p-1.5 rounded-md bg-secondary hover:bg-red-100 opacity-0 group-hover/item:opacity-100 transition-opacity"
                                    title="Delete conversation"
                                >
                                    <Trash2 size={14} className="text-red-500" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Help Icon */}
                <div className="pt-4 border-t-2 border-primary/10 mt-4">
                    <button className="flex items-center gap-3 text-secondary-text/60 hover:text-primary transition-colors">
                        <HelpCircle size={20} />
                        <span className="font-handwriting text-lg">Help & Guide</span>
                    </button>
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            {deleteModal.show && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                        onClick={cancelDelete}
                    ></div>

                    {/* Modal */}
                    <div className="relative bg-secondary border-2 border-primary rounded-2xl shadow-2xl max-w-md w-full p-6 animate-in fade-in zoom-in duration-200">
                        {/* Close button */}
                        <button
                            onClick={cancelDelete}
                            className="absolute top-4 right-4 p-1 hover:bg-primary/10 rounded-full transition-colors"
                        >
                            <X size={20} className="text-secondary-text" />
                        </button>

                        {/* Icon */}
                        <div className="flex justify-center mb-4">
                            <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
                                <Trash2 size={32} className="text-red-500" />
                            </div>
                        </div>

                        {/* Content */}
                        <h2 className="text-2xl font-bold text-secondary-text font-handwriting text-center mb-2">
                            Delete Conversation?
                        </h2>
                        <p className="text-secondary-text/70 font-handwriting text-center mb-6">
                            Are you sure you want to delete <span className="font-bold text-secondary-text">"{deleteModal.title}"</span>? This action cannot be undone.
                        </p>

                        {/* Buttons */}
                        <div className="flex gap-3">
                            <button
                                onClick={cancelDelete}
                                className="flex-1 px-4 py-3 rounded-xl border-2 border-primary bg-secondary text-secondary-text font-handwriting text-lg hover:bg-primary/10 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmDelete}
                                className="flex-1 px-4 py-3 rounded-xl bg-red-500 text-white font-handwriting text-lg hover:bg-red-600 transition-colors shadow-md"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Sidebar;
