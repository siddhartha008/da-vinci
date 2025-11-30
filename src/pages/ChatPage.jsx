import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Home, AlertCircle } from 'lucide-react';
import { sendChatMessageStreaming, generateChatSummary } from '../services/gemini';
import { hasApiKey } from '../utils/localStorage';

const ChatPage = () => {
    const navigate = useNavigate();
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [summary, setSummary] = useState("");
    const [isSummaryLoading, setIsSummaryLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Initialize welcome message on mount
    useEffect(() => {
        const initialMessages = [
            {
                id: 1,
                sender: 'bot',
                text: "Greetings, inventors. I am Da Vinci. My purpose is to sharpen your curiosity so you can build something great.\n\nDo not worry about being perfect yet. Type the rough draft of the question your team is thinking about.",
                type: 'text'
            },
            {
                id: 2,
                sender: 'bot',
                type: 'buttons',
                options: [
                    { label: "We have a topic, but no question.", value: "topic_no_question" },
                    { label: "We are struggling to agree on an idea.", value: "struggling_idea" },
                    { label: "Da Vinci, help us choose a question.", value: "help_choose" }
                ]
            }
        ];
        setMessages(initialMessages);
    }, []);

    // Check if API key is configured
    const apiKeyConfigured = hasApiKey();

    const updateSummary = async (currentMessages) => {
        // Only generate summary if we have some context (e.g., at least 3 messages)
        if (currentMessages.length < 3) return;

        setIsSummaryLoading(true);
        try {
            const history = currentMessages
                .filter(msg => msg.type === 'text' && msg.id !== 1 && msg.id !== 2)
                .map(msg => ({
                    role: msg.sender === 'user' ? 'user' : 'model',
                    parts: [{ text: msg.text }]
                }));

            const newSummary = await generateChatSummary(history);
            if (newSummary) {
                setSummary(newSummary);
            }
        } catch (err) {
            console.error('Failed to update summary:', err);
        } finally {
            setIsSummaryLoading(false);
        }
    };

    const handleSendMessage = async () => {
        if (!inputValue.trim()) return;

        // Check for API key
        if (!apiKeyConfigured) {
            setError('Please configure your Google Gemini API key in Settings first.');
            return;
        }

        const newUserMessage = {
            id: Date.now(),
            sender: 'user',
            text: inputValue,
            type: 'text'
        };

        // Remove welcome message and buttons, then add user message
        setMessages(prev => {
            const filteredMessages = prev.filter(msg => msg.id !== 1 && msg.id !== 2);
            return [...filteredMessages, newUserMessage];
        });
        setInputValue("");
        setIsLoading(true);
        setError(null);

        // Create placeholder for bot response
        const botMessageId = Date.now() + 1;
        const botMessage = {
            id: botMessageId,
            sender: 'bot',
            text: '',
            type: 'text'
        };
        setMessages(prev => [...prev, botMessage]);

        try {
            // Prepare conversation history for Gemini
            const conversationHistory = messages
                .filter(msg => msg.type === 'text' && msg.id !== 1 && msg.id !== botMessageId)
                .map(msg => ({
                    role: msg.sender === 'user' ? 'user' : 'model',
                    parts: [{ text: msg.text }]
                }));

            // Send to Gemini with streaming
            await sendChatMessageStreaming(
                conversationHistory,
                inputValue,
                (chunk, fullContent) => {
                    // Update the bot message with streaming content
                    setMessages(prev => {
                        const updated = prev.map(msg =>
                            msg.id === botMessageId
                                ? { ...msg, text: fullContent }
                                : msg
                        );
                        return updated;
                    });
                }
            );

            // Trigger summary update after message is complete
            // We need the latest messages state, so we reconstruct it here or pass it
            const updatedMessages = [...messages, newUserMessage, { ...botMessage, text: "..." }]; // Approximation for trigger
            updateSummary(updatedMessages);

        } catch (err) {
            console.error('Error sending message:', err);
            setError(err.message || 'Failed to get response. Please check your API key and try again.');

            // Remove the placeholder bot message on error
            setMessages(prev => prev.filter(msg => msg.id !== botMessageId));
        } finally {
            setIsLoading(false);
        }
    };

    const handleOptionClick = async (option) => {
        if (!apiKeyConfigured) {
            setError('Please configure your Google Gemini API key in Settings first.');
            return;
        }

        // Add user selection as a message
        const userMsg = {
            id: Date.now(),
            sender: 'user',
            text: option.label,
            type: 'text'
        };
        setMessages(prev => [...prev, userMsg]);
        setIsLoading(true);
        setError(null);

        // Create placeholder for bot response
        const botMessageId = Date.now() + 1;
        const botMessage = {
            id: botMessageId,
            sender: 'bot',
            text: '',
            type: 'text'
        };
        setMessages(prev => [...prev, botMessage]);

        try {
            // Send to Gemini with streaming
            await sendChatMessageStreaming(
                [], // Empty history for first message
                option.label,
                (chunk, fullContent) => {
                    setMessages(prev => prev.map(msg =>
                        msg.id === botMessageId
                            ? { ...msg, text: fullContent }
                            : msg
                    ));
                }
            );

            // Trigger summary update
            const updatedMessages = [...messages, userMsg, { ...botMessage, text: "..." }];
            updateSummary(updatedMessages);
        } catch (err) {
            console.error('Error sending message:', err);
            setError(err.message || 'Failed to get response. Please check your API key and try again.');
            setMessages(prev => prev.filter(msg => msg.id !== botMessageId));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#FDFBF7] p-4 md:p-8">
            {/* Home Button */}
            <div className="max-w-7xl mx-auto mb-4">
                <button
                    onClick={() => navigate('/')}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg border-2 border-primary/20 bg-secondary hover:bg-primary/10 transition-colors group"
                >
                    <Home className="text-secondary-text group-hover:text-primary transition-colors" size={20} />
                    <span className="text-secondary-text group-hover:text-primary font-handwriting text-lg">Home</span>
                </button>
            </div>

            {/* Error Banner */}
            {error && (
                <div className="max-w-7xl mx-auto mb-4">
                    <div className="bg-red-50 border-2 border-red-300 rounded-lg p-4 flex items-start gap-3">
                        <AlertCircle className="text-red-600 flex-shrink-0" size={24} />
                        <div className="flex-1">
                            <p className="text-red-800 font-handwriting">{error}</p>
                            {!apiKeyConfigured && (
                                <button
                                    onClick={() => navigate('/settings')}
                                    className="mt-2 text-sm px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-handwriting"
                                >
                                    Go to Settings
                                </button>
                            )}
                        </div>
                        <button
                            onClick={() => setError(null)}
                            className="text-red-600 hover:text-red-800"
                        >
                            ✕
                        </button>
                    </div>
                </div>
            )}

            {/* Main Content */}
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-4 md:gap-8 h-[calc(100vh-120px)]">
                {/* Main Chat Area (Left) */}
                <div className="flex-1 flex flex-col gap-2 md:gap-4 h-full">
                    <h2 className="text-xl md:text-2xl font-bold text-secondary-text font-handwriting">creative critical questions</h2>

                    <div className="flex-1 border-2 border-primary rounded-2xl md:rounded-3xl p-3 md:p-6 relative bg-secondary/30 shadow-sm flex flex-col overflow-hidden">
                        {/* Messages List */}
                        <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar mb-4">
                            {messages.map((msg) => (
                                <div key={msg.id} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                                    {msg.type === 'text' && (
                                        <div className={`max-w-[90%] p-3 md:p-4 rounded-2xl text-base md:text-lg font-handwriting whitespace-pre-wrap shadow-sm ${msg.sender === 'user'
                                            ? 'bg-primary/15 text-secondary-text rounded-tr-none border-2 border-primary/30'
                                            : 'bg-secondary border-2 border-primary text-secondary-text rounded-tl-none'
                                            }`}>
                                            {msg.text}
                                            {msg.sender === 'bot' && msg.text === '' && isLoading && (
                                                <span className="inline-block animate-pulse">●</span>
                                            )}
                                        </div>
                                    )}
                                    {msg.type === 'buttons' && (
                                        <div className="flex flex-wrap gap-2 mt-2 w-full">
                                            {msg.options.map((opt, idx) => (
                                                <button
                                                    key={idx}
                                                    onClick={() => handleOptionClick(opt)}
                                                    disabled={isLoading}
                                                    className="flex-1 min-w-[200px] text-center px-4 py-3 text-base md:text-lg text-secondary-text border-2 border-primary rounded-full hover:bg-primary hover:text-white transition-all font-handwriting bg-secondary shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    {opt.label}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <div className="h-32 relative border-t-2 border-primary/20 pt-4">
                            <textarea
                                className="w-full h-full bg-secondary resize-none outline-none text-base md:text-lg text-secondary-text placeholder-secondary-text/40 font-handwriting p-2 md:p-3 rounded-lg border-2 border-primary focus:border-primary/80 transition-colors disabled:opacity-50"
                                placeholder="Type your rough draft here..."
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        handleSendMessage();
                                    }
                                }}
                                disabled={isLoading}
                            ></textarea>

                            <div className="absolute bottom-4 right-4">
                                <button
                                    onClick={handleSendMessage}
                                    disabled={isLoading || !inputValue.trim()}
                                    className="p-2 rounded-full bg-primary hover:bg-primary/80 transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <ArrowRight className="text-white" size={24} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Da Vinci & Feedback */}
                <div className="hidden md:flex w-full md:w-96 flex-col gap-6 h-full">


                    {/* Da Vinci Character */}
                    <div className="h-40 flex justify-center items-center relative shrink-0">
                        <div className="relative">
                            <div className="w-24 h-28 border-2 border-primary rounded-2xl bg-white flex items-center justify-center relative overflow-visible">
                                {/* Eyes */}
                                <div className="absolute top-6 flex gap-4 w-full justify-center">
                                    <div className="w-3 h-3 bg-black rounded-full"></div>
                                    <div className="w-3 h-3 bg-black rounded-full"></div>
                                </div>
                                {/* Body/Shape */}
                                <span className="mt-8 text-secondary-text font-bold">Da Vinci</span>
                            </div>
                            {/* Arms/Legs (Sketchy) */}
                            <svg className="absolute top-0 left-0 w-full h-full overflow-visible pointer-events-none">
                                <path d="M 0 40 Q -20 20, -30 40" stroke="black" strokeWidth="2" fill="none" />
                                <path d="M 96 40 Q 116 20, 126 40" stroke="black" strokeWidth="2" fill="none" />
                            </svg>
                        </div>
                    </div>

                    {/* Feedback Placeholder */}
                    <div className="flex-1 border-2 border-primary rounded-3xl p-4 bg-secondary/30 relative flex flex-col">
                        <h3 className="text-secondary-text font-handwriting text-xl mb-4 text-right shrink-0">summary and feedback</h3>

                        <div className="flex-1 flex items-center justify-center text-secondary-text/30 font-handwriting text-lg italic">
                            {isSummaryLoading ? (
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                                </div>
                            ) : summary ? (
                                <p className="text-secondary-text text-base leading-relaxed">{summary}</p>
                            ) : (
                                'Summary will appear here...'
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChatPage;
