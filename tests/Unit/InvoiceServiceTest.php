<?php

namespace Tests\Unit;

use App\DTO\Invoices\InvoiceData;
use App\Domain\Invoices\Services\InvoiceService;
use App\Models\Invoice;
use App\Models\Payment;
use App\States\Invoice\AwaitingPayment;
use App\States\Invoice\Created;
use App\States\Invoice\FullyPaid;
use App\States\Invoice\PartiallyPaid;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class InvoiceServiceTest extends TestCase
{
    use RefreshDatabase;

    private InvoiceService $service;

    protected function setUp(): void
    {
        parent::setUp();
        $this->service = new InvoiceService();
    }

    /** @test */
    public function it_can_create_an_invoice()
    {
        $data = new InvoiceData(
            title: 'Test Invoice',
            description: 'Test Description',
            totalAmount: '100.00'
        );

        $invoice = $this->service->createInvoice($data);

        $this->assertInstanceOf(Invoice::class, $invoice);
        $this->assertEquals('Test Invoice', $invoice->title);
        $this->assertEquals('Test Description', $invoice->description);
        $this->assertEquals('100.00', $invoice->total_amount);
        $this->assertInstanceOf(Created::class, $invoice->state);
    }

    /** @test */
    public function it_updates_invoice_state_to_awaiting_payment_when_no_payments()
    {
        $invoice = Invoice::factory()->create([
            'state' => Created::class,
            'total_amount' => '100.00',
        ]);

        $this->service->updateInvoiceState($invoice);

        $this->assertInstanceOf(AwaitingPayment::class, $invoice->fresh()->state);
    }

    /** @test */
    public function it_updates_invoice_state_to_fully_paid_when_paid_in_full()
    {
        $invoice = Invoice::factory()->create([
            'state' => AwaitingPayment::class,
            'total_amount' => '100.00',
        ]);

        Payment::factory()->create([
            'invoice_id' => $invoice->id,
            'amount' => '100.00',
        ]);

        $this->service->updateInvoiceState($invoice->fresh());

        $this->assertInstanceOf(FullyPaid::class, $invoice->fresh()->state);
    }

    /** @test */
    public function it_updates_invoice_state_to_partially_paid_when_partially_paid()
    {
        $invoice = Invoice::factory()->create([
            'state' => AwaitingPayment::class,
            'total_amount' => '100.00',
        ]);

        Payment::factory()->create([
            'invoice_id' => $invoice->id,
            'amount' => '50.00',
        ]);

        $this->service->updateInvoiceState($invoice->fresh());

        $this->assertInstanceOf(PartiallyPaid::class, $invoice->fresh()->state);
    }

    /** @test */
    public function it_does_not_change_state_if_already_correct()
    {
        $invoice = Invoice::factory()->create([
            'state' => AwaitingPayment::class,
            'total_amount' => '100.00',
        ]);

        $originalState = $invoice->state;
        $this->service->updateInvoiceState($invoice);

        $this->assertInstanceOf(AwaitingPayment::class, $invoice->fresh()->state);
    }

    /** @test */
    public function it_can_list_invoices_with_pagination()
    {
        Invoice::factory()->count(10)->create();

        $result = $this->service->listInvoices(5);

        $this->assertCount(5, $result->items());
        $this->assertEquals(10, $result->total());
    }

    /** @test */
    public function it_includes_soft_deleted_invoices_with_refunded_at()
    {
        $invoice = Invoice::factory()->create([
            'refunded_at' => now(),
        ]);
        $invoice->delete();

        $result = $this->service->listInvoices(10);

        $this->assertTrue(collect($result->items())->contains(fn($item) => $item->id === $invoice->id));
    }
}

