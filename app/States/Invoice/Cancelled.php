<?php

declare(strict_types=1);

namespace App\States\Invoice;

use App\States\Enums\StateIntent;

class Cancelled extends InvoiceState
{
    public static string $name = 'cancelled';

    public function description(): string
    {
        return 'Invoice has been cancelled';
    }

    public function displayLabel(): string
    {
        return 'Cancelled';
    }

    public function intent(): StateIntent
    {
        return StateIntent::GENERAL;
    }
}

