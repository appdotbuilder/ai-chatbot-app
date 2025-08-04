import React, { useState } from 'react';
import { router } from '@inertiajs/react';

interface ChatMessageProps {
    id: number;
    prompt: string;
    response: string;
    createdAt: string;
    sessionId: string;
}

export function ChatMessage({ id, prompt, response, createdAt, sessionId }: ChatMessageProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [editedPrompt, setEditedPrompt] = useState(prompt);
    const [isUpdating, setIsUpdating] = useState(false);

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleCancel = () => {
        setIsEditing(false);
        setEditedPrompt(prompt);
    };

    const handleUpdate = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!editedPrompt.trim() || isUpdating) return;

        setIsUpdating(true);
        
        router.patch(route('chat.update', id), {
            prompt: editedPrompt.trim(),
            session_id: sessionId,
        }, {
            preserveState: true,
            preserveScroll: true,
            onSuccess: () => {
                setIsEditing(false);
            },
            onFinish: () => {
                setIsUpdating(false);
            },
        });
    };

    return (
        <div className="mb-8 p-6 bg-white rounded-lg shadow-sm border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center dark:bg-blue-900">
                        <span className="text-blue-600 text-sm font-medium dark:text-blue-300">👤</span>
                    </div>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">You</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500 dark:text-gray-400">{createdAt}</span>
                    {!isEditing && (
                        <button
                            onClick={handleEdit}
                            className="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                            Edit
                        </button>
                    )}
                </div>
            </div>

            {isEditing ? (
                <form onSubmit={handleUpdate} className="mb-4">
                    <textarea
                        value={editedPrompt}
                        onChange={(e) => setEditedPrompt(e.target.value)}
                        className="w-full min-h-[80px] px-3 py-2 text-sm border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        disabled={isUpdating}
                        rows={3}
                    />
                    <div className="flex gap-2 mt-2">
                        <button
                            type="submit"
                            disabled={!editedPrompt.trim() || isUpdating}
                            className="px-3 py-1 bg-blue-600 text-white text-xs font-medium rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isUpdating ? 'Updating...' : 'Update'}
                        </button>
                        <button
                            type="button"
                            onClick={handleCancel}
                            className="px-3 py-1 bg-gray-300 text-gray-700 text-xs font-medium rounded hover:bg-gray-400 dark:bg-gray-600 dark:text-gray-300 dark:hover:bg-gray-500"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            ) : (
                <div className="mb-4 p-3 bg-gray-50 rounded-lg dark:bg-gray-700">
                    <p className="text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap">{prompt}</p>
                </div>
            )}

            <div className="flex items-start gap-2">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center dark:bg-green-900">
                    <span className="text-green-600 text-sm font-medium dark:text-green-300">🤖</span>
                </div>
                <div className="flex-1">
                    <div className="mb-2">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">AI Assistant</span>
                    </div>
                    <div className="p-3 bg-green-50 rounded-lg dark:bg-green-900/20">
                        <p className="text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap">{response}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}