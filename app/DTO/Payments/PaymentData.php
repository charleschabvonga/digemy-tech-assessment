<?php
declare(strict_types=1);

namespace App\DTO\Payments;

final class PaymentData
{
  public function __construct(
  public readonly string $amount,
  ) {}
}