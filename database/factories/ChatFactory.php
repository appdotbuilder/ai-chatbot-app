<?php

namespace Database\Factories;

use App\Models\Chat;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Chat>
 */
class ChatFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var class-string<\App\Models\Chat>
     */
    protected $model = Chat::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'session_id' => $this->faker->uuid(),
            'prompt' => $this->faker->sentence(random_int(10, 30)),
            'response' => $this->faker->paragraph(random_int(3, 8)),
        ];
    }

    /**
     * Create a chat for an anonymous user.
     *
     * @return \Illuminate\Database\Eloquent\Factories\Factory
     */
    public function anonymous(): Factory
    {
        return $this->state(function (array $attributes) {
            return [
                'user_id' => null,
                'session_id' => $this->faker->uuid(),
            ];
        });
    }
}