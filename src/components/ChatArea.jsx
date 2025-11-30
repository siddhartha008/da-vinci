import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight } from 'lucide-react';

const ChatArea = ({ resetTrigger }) => {
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState("");
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Initialize welcome message on mount
    useEffect(() => {
        // Initialize Welcome Message
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

    // Reset chat when resetTrigger changes (New Project clicked)
    useEffect(() => {
        if (resetTrigger > 0) {
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
            setInputValue("");
        }
    }, [resetTrigger]);

    const handleSendMessage = () => {
        if (!inputValue.trim()) return;

        const newUserMessage = {
            id: Date.now(),
            sender: 'user',
            text: inputValue,
            type: 'text'
        };

        // Remove welcome message and buttons, then add user message
        setMessages(prev => {
            // Filter out the initial welcome messages (id 1 and 2)
            const filteredMessages = prev.filter(msg => msg.id !== 1 && msg.id !== 2);
            return [...filteredMessages, newUserMessage];
        });
        setInputValue("");

        // Simulate Bot Response (Placeholder for now, or simple echo/acknowledgement)
        // For this specific task, we only defined responses for the buttons, but let's add a generic one for text input
        // to keep the flow alive if they type manually.
        setTimeout(() => {
            const botReply = {
                id: Date.now() + 1,
                sender: 'bot',
                text: "Interesting. Tell me more about why this matters to you.",
                type: 'text'
            };
            setMessages(prev => [...prev, botReply]);
        }, 1000);
    };

    const handleOptionClick = (option) => {
        // Add user selection as a message
        const userMsg = {
            id: Date.now(),
            sender: 'user',
            text: option.label,
            type: 'text'
        };
        setMessages(prev => [...prev, userMsg]);

        // Bot Logic based on selection
        setTimeout(() => {
            let botText = "";
            if (option.value === 'topic_no_question') {
                botText = "That is a start. Tell me the topic (e.g., 'Video Games' or 'Pollution'), and I will help you find the mystery inside it.";
            } else if (option.value === 'struggling_idea') {
                botText = "Conflict is the spark of invention. Tell me two different ideas you are debating, and I will show you how they might connect.";
            } else if (option.value === 'help_choose') {
                botText = "Let us observe the world. Look around you. What is one thing that is broken, annoying, or unfair? Type it here.";
            }

            const botReply = {
                id: Date.now() + 1,
                sender: 'bot',
                text: botText,
                type: 'text'
            };
            setMessages(prev => [...prev, botReply]);
        }, 800);
    };

    return (
        <div className="flex-1 p-4 md:p-8 relative flex flex-col md:flex-row gap-4 md:gap-8 h-screen overflow-hidden bg-white">
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
                                    </div>
                                )}
                                {msg.type === 'buttons' && (
                                    <div className="flex flex-wrap gap-2 mt-2 w-full">
                                        {msg.options.map((opt, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => handleOptionClick(opt)}
                                                className="flex-1 min-w-[200px] text-center px-4 py-3 text-base md:text-lg text-secondary-text border-2 border-primary rounded-full hover:bg-primary hover:text-white transition-all font-handwriting bg-secondary shadow-md hover:shadow-lg"
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
                            className="w-full h-full bg-secondary resize-none outline-none text-base md:text-lg text-secondary-text placeholder-secondary-text/40 font-handwriting p-2 md:p-3 rounded-lg border-2 border-primary focus:border-primary/80 transition-colors"
                            placeholder="Type your rough draft here..."
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSendMessage();
                                }
                            }}
                        ></textarea>

                        <div className="absolute bottom-4 right-4">
                            <button
                                onClick={handleSendMessage}
                                className="p-2 rounded-full bg-primary hover:bg-primary/80 transition-colors shadow-md"
                            >
                                <ArrowRight className="text-white" size={24} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Column: Da Vinci & Feedback (Sidebar) */}
            <div className="hidden md:flex w-full md:w-96 flex-col gap-6 h-full">
                <div className="text-right shrink-0">
                    <span className="text-2xl text-secondary-text font-handwriting block">upload essay</span>
                    <span className="text-xl text-secondary-text/60 font-handwriting block">welcome prompts</span>
                </div>

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
                        Summary will appear here...
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChatArea;

