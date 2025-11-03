<?php

declare(strict_types=1);

namespace App\States\Enums;

enum StateIntent: string
{
  case GENERAL   = 'general';
  case INFO      = 'info';
  case WARNING   = 'warning';
  case DANGER    = 'danger';
  case SUCCESS   = 'success';
  case PRIMARY   = 'primary';
  case SECONDARY = 'secondary';
}
