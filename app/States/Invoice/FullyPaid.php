<?php

declare(strict_types=1);

namespace App\States\Invoice;

use App\States\Enums\StateIntent;

class FullyPaid extends InvoiceState
{
    public static string $name = 'fully_paid';

    public function description(): string
    {
        return 'Paid in full';
    }

    public function displayAmount(): string
    {
        return 'Paid in Full';
    }

    public function intent(): StateIntent
    {
        return StateIntent::SUCCESS;
    }
}
