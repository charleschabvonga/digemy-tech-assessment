<?php

declare(strict_types=1);

namespace App\Domain\Invoices\Services;

use App\DTO\Invoices\InvoiceData;
use App\Domain\Invoices\Contracts\InvoiceServiceInterface;
use App\Models\Invoice;
use App\States\Invoice\AwaitingPayment;
use App\States\Invoice\Cancelled;
use App\States\Invoice\Created;
use App\States\Invoice\FullyPaid;
use App\States\Invoice\PartiallyPaid;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class InvoiceService implements InvoiceServiceInterface
{
  public function createInvoice(InvoiceData $data): Invoice
  {
    return Invoice::create([
      'title' => $data->title,
      'description' => $data->description,
      'total_amount' => $data->totalAmount,
      'state' => Created::class,
    ]);
  }

  public function updateInvoiceState(Invoice $invoice): void
  {
    $paid = $invoice->totalPaid();

    if (bccomp($paid, '0', 2) === 0) {
      if (! ($invoice->state instanceof AwaitingPayment)) {
        $invoice->state->transitionTo(AwaitingPayment::class);
      }
    } elseif (bccomp($paid, $invoice->total_amount, 2) === 0) {
      if (! ($invoice->state instanceof FullyPaid)) {
        $invoice->state->transitionTo(FullyPaid::class);
      }
    } else {
      if (! ($invoice->state instanceof PartiallyPaid)) {
        $invoice->state->transitionTo(PartiallyPaid::class);
      }
    }

    $invoice->save();
  }

  public function listInvoices(int $perPage = 5): LengthAwarePaginator
  {
    return Invoice::withTrashed()
      ->withSum(['payments' => fn($q) => $q->whereNull('deleted_at')], 'amount')
      ->where(function ($query) {
        $query->whereNull('deleted_at')
              ->orWhereNotNull('refunded_at');
      })
      ->whereNot('state', Cancelled::class)
      ->orderBy('id', 'desc')
      ->paginate($perPage);
  }
}
