<?php

namespace Tests\Unit;

use App\DTO\Payments\PaymentData;
use App\Domain\Invoices\Contracts\InvoiceServiceInterface;
use App\Domain\Invoices\Services\InvoiceService;
use App\Domain\Invoices\Services\PaymentService;
use App\Models\Invoice;
use App\Models\Payment;
use App\States\Invoice\AwaitingPayment;
use App\States\Invoice\Created;
use App\States\Invoice\FullyPaid;
use App\States\Invoice\PartiallyPaid;
use Illuminate\Foundation\Testing\RefreshDatabase;
use InvalidArgumentException;
use Tests\TestCase;

class PaymentServiceTest extends TestCase
{
    use RefreshDatabase;

    private PaymentService $service;
    private InvoiceServiceInterface $invoiceService;

    protected function setUp(): void
    {
        parent::setUp();
        $this->invoiceService = new InvoiceService();
        $this->service = new PaymentService($this->invoiceService);
    }

    /** @test */
    public function it_can_show_an_invoice_with_payments()
    {
        $invoice = Invoice::factory()->create();
        $payment = Payment::factory()->create([
            'invoice_id' => $invoice->id,
        ]);

        $result = $this->service->showInvoice($invoice);

        $this->assertInstanceOf(Invoice::class, $result);
        $this->assertTrue($result->relationLoaded('payments'));
        $this->assertTrue($result->payments->contains($payment));
    }

    /** @test */
    public function it_excludes_soft_deleted_payments_when_showing_invoice()
    {
        $invoice = Invoice::factory()->create();
        $activePayment = Payment::factory()->create([
            'invoice_id' => $invoice->id,
        ]);
        $deletedPayment = Payment::factory()->create([
            'invoice_id' => $invoice->id,
        ]);
        $deletedPayment->delete();

        $result = $this->service->showInvoice($invoice);

        $this->assertTrue($result->payments->contains($activePayment));
        $this->assertFalse($result->payments->contains($deletedPayment));
    }

    /** @test */
    public function it_can_make_a_payment_when_invoice_is_awaiting_payment()
    {
        $invoice = Invoice::factory()->create([
            'state' => AwaitingPayment::class,
            'total_amount' => '100.00',
        ]);

        $data = new PaymentData(amount: '50.00');
        $payment = $this->service->makePayment($invoice, $data);

        $this->assertInstanceOf(Payment::class, $payment);
        $this->assertEquals('50.00', $payment->amount);
        $this->assertEquals($invoice->id, $payment->invoice_id);
    }

    /** @test */
    public function it_can_make_a_payment_when_invoice_is_partially_paid()
    {
        $invoice = Invoice::factory()->create([
            'state' => PartiallyPaid::class,
            'total_amount' => '100.00',
        ]);

        Payment::factory()->create([
            'invoice_id' => $invoice->id,
            'amount' => '30.00',
        ]);

        $data = new PaymentData(amount: '20.00');
        $payment = $this->service->makePayment($invoice->fresh(), $data);

        $this->assertInstanceOf(Payment::class, $payment);
        $this->assertEquals('20.00', $payment->amount);
    }

    /** @test */
    public function it_throws_exception_when_making_payment_on_created_invoice()
    {
        $invoice = Invoice::factory()->create([
            'state' => Created::class,
            'total_amount' => '100.00',
        ]);

        $data = new PaymentData(amount: '50.00');

        $this->expectException(InvalidArgumentException::class);
        $this->expectExceptionMessage('Payments allowed only when AwaitingPayment or PartiallyPaid.');

        $this->service->makePayment($invoice, $data);
    }

    /** @test */
    public function it_throws_exception_when_payment_amount_is_zero()
    {
        $invoice = Invoice::factory()->create([
            'state' => AwaitingPayment::class,
            'total_amount' => '100.00',
        ]);

        $data = new PaymentData(amount: '0.00');

        $this->expectException(InvalidArgumentException::class);
        $this->expectExceptionMessage('Payment amount must be positive.');

        $this->service->makePayment($invoice, $data);
    }

    /** @test */
    public function it_throws_exception_when_payment_amount_is_negative()
    {
        $invoice = Invoice::factory()->create([
            'state' => AwaitingPayment::class,
            'total_amount' => '100.00',
        ]);

        $data = new PaymentData(amount: '-10.00');

        $this->expectException(InvalidArgumentException::class);
        $this->expectExceptionMessage('Payment amount must be positive.');

        $this->service->makePayment($invoice, $data);
    }

    /** @test */
    public function it_throws_exception_when_payment_exceeds_outstanding()
    {
        $invoice = Invoice::factory()->create([
            'state' => AwaitingPayment::class,
            'total_amount' => '100.00',
        ]);

        Payment::factory()->create([
            'invoice_id' => $invoice->id,
            'amount' => '50.00',
        ]);

        $data = new PaymentData(amount: '60.00');

        $this->expectException(InvalidArgumentException::class);
        $this->expectExceptionMessage('Payment exceeds outstanding amount.');

        $this->service->makePayment($invoice->fresh(), $data);
    }

    /** @test */
    public function it_updates_invoice_state_after_making_payment()
    {
        $invoice = Invoice::factory()->create([
            'state' => AwaitingPayment::class,
            'total_amount' => '100.00',
        ]);

        $data = new PaymentData(amount: '50.00');
        $this->service->makePayment($invoice, $data);

        $this->assertInstanceOf(PartiallyPaid::class, $invoice->fresh()->state);
    }

    /** @test */
    public function it_updates_invoice_state_to_fully_paid_when_payment_completes_invoice()
    {
        $invoice = Invoice::factory()->create([
            'state' => PartiallyPaid::class,
            'total_amount' => '100.00',
        ]);

        Payment::factory()->create([
            'invoice_id' => $invoice->id,
            'amount' => '50.00',
        ]);

        $data = new PaymentData(amount: '50.00');
        $this->service->makePayment($invoice->fresh(), $data);

        $this->assertInstanceOf(FullyPaid::class, $invoice->fresh()->state);
    }

    /** @test */
    public function it_can_delete_a_payment()
    {
        $invoice = Invoice::factory()->create([
            'state' => PartiallyPaid::class,
            'total_amount' => '100.00',
        ]);

        $payment = Payment::factory()->create([
            'invoice_id' => $invoice->id,
            'amount' => '50.00',
        ]);

        $this->service->deletePayment($payment);

        $this->assertSoftDeleted('payments', [
            'id' => $payment->id,
        ]);
    }

    /** @test */
    public function it_updates_invoice_state_after_deleting_payment()
    {
        $invoice = Invoice::factory()->create([
            'state' => PartiallyPaid::class,
            'total_amount' => '100.00',
        ]);

        $payment = Payment::factory()->create([
            'invoice_id' => $invoice->id,
            'amount' => '50.00',
        ]);

        $this->service->deletePayment($payment);

        $this->assertInstanceOf(AwaitingPayment::class, $invoice->fresh()->state);
    }
}

