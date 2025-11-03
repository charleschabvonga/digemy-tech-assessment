<?php
declare(strict_types=1);

namespace App\Http\Requests\Invoice;

use App\DTO\Invoices\InvoiceData;
use Illuminate\Foundation\Http\FormRequest;

class StoreInvoiceRequest extends FormRequest
{
  public function rules(): array
  {
    return [
      'title' => ['required','string','max:255'],
      'description' => ['nullable','string'],
      'total_amount' => ['required','numeric','min:0.01'],
    ];
  }

  public function toDTO(): InvoiceData
  {
    $v = $this->validated();

    return new InvoiceData(
      title: $v['title'],
      description: $v['description'] ?? null,
      totalAmount: (string) $v['total_amount'],
    );
  }
}