<?php

use App\Models\Chat;
use App\Models\User;

it('displays chat interface on home page', function () {
    $response = $this->get('/');

    $response->assertStatus(200);
    $response->assertInertia(fn ($page) => 
        $page->component('welcome')
            ->has('chats')
            ->has('sessionId')
    );
});

it('allows user to send chat message', function () {
    $sessionId = uniqid();
    
    $response = $this->post('/chat', [
        'prompt' => 'Hello, AI!',
        'session_id' => $sessionId,
    ]);

    $response->assertStatus(200);
    $response->assertInertia(fn ($page) => 
        $page->component('welcome')
            ->has('chats', 1)
            ->where('chats.0.prompt', 'Hello, AI!')
            ->has('chats.0.response')
    );

    $this->assertDatabaseHas('chats', [
        'prompt' => 'Hello, AI!',
        'session_id' => $sessionId,
        'user_id' => null,
    ]);
});

it('allows authenticated user to send chat message', function () {
    $user = User::factory()->create();
    $sessionId = uniqid();
    
    $response = $this->actingAs($user)->post('/chat', [
        'prompt' => 'Hello from authenticated user!',
        'session_id' => $sessionId,
    ]);

    $response->assertStatus(200);
    
    $this->assertDatabaseHas('chats', [
        'prompt' => 'Hello from authenticated user!',
        'session_id' => $sessionId,
        'user_id' => $user->id,
    ]);
});

it('allows user to update chat message', function () {
    $chat = Chat::factory()->anonymous()->create([
        'prompt' => 'Original prompt',
        'response' => 'Original response',
        'session_id' => 'test-session',
    ]);

    $response = $this->patch("/chat/{$chat->id}", [
        'prompt' => 'Updated prompt',
        'session_id' => 'test-session',
    ]);

    $response->assertStatus(200);
    
    $chat->refresh();
    expect($chat->prompt)->toBe('Updated prompt');
    expect($chat->response)->not->toBe('Original response');
});

it('prevents user from updating others chat message', function () {
    $user1 = User::factory()->create();
    $user2 = User::factory()->create();
    
    $chat = Chat::factory()->create([
        'user_id' => $user1->id,
        'prompt' => 'User 1 prompt',
    ]);

    $response = $this->actingAs($user2)->patch("/chat/{$chat->id}", [
        'prompt' => 'Malicious update',
        'session_id' => 'test-session',
    ]);

    $response->assertStatus(403);
});

it('validates chat prompt is required', function () {
    $response = $this->post('/chat', [
        'prompt' => '',
        'session_id' => 'test-session',
    ]);

    $response->assertSessionHasErrors(['prompt']);
});

it('validates chat prompt max length', function () {
    $longPrompt = str_repeat('a', 2001);
    
    $response = $this->post('/chat', [
        'prompt' => $longPrompt,
        'session_id' => 'test-session',
    ]);

    $response->assertSessionHasErrors(['prompt']);
});

it('shows chat history for session', function () {
    $sessionId = 'test-session';
    
    Chat::factory()->anonymous()->create([
        'session_id' => $sessionId,
        'prompt' => 'First message',
    ]);
    
    Chat::factory()->anonymous()->create([
        'session_id' => $sessionId,
        'prompt' => 'Second message',
    ]);
    
    // Different session
    Chat::factory()->anonymous()->create([
        'session_id' => 'other-session',
        'prompt' => 'Other session message',
    ]);

    $response = $this->get("/?session_id={$sessionId}");

    $response->assertStatus(200);
    $response->assertInertia(fn ($page) => 
        $page->has('chats', 2)
            ->where('chats.0.prompt', 'First message')
            ->where('chats.1.prompt', 'Second message')
    );
});

it('shows authenticated user only their chats', function () {
    $user1 = User::factory()->create();
    $user2 = User::factory()->create();
    
    Chat::factory()->create([
        'user_id' => $user1->id,
        'prompt' => 'User 1 message',
    ]);
    
    Chat::factory()->create([
        'user_id' => $user2->id,
        'prompt' => 'User 2 message',
    ]);

    $response = $this->actingAs($user1)->get('/');

    $response->assertStatus(200);
    $response->assertInertia(fn ($page) => 
        $page->has('chats', 1)
            ->where('chats.0.prompt', 'User 1 message')
    );
});