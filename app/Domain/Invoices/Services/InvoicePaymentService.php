<?php

declare(strict_types=1);

namespace App\Domain\Invoices\Services;

use App\DTO\Payments\PaymentData;
use App\Domain\Invoices\Contracts\InvoicePaymentServiceInterface;
use App\Models\Invoice;
use App\Models\Payment;
use App\States\Invoice\AwaitingPayment;
use App\States\Invoice\FullyPaid;
use App\States\Invoice\PartiallyPaid;
use Illuminate\Support\Facades\DB;
use InvalidArgumentException;

class InvoicePaymentService implements InvoicePaymentServiceInterface
{
  public function sendInvoiceToCustomer(Invoice $invoice): Invoice
  {
    if (! ($invoice->state instanceof AwaitingPayment)) {
      $invoice->state->transitionTo(AwaitingPayment::class);
      $invoice->save();
    }

    return $invoice->refresh();
  }

  public function addPayment(Invoice $invoice, PaymentData $data): Payment
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
      $this->updateInvoiceState($invoice->refresh());

      return $payment;
    });
  }

  public function deletePayment(Payment $payment): void
  {
    DB::transaction(function () use ($payment) {
      $invoice = $payment->invoice;
      $payment->delete();
      $this->updateInvoiceState($invoice->refresh());
    });
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
}
