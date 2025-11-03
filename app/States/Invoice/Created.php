<?php

declare(strict_types=1);

namespace App\States\Invoice;

use App\States\Enums\StateIntent;

class Created extends InvoiceState
{
  public static string $name = 'created';

  public function description(): string
  {
    return 'Invoice created (not issued)';
  }

  public function displayAmount(): string
  {
    return 'Created';
  }

  public function intent(): StateIntent
  {
    return StateIntent::INFO;
  }
}
