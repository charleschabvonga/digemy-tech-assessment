<?php

declare(strict_types=1);

namespace App\States\Invoice;

use App\States\Enums\StateIntent;

class PartiallyPaid extends InvoiceState
{
    public static string $name = 'partially_paid';

    public function description(): string
    {
        return 'A partial payment has been received';
    }

    public function displayAmount(): string
    {
        return 'Partially Paid';
    }

    public function intent(): StateIntent
    {
        return StateIntent::WARNING;
    }
}
