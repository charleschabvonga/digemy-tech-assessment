<?php

declare(strict_types=1);

namespace App\States\Invoice;

use App\States\Enums\StateIntent;
use Spatie\ModelStates\State;
use Spatie\ModelStates\StateConfig;

abstract class InvoiceState extends State
{
  public static function config(): StateConfig
  {
    return parent::config()
      ->default(Created::class)
      ->allowTransition(Created::class, AwaitingPayment::class)
      ->allowTransition(AwaitingPayment::class, PartiallyPaid::class)
      ->allowTransition(AwaitingPayment::class, FullyPaid::class)
      ->allowTransition(PartiallyPaid::class, FullyPaid::class)
      ->allowTransition(FullyPaid::class, PartiallyPaid::class)
      ->allowTransition(PartiallyPaid::class, AwaitingPayment::class)
      ->allowTransition(Created::class, Cancelled::class) // When the invoice is deleted/order is cancelled, it should be set to Cancelled state
      ->allowTransition(AwaitingPayment::class, Cancelled::class) // When the invoice is deleted/order is cancelled, it should be set to Cancelled state
      ->allowTransition(PartiallyPaid::class, Refunded::class) // When the invoice is deleted/refunded, it should be set to Refunded state
      ->allowTransition(FullyPaid::class, Refunded::class); // When the invoice is deleted/refunded, it should be set to Refunded state
  }

  /**
   * Human readable description for UI/tooltips.
   */
  public function description(): string
  {
    return class_basename(static::class);
  }

  /**
   * Short badge/label for UI tables.
   */
  public function displayLabel(): string
  {
    return $this->description();
  }

  /**
   * UI intent for coloring (maps to Tailwind/bootstrap classes client-side).
   */
  public function intent(): StateIntent
  {
    return StateIntent::GENERAL;
  }
}
