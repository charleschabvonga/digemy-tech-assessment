<p align="center"><a href="https://laravel.com" target="_blank"><img src="https://raw.githubusercontent.com/laravel/art/master/logo-lockup/5%20SVG/2%20CMYK/1%20Full%20Color/laravel-logolockup-cmyk-red.svg" width="400"></a></p>

<p align="center">
<a href="https://travis-ci.org/laravel/framework"><img src="https://travis-ci.org/laravel/framework.svg" alt="Build Status"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/dt/laravel/framework" alt="Total Downloads"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/v/laravel/framework" alt="Latest Stable Version"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/l/laravel/framework" alt="License"></a>
</p>

# Installation

Please ensure you have the latest version of docker installed in your local machine.

After cloning the repository in you machine, please follow the following instructions.

    $ cd digemy-tech-assessment/
    $ cp .docker/docker-compose.local.yml docker-compose.yml
    $ cp .env.example .env
    $ docker-compose up -d

After docker has finished building the containers, you can then install the packages.

    $ docker-compose exec app bash
    $ composer install
    $ php artisan migrate
    $ php artisan db:seed

The application should run on **http://localhost:8000**

# Assessment

### Introduction

Please note that there is no wrong answer here. We want to assess how you tackle an issue, the steps you take to resolve a problem in Laravel, and how readable and robust is your code vs the business requirement. Most importantly, we also want to assess whether you can actually look at external packages, and learn and use them efficiently in our code base.

### Story

Let’s assume that we have a client that has an invoicing application. For the sake of this assessment, we will disregard customers and invoice line items and rather concentrate
on the total amount of the invoice.

We want to be able to change the state of an invoice based on the payment received for it.


For example, when an invoice total amount is R100.00, and we receive a payment of R10.00, the invoice state should change from “awaiting payment” to “partially paid”.
Similarly, when we receive an amount equal to the invoice’s total amount, its state should change to “paid in full”.
If a payment is deleted for that invoice, we should be able to also revert the state to partially paid or awaiting payment, depending on the total payments remaining after a payment is deleted.

What you will do

