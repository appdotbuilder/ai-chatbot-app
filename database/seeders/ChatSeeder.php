<?php

namespace Database\Seeders;

use App\Models\Chat;
use App\Models\User;
use Illuminate\Database\Seeder;

class ChatSeeder extends Seeder
{
    /**
     * Run the database seeder.
     */
    public function run(): void
    {
        // Create some demo chats for testing
        if (app()->environment('local')) {
            // Anonymous user chats
            Chat::create([
                'user_id' => null,
                'session_id' => 'demo-session',
                'prompt' => 'What can you help me with?',
                'response' => 'I\'m here to help with a wide variety of tasks! I can assist with answering questions, brainstorming ideas, explaining concepts, helping with writing, providing information on various topics, and engaging in meaningful conversations. What would you like to explore today?',
            ]);

            Chat::create([
                'user_id' => null,
                'session_id' => 'demo-session',
                'prompt' => 'Can you explain how machine learning works in simple terms?',
                'response' => 'Great question! Think of machine learning like teaching a computer to recognize patterns, similar to how a child learns to recognize animals. You show the computer thousands of examples (like photos of cats and dogs), and it learns to identify the key features that distinguish them. Once trained, it can look at a new photo and predict whether it\'s a cat or dog based on what it learned. The "learning" happens through algorithms that adjust and improve as they see more examples!',
            ]);

            // If there are users, create some chats for them too
            $users = User::limit(2)->get();
            foreach ($users as $user) {
                Chat::create([
                    'user_id' => $user->id,
                    'session_id' => uniqid(),
                    'prompt' => 'Hello! I\'m excited to try this chatbot.',
                    'response' => 'Hello there! Welcome to our AI chatbot! I\'m excited to chat with you too. This is a great place to ask questions, explore ideas, or just have an interesting conversation. Since you\'re logged in, all your chats will be saved to your account so you can refer back to them later. What\'s on your mind today?',
                ]);
            }
        }
    }
}