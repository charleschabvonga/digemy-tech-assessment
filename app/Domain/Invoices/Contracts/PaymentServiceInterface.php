<?php
declare(strict_types=1);

namespace App\Domain\Invoices\Contracts;

use App\DTO\Payments\PaymentData;
use App\Models\Invoice;
use App\Models\Payment;

interface PaymentServiceInterface
{
  public function showInvoice(Invoice $invoice): Invoice;
  public function makePayment(Invoice $invoice, PaymentData $data): Payment;
  public function deletePayment(Payment $payment): void;
}
