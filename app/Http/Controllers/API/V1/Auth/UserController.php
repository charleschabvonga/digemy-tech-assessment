<?php

namespace App\Http\Controllers\API\V1\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class UserController extends Controller
{
  public function __invoke(Request $request)
  {
    /** @var \App\Models\User $user */
    $user = $request->user();

    return response()->json([
      'id' => $user->id,
      'firstname' => $user->firstname,
      'lastname' => $user->lastname,
      'email' => $user->email,
    ]);
  }
}

