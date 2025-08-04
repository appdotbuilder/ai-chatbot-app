import React, { useState } from 'react';
import { router } from '@inertiajs/react';

interface ChatInputProps {
    sessionId: string;
    onSubmit?: () => void;
    placeholder?: string;
}

export function ChatInput({ sessionId, onSubmit, placeholder = "Ask me anything..." }: ChatInputProps) {
    const [prompt, setPrompt] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!prompt.trim() || isSubmitting) return;

        setIsSubmitting(true);
        
        router.post(route('chat.store'), {
            prompt: prompt.trim(),
            session_id: sessionId,
        }, {
            preserveState: true,
            preserveScroll: false,
            onSuccess: () => {
                setPrompt('');
                onSubmit?.();
            },
            onFinish: () => {
                setIsSubmitting(false);
            },
        });
    };

    return (
        <form onSubmit={handleSubmit} className="flex gap-3">
            <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder={placeholder}
                className="flex-1 min-h-[60px] max-h-[120px] px-4 py-3 text-sm border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:placeholder-gray-400 dark:focus:ring-blue-400"
                disabled={isSubmitting}
                rows={2}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSubmit(e);
                    }
                }}
            />
            <button
                type="submit"
                disabled={!prompt.trim() || isSubmitting}
                className="px-6 py-3 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
                {isSubmitting ? '...' : 'Send'}
            </button>
        </form>
    );
}