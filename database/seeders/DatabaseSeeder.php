<?php

namespace Database\Seeders;

use App\Domain\Invoices\Contracts\InvoiceServiceInterface;
use App\Models\Invoice;
use App\Models\Payment;
use App\Models\User;
use App\States\Invoice\AwaitingPayment;
use App\States\Invoice\Created;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        User::factory()->create([
            'firstname' => 'Test',
            'lastname' => 'User',
            'email' => 'test@example.com',
            'email_verified_at' => now(),
            'password' => '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
            'remember_token' => Str::random(10),
        ]);

        User::factory()->create([
            'firstname' => 'Charles',
            'lastname' => 'chabvonga',
            'email' => 'charleschabvonga@gmail.com',
            'email_verified_at' => now(),
            'password' => '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
            'remember_token' => Str::random(10),
        ]);

        $invoices = collect();
        for ($i = 0; $i < 50; $i++) {
            $initialState = rand(1, 100) <= 30 ? Created::class : AwaitingPayment::class;
            
            $invoices->push(
                Invoice::factory()->create(['state' => $initialState])
            );
        }

        $invoiceService = app(InvoiceServiceInterface::class);

        foreach ($invoices as $invoice) {
            if (!($invoice->state instanceof AwaitingPayment)) {
                continue;
            }

            $numPayments = rand(0, 5);
            
            if ($numPayments > 0) {
                $totalAmount = (float) $invoice->total_amount;
                $remainingAmount = $totalAmount;
                
                $shouldFullyPay = rand(1, 100) <= 70;

                for ($i = 0; $i < $numPayments; $i++) {
                    $isLastPayment = ($i === $numPayments - 1);
                    
                    if ($isLastPayment && $shouldFullyPay) {
                        $paymentAmount = $remainingAmount;
                    } else {
                        $maxPayment = min($remainingAmount * 0.9, $remainingAmount - 0.01);
                        $minPayment = max(0.01, $remainingAmount * 0.05);
                        $paymentAmount = rand((int)($minPayment * 100), (int)($maxPayment * 100)) / 100;
                    }
                    
                    if ($paymentAmount > $remainingAmount) {
                        $paymentAmount = $remainingAmount;
                    }
                    
                    if ($paymentAmount < 0.01) {
                        continue;
                    }
                    
                    Payment::factory()->create([
                        'invoice_id' => $invoice->id,
                        'amount' => round($paymentAmount, 2),
                    ]);
                    
                    $remainingAmount -= $paymentAmount;
                    
                    if ($remainingAmount < 0.01) {
                        break;
                    }
                }
            }

            $invoice->refresh();
            $invoiceService->updateInvoiceState($invoice);
        }
    }
}
