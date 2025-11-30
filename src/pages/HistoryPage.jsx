import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, MessageSquare, Trash2, X, Plus } from 'lucide-react';

const HistoryPage = ({ history, setHistory }) => {
    const navigate = useNavigate();
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

    const handleHistoryClick = (id) => {
        navigate('/chat');
    };

    const handleNewProject = () => {
        navigate('/chat');
    };

    return (
        <>
            <div className="min-h-screen bg-[#FDFBF7] p-4 md:p-8">

                <div className="max-w-4xl mx-auto mb-8">
                    <button
                        onClick={() => navigate('/')}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg border-2 border-primary/20 bg-secondary hover:bg-primary/10 transition-colors group mb-6"
                    >
                        <Home className="text-secondary-text group-hover:text-primary transition-colors" size={20} />
                        <span className="text-secondary-text group-hover:text-primary font-handwriting text-lg">Home</span>
                    </button>

                    <div className="text-center mb-8">
                        <h1 className="text-4xl md:text-5xl font-bold text-secondary-text font-handwriting mb-2">
                            Past Inventions
                        </h1>
                        <p className="text-lg text-secondary-text/70 font-handwriting">
                            Your journey of curiosity and creation
                        </p>
                    </div>


                    <button
                        onClick={handleNewProject}
                        className="flex items-center justify-center gap-3 w-full p-4 rounded-xl border-2 border-primary hover:bg-primary hover:text-white transition-all mb-8 group bg-secondary shadow-md"
                    >
                        <Plus className="text-secondary-text group-hover:text-white group-hover:scale-110 transition-all" size={24} />
                        <span className="text-secondary-text group-hover:text-white font-handwriting text-xl font-bold">Start New Project</span>
                    </button>
                </div>


                <div className="max-w-4xl mx-auto">
                    {history.length === 0 ? (
                        <div className="text-center py-20 text-secondary-text/40 font-handwriting text-xl italic">
                            No projects yet. Start your first invention!
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {history.map((item) => (
                                <div key={item.id} className="relative group/item">
                                    <button
                                        onClick={() => handleHistoryClick(item.id)}
                                        className="text-left p-6 rounded-2xl hover:bg-primary/10 transition-all w-full border-2 border-primary/20 hover:border-primary bg-secondary/50 hover:shadow-lg"
                                    >
                                        <div className="flex items-start gap-4">
                                            <div className="w-12 h-12 rounded-full border-2 border-primary bg-white flex items-center justify-center flex-shrink-0">
                                                <MessageSquare size={24} className="text-secondary-text group-hover/item:text-primary transition-colors" />
                                            </div>
                                            <div className="flex flex-col flex-1">
                                                <span className="text-secondary-text font-handwriting text-2xl leading-tight group-hover/item:text-primary font-bold mb-2">
                                                    {item.title}
                                                </span>
                                                <span className="text-secondary-text/60 font-handwriting text-sm">
                                                    {item.date}
                                                </span>
                                            </div>
                                        </div>
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDeleteClick(item.id, item.title);
                                        }}
                                        className="absolute top-4 right-4 p-2 rounded-md bg-secondary hover:bg-red-100 opacity-0 group-hover/item:opacity-100 transition-opacity"
                                        title="Delete conversation"
                                    >
                                        <Trash2 size={16} className="text-red-500" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>


            {deleteModal.show && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                        onClick={cancelDelete}
                    ></div>

                    <div className="relative bg-secondary border-2 border-primary rounded-2xl shadow-2xl max-w-md w-full p-6 animate-in fade-in zoom-in duration-200">
                        <button
                            onClick={cancelDelete}
                            className="absolute top-4 right-4 p-1 hover:bg-primary/10 rounded-full transition-colors"
                        >
                            <X size={20} className="text-secondary-text" />
                        </button>

                        <div className="flex justify-center mb-4">
                            <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
                                <Trash2 size={32} className="text-red-500" />
                            </div>
                        </div>

                        <h2 className="text-2xl font-bold text-secondary-text font-handwriting text-center mb-2">
                            Delete Conversation?
                        </h2>
                        <p className="text-secondary-text/70 font-handwriting text-center mb-6">
                            Are you sure you want to delete <span className="font-bold text-secondary-text">"{deleteModal.title}"</span>? This action cannot be undone.
                        </p>

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

export default HistoryPage;
