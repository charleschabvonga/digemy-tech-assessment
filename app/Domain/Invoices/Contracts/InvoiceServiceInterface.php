<?php
declare(strict_types=1);

namespace App\Domain\Invoices\Contracts;

use App\DTO\Invoices\InvoiceData;
use App\Models\Invoice;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface InvoiceServiceInterface
{
  public function createInvoice(InvoiceData $data): Invoice;
  public function updateInvoiceState(Invoice $invoice): void;
  public function listInvoices(int $perPage = 5): LengthAwarePaginator;
}
