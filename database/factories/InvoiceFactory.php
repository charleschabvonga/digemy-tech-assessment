<?php

namespace Database\Factories;

use App\Models\Invoice;
use App\States\Invoice\AwaitingPayment;
use App\States\Invoice\Created;
use App\States\Invoice\FullyPaid;
use App\States\Invoice\PartiallyPaid;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Invoice>
 */
class InvoiceFactory extends Factory
{
    protected $model = Invoice::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $states = [
            Created::class,
            AwaitingPayment::class,
            PartiallyPaid::class,
            FullyPaid::class,
        ];

        return [
            'title' => $this->faker->sentence(3),
            'description' => $this->faker->optional(0.7)->paragraph(),
            'total_amount' => $this->faker->randomFloat(2, 100, 10000),
            'state' => $this->faker->randomElement($states),
        ];
    }
}
