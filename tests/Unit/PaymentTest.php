<?php

namespace Tests\Unit;

use App\Models\Invoice;
use App\Models\Payment;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PaymentTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function it_has_fillable_attributes()
    {
        $payment = new Payment();
        
        $this->assertEquals([
            'invoice_id',
            'amount',
        ], $payment->getFillable());
    }

    /** @test */
    public function it_casts_amount_to_decimal()
    {
        $payment = Payment::factory()->create([
            'amount' => '50.75',
        ]);

        $this->assertEquals('50.75', $payment->amount);
    }

    /** @test */
    public function it_belongs_to_an_invoice()
    {
        $invoice = Invoice::factory()->create();
        $payment = Payment::factory()->create([
            'invoice_id' => $invoice->id,
        ]);

        $this->assertInstanceOf(Invoice::class, $payment->invoice);
        $this->assertEquals($invoice->id, $payment->invoice->id);
    }

    /** @test */
    public function it_can_be_created_with_factory()
    {
        $invoice = Invoice::factory()->create();
        $payment = Payment::factory()->create([
            'invoice_id' => $invoice->id,
        ]);

        $this->assertDatabaseHas('payments', [
            'id' => $payment->id,
            'invoice_id' => $invoice->id,
        ]);
    }

    /** @test */
    public function it_can_be_soft_deleted()
    {
        $invoice = Invoice::factory()->create();
        $payment = Payment::factory()->create([
            'invoice_id' => $invoice->id,
        ]);

        $payment->delete();

        $this->assertSoftDeleted('payments', [
            'id' => $payment->id,
        ]);
    }
}

