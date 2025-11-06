<?php

declare(strict_types=1);

namespace App\Domain\Invoices\Services;

use App\DTO\Payments\PaymentData;
use App\Domain\Invoices\Contracts\InvoiceServiceInterface;
use App\Domain\Invoices\Contracts\PaymentServiceInterface;
use App\Models\Invoice;
use App\Models\Payment;
use App\States\Invoice\AwaitingPayment;
use App\States\Invoice\PartiallyPaid;
use Illuminate\Support\Facades\DB;
use InvalidArgumentException;

class PaymentService implements PaymentServiceInterface
{
  public function __construct(
    private readonly InvoiceServiceInterface $invoiceService
  ) {}

  public function showInvoice(Invoice $invoice): Invoice
  {
    return $invoice->load(['payments' => function ($query) {
      $query->whereNull('deleted_at');
    }]);
  }

  public function makePayment(Invoice $invoice, PaymentData $data): Payment
  {
    if (! ($invoice->state instanceof AwaitingPayment) && ! ($invoice->state instanceof PartiallyPaid)) {
      throw new InvalidArgumentException('Payments allowed only when AwaitingPayment or PartiallyPaid.');
    }

    return DB::transaction(function () use ($invoice, $data) {
      $amount = $data->amount;

      if (bccomp($amount, '0', 2) <= 0) {
        throw new InvalidArgumentException('Payment amount must be positive.');
      }

      if (bccomp($amount, $invoice->outstanding(), 2) === 1) {
        throw new InvalidArgumentException('Payment exceeds outstanding amount.');
      }

      $payment = $invoice->payments()->create(['amount' => $amount]);
      $this->invoiceService->updateInvoiceState($invoice->refresh());

      return $payment;
    });
  }

  public function deletePayment(Payment $payment): void
  {
    DB::transaction(function () use ($payment) {
      $invoice = $payment->invoice;
      $payment->delete();
      $this->invoiceService->updateInvoiceState($invoice->refresh());
    });
  }
}
