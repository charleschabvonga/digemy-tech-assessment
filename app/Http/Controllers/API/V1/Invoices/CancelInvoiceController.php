<?php

namespace App\Http\Controllers\API\V1\Invoices;

use App\Http\Controllers\Controller;
use App\Models\Invoice;
use App\States\Invoice\Cancelled;
use App\States\Invoice\FullyPaid;
use App\States\Invoice\PartiallyPaid;
use App\States\Invoice\Refunded;
use Illuminate\Support\Facades\DB;

class CancelInvoiceController extends Controller
{
  public function __invoke(Invoice $invoice)
  {
    return DB::transaction(function () use ($invoice) {
      $isRefund = $invoice->state instanceof PartiallyPaid || $invoice->state instanceof FullyPaid;

      if ($isRefund) {
        if (! ($invoice->state instanceof Refunded)) {
          $invoice->state->transitionTo(Refunded::class);
        }

        $invoice->refunded_at = now();
        $invoice->save();
      } else {
        if (! ($invoice->state instanceof Cancelled)) {
          $invoice->state->transitionTo(Cancelled::class);
        }
        $invoice->payments()->delete();
        $invoice->delete();
      }

      return response()->noContent();
    });
  }
}