1. Create an invoices table to hold a title, a description of the invoice, and the total amount
2. Create a payments table where all the payments for the invoices will be logged
3. Build a state management logic for the scenario mentioned above. We require that you make use of (https://github.com/spatie/laravel-model-states) [Spatie laravel model states).
4. Please build a simple UI to showcase how your logic works or write tests.


Requirement

* The default state of an invoice is "created"
* We can start logging payments for the invoice only when the invoice state is changed to "awaiting-payment"
* When a partial payment is received, the invoice state should change to "partially-paid"
* When a full payment is received, the invoice state should change to "fully-paid"
* When a payment is deleted, we need to revert back to "partially paid" or "awaiting payment" depending on the payment amount deleted

**Notes**

Please feel free to anticipate the constraints or business requirements that are not explicitly given in the story and/or requirements above. Feel free to implement them in the code, and explain why you felt the changes were necessary.

Good luck! We look forward to seeing your work 😃.

## Additional Constraints & Business Requirements

Beyond the core requirements, the following additional constraints and business requirements have been implemented:

### 1. **Refund Functionality**
- Invoices that are in `partially-paid` or `fully-paid` states can be refunded
- When refunded, invoices transition to a `refunded` state and are marked with a `refunded_at` timestamp
- Refunded invoices are soft-deleted but remain visible in the system for audit purposes
- **Rationale**: In real-world scenarios, invoices may need to be refunded due to customer disputes, errors, or cancellations. This provides a clear audit trail while maintaining data integrity.

### 2. **Cancellation Functionality**
- Invoices in `created` or `awaiting-payment` states can be cancelled
- Cancelled invoices transition to a `cancelled` state and are soft-deleted
- All associated payments are also soft-deleted when an invoice is cancelled
- **Rationale**: Invoices may need to be cancelled before they are sent to customers or before any payments are received. This prevents orphaned invoices in the system.

### 3. **Payment Validation & Business Rules**
- **Positive Amount Validation**: Payments must be greater than zero (minimum 0.01)
- **Outstanding Amount Validation**: Payments cannot exceed the outstanding invoice amount
- **State-Based Payment Restrictions**: Payments can only be made when an invoice is in `awaiting-payment` or `partially-paid` states
- **Precision Handling**: Uses `bccomp()` for decimal comparisons to avoid floating-point precision issues with monetary calculations
- **Transaction Safety**: All payment operations are wrapped in database transactions to ensure data consistency
- **Rationale**: These validations prevent invalid payment scenarios such as overpayments, negative payments, or payments on invoices that shouldn't accept them. Transaction safety ensures atomicity of operations.

### 4. **Soft Deletes**
- Both invoices and payments use soft deletes (Laravel's `SoftDeletes` trait)
- Deleted payments are excluded from calculations but remain in the database for audit purposes
- Refunded invoices are visible in listings but marked appropriately
- **Rationale**: Soft deletes maintain data integrity and provide an audit trail while allowing for data recovery if needed. This is critical for financial applications.

### 5. **State Machine Transitions**
- Proper state transitions using Spatie Model States package
- States include: `created`, `awaiting-payment`, `partially-paid`, `fully-paid`, `cancelled`, and `refunded`
- State transitions are validated to ensure only valid transitions occur
- **Rationale**: A proper state machine ensures that invoices can only transition through valid states, preventing invalid business scenarios.

### 6. **User Authentication**
- Full authentication system using Laravel Sanctum
- User registration and login functionality
- Protected API routes requiring authentication
- **Note**: The authentication system does not include email verification. Users can sign up and will be automatically logged in without email confirmation. This is a simplified implementation for the assessment and should not be used in production without proper email verification.
- **Rationale**: In a real invoicing application, user authentication is essential for security and to track who performs which actions. However, for this assessment, email verification was omitted to simplify the setup process.

## Using the Application

### Seeded Data

After running `php artisan db:seed`, the following data is available:

**Users:**
- **Email**: `test@example.com` | **Password**: `password`
- **Email**: `charleschabvonga@gmail.com` | **Password**: `password`

**Invoices:**
- 50 invoices are created with various states:
  - 30% are in `created` state (15 invoices)
  - 70% are in `awaiting-payment` state (35 invoices)
- For invoices in `awaiting-payment` state:
  - 0-5 payments are randomly created per invoice
  - 70% chance that the invoice will be fully paid
  - Payment amounts are calculated to ensure they don't exceed the invoice total
  - Invoice states are automatically updated based on payment totals

### Signing In

1. Navigate to **http://localhost:8000** in your browser
2. You will be redirected to the login page if not authenticated
3. Use one of the seeded user credentials:
   - Email: `test@example.com`
   - Password: `password`
4. Click "Sign in" to authenticate
5. After successful login, you will be redirected to the invoices list page

**Note**: If you try to access protected routes without authentication, you will be automatically redirected to the login page. After logging in, you'll be redirected back to your original destination.

### Navigation Through the Application

The application has the following routes and navigation structure:

**Public Routes:**
- `/` - Login page (redirects to `/invoices` if already authenticated)
- `/signup` - User registration page

**Protected Routes (require authentication):**
- `/invoices` - Invoice list page showing all invoices with pagination
  - Displays invoice title, description, total amount, state, and payment summary
  - Shows action buttons based on invoice state (Send to Customer, Make Payment, Cancel/Refund, etc.)
  - Includes filters and search functionality
  
- `/invoices/create` - Create a new invoice
  - Form fields: Title (required), Description (optional), Total Amount (required, minimum 0.01)
  - New invoices are created in `created` state
  
- `/invoices/:id` - View invoice details
  - Shows full invoice information
  - Displays all associated payments in a table
  - Allows making new payments (if invoice is in `awaiting-payment` or `partially-paid` state)
  - Allows deleting payments (soft delete)
  - Shows action buttons based on invoice state:
    - **Send to Customer**: Transitions from `created` to `awaiting-payment`
    - **Make Payment**: Opens payment form (only for `awaiting-payment` or `partially-paid` states)
    - **Delete Payment**: Soft deletes a payment and recalculates invoice state
    - **Cancel/Refund**: Cancels or refunds the invoice based on current state

**Navigation Features:**
- Top navigation bar with user menu (logout option)
- Breadcrumb navigation on invoice detail pages
- Back buttons to return to previous pages
- State-based UI elements (buttons, badges, colors) that change based on invoice state

### Testing Unit Tests

The application includes comprehensive unit tests covering models, services, and business logic. To run the tests:

**Run all tests:**
```bash
docker-compose exec app bash
php artisan test
```

**Run specific test suites:**
```bash
# Run only unit tests
php artisan test --testsuite=Unit

# Run only feature tests
php artisan test --testsuite=Feature
```

**Run specific test files:**
```bash
# Test Invoice model
php artisan test tests/Unit/InvoiceTest.php

# Test Payment Service
php artisan test tests/Unit/PaymentServiceTest.php

# Test Invoice Service
php artisan test tests/Unit/InvoiceServiceTest.php
```

**Run specific test methods:**
```bash
# Run a specific test method
php artisan test --filter it_can_make_a_payment_when_invoice_is_awaiting_payment
```

**Using PHPUnit directly:**
```bash
# Run all tests
vendor/bin/phpunit

# Run with coverage (if configured)
vendor/bin/phpunit --coverage-html coverage
```

**Test Coverage:**

The following unit tests are available:

- **InvoiceTest.php**: Tests invoice model functionality including:
  - Fillable attributes
  - Decimal casting
  - State casting
  - Payment relationships
  - Total paid calculations
  - Outstanding amount calculations
  - State transitions
  - Soft delete functionality

- **PaymentServiceTest.php**: Tests payment service business logic including:
  - Showing invoices with payments
  - Making payments in valid states
  - Payment validation (positive amounts, outstanding limits)
  - Payment deletion
  - Automatic state updates after payments

- **InvoiceServiceTest.php**: Tests invoice service functionality including:
  - Invoice creation
  - State update logic
  - Invoice listing with filters

- **PaymentTest.php**: Tests payment model functionality

- **UserTest.php**: Tests user model functionality

**Note**: Tests use an in-memory SQLite database for fast execution and isolation. The test database is automatically migrated and seeded before each test run.

---

Thanks for the opportunity! I really enjoyed working on this assessment 😊🎉. I've completed the core requirements and added some extra features that I thought would be useful for a real invoicing system. I've documented everything above with explanations for why I added each feature. 

One thing I would have loved to add is state management for payments too (similar to how invoices have states), but time was a constraint. Happy to discuss any part of the implementation!

