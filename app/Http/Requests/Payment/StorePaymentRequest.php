<?php
declare(strict_types=1);

namespace App\Http\Requests\Payment;

use App\DTO\Payments\PaymentData;
use Illuminate\Foundation\Http\FormRequest;

class StorePaymentRequest extends FormRequest
{
  public function rules(): array
  {
    return [
      'amount' => ['required','numeric','min:0.01'],
    ];
  }

  public function toDTO(): PaymentData
  {
    $validated = $this->validated();
    
    return new PaymentData(amount: (string) $validated['amount']);
  }
}