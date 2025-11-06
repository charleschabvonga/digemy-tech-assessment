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

        // Meaningful invoice titles for various business services
        $invoiceTitles = [
            'Web Development Services',
            'Monthly Consulting Fee',
            'Software License Subscription',
            'Marketing Campaign Services',
            'Graphic Design Project',
            'Cloud Hosting Services',
            'SEO Optimization Package',
            'Content Writing Services',
            'Mobile App Development',
            'Database Maintenance',
            'API Integration Services',
            'UI/UX Design Project',
            'E-commerce Platform Setup',
            'Social Media Management',
            'Email Marketing Campaign',
            'Video Production Services',
            'Photography Services',
            'Brand Identity Design',
            'Website Maintenance',
            'Training & Workshops',
            'Technical Support Services',
            'Data Migration Services',
            'Security Audit Services',
            'Performance Optimization',
            'Custom Software Development',
            'System Integration',
            'Quality Assurance Testing',
            'Project Management Services',
            'Business Analysis',
            'System Architecture Design',
        ];

        return [
            'title' => $this->faker->randomElement($invoiceTitles),
            'description' => $this->faker->optional(0.7)->paragraph(),
            'total_amount' => $this->faker->randomFloat(2, 100, 10000),
            'state' => $this->faker->randomElement($states),
        ];
    }
}
