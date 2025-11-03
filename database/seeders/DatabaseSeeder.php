<?php

namespace Database\Seeders;

use App\Models\Invoice;
use App\Models\Payment;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        // Create test user
        User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => Hash::make('password'),
        ]);

        // Create additional random users (all with password "password")
        User::factory()->count(5)->create([
            'password' => Hash::make('password'),
        ]);

        // Create 50 invoices
        $invoices = Invoice::factory()->count(50)->create();

        // Create random payments for each invoice
        foreach ($invoices as $invoice) {
            // Random number of payments (0 to 5 payments per invoice)
            $numPayments = rand(0, 5);
            
            if ($numPayments > 0) {
                $totalAmount = (float) $invoice->total_amount;
                $remainingAmount = $totalAmount;
                
                // Decide randomly if payments should fully pay the invoice (70% chance)
                $shouldFullyPay = rand(1, 100) <= 70;
                
                // Create payments
                for ($i = 0; $i < $numPayments; $i++) {
                    $isLastPayment = ($i === $numPayments - 1);
                    
                    if ($isLastPayment && $shouldFullyPay) {
                        // Last payment takes the remaining amount to fully pay
                        $paymentAmount = $remainingAmount;
                    } else {
                        // Random amount between 5% and 90% of remaining amount
                        $maxPayment = min($remainingAmount * 0.9, $remainingAmount - 0.01);
                        $minPayment = max(0.01, $remainingAmount * 0.05);
                        $paymentAmount = rand((int)($minPayment * 100), (int)($maxPayment * 100)) / 100;
                    }
                    
                    // Ensure we don't exceed the invoice total
                    if ($paymentAmount > $remainingAmount) {
                        $paymentAmount = $remainingAmount;
                    }
                    
                    // Ensure minimum payment amount
                    if ($paymentAmount < 0.01) {
                        continue;
                    }
                    
                    Payment::factory()->create([
                        'invoice_id' => $invoice->id,
                        'amount' => round($paymentAmount, 2),
                    ]);
                    
                    $remainingAmount -= $paymentAmount;
                    
                    // Break if we've paid the full amount
                    if ($remainingAmount < 0.01) {
                        break;
                    }
                }
            }
        }
    }
}
