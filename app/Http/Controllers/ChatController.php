<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreChatRequest;
use App\Http\Requests\UpdateChatRequest;
use App\Models\Chat;
use App\Services\AIResponseService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ChatController extends Controller
{
    /**
     * Create a new controller instance.
     */
    public function __construct(
        private AIResponseService $aiResponseService
    ) {}

    /**
     * Display the main chat interface.
     */
    public function index(Request $request)
    {
        $sessionId = $request->get('session_id', uniqid());
        $userId = auth()->id();
        
        // Get chat history for the current session/user
        $chats = Chat::query()
            ->when($userId, function ($query) use ($userId) {
                return $query->where('user_id', $userId);
            }, function ($query) use ($sessionId) {
                return $query->where('session_id', $sessionId);
            })
            ->orderBy('created_at', 'asc')
            ->get()
            ->map(function ($chat) {
                return [
                    'id' => $chat->id,
                    'prompt' => $chat->prompt,
                    'response' => $chat->response,
                    'created_at' => $chat->created_at->format('M j, Y g:i A'),
                ];
            });

        return Inertia::render('welcome', [
            'chats' => $chats,
            'sessionId' => $sessionId,
        ]);
    }

    /**
     * Store a new chat message.
     */
    public function store(StoreChatRequest $request)
    {
        $data = $request->validated();
        
        // Generate AI response using the service
        $aiResponse = $this->aiResponseService->generateResponse($data['prompt']);
        
        $chat = Chat::create([
            'user_id' => auth()->id(),
            'session_id' => $data['session_id'],
            'prompt' => $data['prompt'],
            'response' => $aiResponse,
        ]);

        $sessionId = $data['session_id'];
        $userId = auth()->id();
        
        // Get updated chat history
        $chats = Chat::query()
            ->when($userId, function ($query) use ($userId) {
                return $query->where('user_id', $userId);
            }, function ($query) use ($sessionId) {
                return $query->where('session_id', $sessionId);
            })
            ->orderBy('created_at', 'asc')
            ->get()
            ->map(function ($chat) {
                return [
                    'id' => $chat->id,
                    'prompt' => $chat->prompt,
                    'response' => $chat->response,
                    'created_at' => $chat->created_at->format('M j, Y g:i A'),
                ];
            });

        return Inertia::render('welcome', [
            'chats' => $chats,
            'sessionId' => $sessionId,
        ]);
    }

    /**
     * Update an existing chat prompt.
     */
    public function update(UpdateChatRequest $request, Chat $chat)
    {
        $data = $request->validated();
        
        // Check authorization
        $userId = auth()->id();
        $sessionId = $request->get('session_id');
        
        if ($userId && $chat->user_id !== $userId) {
            abort(403, 'Unauthorized');
        }
        
        if (!$userId && $chat->session_id !== $sessionId) {
            abort(403, 'Unauthorized');
        }
        
        // Generate new AI response for the updated prompt
        $aiResponse = $this->aiResponseService->generateResponse($data['prompt']);
        
        $chat->update([
            'prompt' => $data['prompt'],
            'response' => $aiResponse,
        ]);

        // Get updated chat history
        $chats = Chat::query()
            ->when($userId, function ($query) use ($userId) {
                return $query->where('user_id', $userId);
            }, function ($query) use ($sessionId) {
                return $query->where('session_id', $sessionId);
            })
            ->orderBy('created_at', 'asc')
            ->get()
            ->map(function ($chat) {
                return [
                    'id' => $chat->id,
                    'prompt' => $chat->prompt,
                    'response' => $chat->response,
                    'created_at' => $chat->created_at->format('M j, Y g:i A'),
                ];
            });

        return Inertia::render('welcome', [
            'chats' => $chats,
            'sessionId' => $sessionId ?? uniqid(),
        ]);
    }
}