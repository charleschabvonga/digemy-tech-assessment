<?php
declare(strict_types=1);

namespace App\DTO\Invoices;

use Spatie\LaravelData\Data;

final class InvoiceData extends Data
{
  public function __construct(
    public readonly string $title,
    public readonly ?string $description,
    public readonly string $totalAmount,
  ) {}
}