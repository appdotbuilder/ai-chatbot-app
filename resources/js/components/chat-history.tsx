import React from 'react';
import { ChatMessage } from './chat-message';

interface Chat {
    id: number;
    prompt: string;
    response: string;
    created_at: string;
}

interface ChatHistoryProps {
    chats: Chat[];
    sessionId: string;
}

export function ChatHistory({ chats, sessionId }: ChatHistoryProps) {
    if (chats.length === 0) {
        return (
            <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 dark:bg-gray-800">
                    <span className="text-2xl">💬</span>
                </div>
                <h3 className="text-lg font-medium text-gray-700 mb-2 dark:text-gray-300">Start a conversation</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    Ask me anything and I'll do my best to help you!
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {chats.map((chat) => (
                <ChatMessage
                    key={chat.id}
                    id={chat.id}
                    prompt={chat.prompt}
                    response={chat.response}
                    createdAt={chat.created_at}
                    sessionId={sessionId}
                />
            ))}
        </div>
    );
}