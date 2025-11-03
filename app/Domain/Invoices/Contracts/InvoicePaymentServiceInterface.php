<?php
declare(strict_types=1);

namespace App\Domain\Invoices\Contracts;

use App\DTO\Payments\PaymentData;
use App\Models\Invoice;
use App\Models\Payment;

interface InvoicePaymentServiceInterface
{
  public function sendInvoiceToCustomer(Invoice $invoice): Invoice;
  public function addPayment(Invoice $invoice, PaymentData $data): Payment;
  public function deletePayment(Payment $payment): void;
  public function updateInvoiceState(Invoice $invoice): void;
}