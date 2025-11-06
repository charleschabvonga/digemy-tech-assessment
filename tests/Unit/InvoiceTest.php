<?php

namespace Tests\Unit;

use App\Models\Invoice;
use App\Models\Payment;
use App\States\Invoice\AwaitingPayment;
use App\States\Invoice\Created;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class InvoiceTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function it_has_fillable_attributes()
    {
        $invoice = new Invoice();
        
        $this->assertEquals([
            'title',
            'description',
            'total_amount',
            'state',
            'refunded_at',
        ], $invoice->getFillable());
    }

    /** @test */
    public function it_casts_total_amount_to_decimal()
    {
        $invoice = Invoice::factory()->create([
            'total_amount' => '100.50',
        ]);

        $this->assertEquals('100.50', $invoice->total_amount);
    }

    /** @test */
    public function it_casts_state_to_invoice_state()
    {
        $invoice = Invoice::factory()->create([
            'state' => Created::class,
        ]);

        $this->assertInstanceOf(Created::class, $invoice->state);
    }

    /** @test */
    public function it_has_payments_relationship()
    {
        $invoice = Invoice::factory()->create();
        $payment = Payment::factory()->create([
            'invoice_id' => $invoice->id,
            'amount' => '50.00',
        ]);

        $this->assertTrue($invoice->payments->contains($payment));
        $this->assertEquals($invoice->id, $payment->invoice_id);
    }

    /** @test */
    public function it_calculates_total_paid_correctly()
    {
        $invoice = Invoice::factory()->create([
            'total_amount' => '100.00',
        ]);

        Payment::factory()->create([
            'invoice_id' => $invoice->id,
            'amount' => '30.00',
        ]);

        Payment::factory()->create([
            'invoice_id' => $invoice->id,
            'amount' => '20.00',
        ]);

        $this->assertEquals('50.00', $invoice->totalPaid());
    }

    /** @test */
    public function it_returns_zero_when_no_payments()
    {
        $invoice = Invoice::factory()->create([
            'total_amount' => '100.00',
        ]);

        $this->assertEquals('0.00', $invoice->totalPaid());
    }

    /** @test */
    public function it_calculates_outstanding_correctly()
    {
        $invoice = Invoice::factory()->create([
            'total_amount' => '100.00',
        ]);

        Payment::factory()->create([
            'invoice_id' => $invoice->id,
            'amount' => '30.00',
        ]);

        $this->assertEquals('70.00', $invoice->outstanding());
    }

    /** @test */
    public function it_returns_full_amount_when_no_payments()
    {
        $invoice = Invoice::factory()->create([
            'total_amount' => '100.00',
        ]);

        $this->assertEquals('100.00', $invoice->outstanding());
    }

    /** @test */
    public function it_can_transition_to_awaiting_payment()
    {
        $invoice = Invoice::factory()->create([
            'state' => Created::class,
        ]);

        $result = $invoice->sendToCustomer();

        $this->assertInstanceOf(AwaitingPayment::class, $result->state);
        $this->assertInstanceOf(AwaitingPayment::class, $invoice->fresh()->state);
    }

    /** @test */
    public function it_does_not_transition_if_already_awaiting_payment()
    {
        $invoice = Invoice::factory()->create([
            'state' => AwaitingPayment::class,
        ]);

        $result = $invoice->sendToCustomer();

        $this->assertInstanceOf(AwaitingPayment::class, $result->state);
        $this->assertInstanceOf(AwaitingPayment::class, $invoice->fresh()->state);
    }

    /** @test */
    public function it_has_state_meta_attribute()
    {
        $invoice = Invoice::factory()->create([
            'state' => Created::class,
        ]);

        $stateMeta = $invoice->state_meta;

        $this->assertIsArray($stateMeta);
        $this->assertArrayHasKey('name', $stateMeta);
        $this->assertArrayHasKey('description', $stateMeta);
        $this->assertArrayHasKey('display', $stateMeta);
        $this->assertArrayHasKey('intent', $stateMeta);
    }

    /** @test */
    public function it_can_be_soft_deleted()
    {
        $invoice = Invoice::factory()->create();

        $invoice->delete();

        $this->assertSoftDeleted('invoices', [
            'id' => $invoice->id,
        ]);
    }
}

