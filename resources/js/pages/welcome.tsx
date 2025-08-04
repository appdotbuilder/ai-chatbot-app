import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { ChatInput } from '@/components/chat-input';
import { ChatHistory } from '@/components/chat-history';
import { useEffect, useRef } from 'react';

interface Chat {
    id: number;
    prompt: string;
    response: string;
    created_at: string;
}

interface Props extends SharedData {
    chats?: Chat[];
    sessionId?: string;
    [key: string]: unknown;
}

export default function Welcome() {
    const { auth, chats = [], sessionId = '' } = usePage<Props>().props;
    const chatEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [chats]);

    return (
        <>
            <Head title="AI Chatbot">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
            </Head>
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
                {/* Header */}
                <header className="bg-white shadow-sm border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between h-16">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                                    <span className="text-white text-xl">🤖</span>
                                </div>
                                <div>
                                    <h1 className="text-xl font-bold text-gray-900 dark:text-white">AI Chatbot</h1>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Your intelligent conversation partner</p>
                                </div>
                            </div>
                            <nav className="flex items-center gap-4">
                                {auth.user ? (
                                    <Link
                                        href={route('dashboard')}
                                        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                                    >
                                        Dashboard
                                    </Link>
                                ) : (
                                    <div className="flex items-center gap-2">
                                        <Link
                                            href={route('login')}
                                            className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                                        >
                                            Log in
                                        </Link>
                                        <Link
                                            href={route('register')}
                                            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                                        >
                                            Register
                                        </Link>
                                    </div>
                                )}
                            </nav>
                        </div>
                    </div>
                </header>

                {/* Welcome Section (only show if no chats) */}
                {chats.length === 0 && (
                    <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 py-16">
                        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-8">
                                <span className="text-white text-4xl">🤖</span>
                            </div>
                            <h1 className="text-4xl font-bold text-gray-900 mb-4 dark:text-white">
                                Welcome to AI Chatbot! 🚀
                            </h1>
                            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto dark:text-gray-300">
                                Your intelligent conversation partner that can help answer questions, brainstorm ideas, and engage in meaningful dialogue.
                            </p>
                            
                            <div className="grid md:grid-cols-3 gap-6 mb-12 max-w-3xl mx-auto">
                                <div className="bg-white p-6 rounded-xl shadow-sm dark:bg-gray-800">
                                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4 dark:bg-blue-900">
                                        <span className="text-2xl">💬</span>
                                    </div>
                                    <h3 className="font-semibold text-gray-900 mb-2 dark:text-white">Natural Conversations</h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        Chat naturally with our AI assistant about any topic
                                    </p>
                                </div>
                                
                                <div className="bg-white p-6 rounded-xl shadow-sm dark:bg-gray-800">
                                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4 dark:bg-green-900">
                                        <span className="text-2xl">✏️</span>
                                    </div>
                                    <h3 className="font-semibold text-gray-900 mb-2 dark:text-white">Edit & Refine</h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        Edit your prompts to get better responses
                                    </p>
                                </div>
                                
                                <div className="bg-white p-6 rounded-xl shadow-sm dark:bg-gray-800">
                                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4 dark:bg-purple-900">
                                        <span className="text-2xl">📚</span>
                                    </div>
                                    <h3 className="font-semibold text-gray-900 mb-2 dark:text-white">Chat History</h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        Your conversations are saved for easy reference
                                    </p>
                                </div>
                            </div>

                            <div className="text-center">
                                <p className="text-lg text-gray-700 mb-4 dark:text-gray-300">
                                    Ready to start chatting? Type your message below! 👇
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Main Chat Interface */}
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
                        {/* Chat Messages */}
                        <div className="p-6 max-h-[600px] overflow-y-auto">
                            <ChatHistory chats={chats} sessionId={sessionId} />
                            <div ref={chatEndRef} />
                        </div>

                        {/* Chat Input */}
                        <div className="border-t border-gray-200 p-6 dark:border-gray-700">
                            <ChatInput 
                                sessionId={sessionId} 
                                onSubmit={scrollToBottom}
                                placeholder={chats.length === 0 ? "Hi! Ask me anything to get started..." : "Ask me anything..."}
                            />
                            <p className="text-xs text-gray-500 mt-2 dark:text-gray-400">
                                💡 Tip: Press Enter to send, Shift+Enter for new line. You can edit previous messages anytime!
                            </p>
                        </div>
                    </div>

                    {/* Features Info */}
                    {chats.length > 0 && (
                        <div className="mt-8 text-center">
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                🔒 Your chats are {auth.user ? 'saved to your account' : 'stored in this session'} • 
                                ✏️ Click "Edit" on any message to refine your prompts
                            </p>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <footer className="border-t border-gray-200 bg-white py-8 mt-16 dark:bg-gray-800 dark:border-gray-700">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Built with ❤️ by{" "}
                            <a 
                                href="https://app.build" 
                                target="_blank" 
                                className="font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                            >
                                app.build
                            </a>
                        </p>
                    </div>
                </footer>
            </div>
        </>
    );
}