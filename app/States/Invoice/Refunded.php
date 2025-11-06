<?php

declare(strict_types=1);

namespace App\States\Invoice;

use App\States\Enums\StateIntent;

class Refunded extends InvoiceState
{
    public static string $name = 'refunded';

    public function description(): string
    {
        return 'Invoice has been refunded';
    }

    public function displayLabel(): string
    {
        return 'Refunded';
    }

    public function intent(): StateIntent
    {
        return StateIntent::SECONDARY;
    }
}
