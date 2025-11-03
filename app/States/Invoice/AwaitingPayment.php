<?php

declare(strict_types=1);

namespace App\States\Invoice;

use App\States\Enums\StateIntent;

class AwaitingPayment extends InvoiceState
{
    public static string $name = 'awaiting_payment';

    public function description(): string
    {
        return 'The invoice is awaiting payment';
    }

    public function displayAmount(): string
    {
        return 'Awaiting Payment';
    }

    public function intent(): StateIntent
    {
        return StateIntent::PRIMARY;
    }
}
