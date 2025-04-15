import React, { useEffect, useRef } from 'react';

type IMessage = { index: number, sender: 'user' | 'agent', message: string }

// SVG Animation for the "Type a question" prompt
const TypePromptAnimation = () => (
    <div className="flex flex-col items-center justify-center">
        <svg 
            width="120" 
            height="80" 
            viewBox="0 0 120 80" 
            xmlns="http://www.w3.org/2000/svg"
            className="mb-2"
        >
            <g className="typing-animation">
                {/* Chat bubble */}
                <rect x="10" y="10" width="100" height="60" rx="10" fill="none" stroke="#2563EB" strokeWidth="2"/>
                
                {/* Typing dots */}
                <circle className="typing-dot" cx="40" cy="40" r="4" fill="#2563EB">
                    <animate 
                        attributeName="opacity"
                        values="0.2;1;0.2"
                        dur="1.4s"
                        repeatCount="indefinite"
                        begin="0s"
                    />
                </circle>
                <circle className="typing-dot" cx="60" cy="40" r="4" fill="#2563EB">
                    <animate 
                        attributeName="opacity"
                        values="0.2;1;0.2"
                        dur="1.4s"
                        repeatCount="indefinite"
                        begin="0.2s"
                    />
                </circle>
                <circle className="typing-dot" cx="80" cy="40" r="4" fill="#2563EB">
                    <animate 
                        attributeName="opacity"
                        values="0.2;1;0.2"
                        dur="1.4s"
                        repeatCount="indefinite"
                        begin="0.4s"
                    />
                </circle>
            </g>
        </svg>
        <p className="text-blue-800 font-medium">Type a question to begin your conversation</p>
    </div>
);

const Messages = ({
    messages,
    ollamaError,
    loading,
} : {
    messages: Array<IMessage>,
    ollamaError: boolean,
    loading: boolean,
}) => {
    const messageEndRef = useRef<HTMLDivElement>(null);
    
    // Auto-scroll to bottom whenever messages change or loading state changes
    useEffect(() => {
        messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, loading]);
    
    return (
        <div className="flex-1 flex flex-col overflow-hidden">
            { messages.length === 0 &&
                <div className='system-messages text-center mt-10'>
                    { ollamaError && 
                        <p className='text-grey-400'>Ollama is not installed or not running</p>
                    }
                    { loading && 
                        <div className="flex flex-col items-center">
                            <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full border-blue-800 border-t-transparent mb-2" role="status">
                                <span className="sr-only">Loading...</span>
                            </div>
                            <p className="text-blue-800">Fetching response...</p>
                        </div>
                    }
                    { !loading && !ollamaError &&
                        <TypePromptAnimation />
                    }
                </div>
            }
            { messages.length > 0 &&
                <div className="message-list text-blue-800 flex-1 overflow-y-auto px-4 py-4 space-y-4">
                {
                    messages.map((message) => (
                        <div className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`} key={message?.index}>
                            <div className={`max-w-[75%] p-3 rounded-lg ${
                                message.sender === 'user' 
                                    ? 'bg-blue-100 text-blue-900' 
                                    : 'bg-gray-100 text-gray-800'
                            }`}>
                                {message.message}
                            </div>
                        </div>
                    ))
                }
                {/* This invisible div helps us scroll to the bottom */}
                <div ref={messageEndRef} />
                </div>
            }
        </div>
    );
}

export default Messages;
