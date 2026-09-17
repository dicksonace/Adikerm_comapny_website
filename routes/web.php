<?php

use App\Http\Controllers\Admin\ContactMessageController;
use App\Http\Controllers\Admin\CustomerController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\EmployeeController;
use App\Http\Controllers\Admin\FaqController;
use App\Http\Controllers\Admin\OrderController;
use App\Http\Controllers\Admin\ProcessStepController;
use App\Http\Controllers\Admin\ProjectController;
use App\Http\Controllers\Admin\QuoteRequestController;
use App\Http\Controllers\Admin\SectionController;
use App\Http\Controllers\Admin\ServiceController;
use App\Http\Controllers\Admin\SettingsController;
use App\Http\Controllers\Admin\StatisticController;
use App\Http\Controllers\Admin\TeamMemberController;
use App\Http\Controllers\Admin\TestimonialController;
use App\Http\Controllers\Admin\WebsiteController;
use App\Http\Controllers\Admin\WhyChooseUsController;
use App\Http\Controllers\LocaleController;
use App\Http\Controllers\Site\FormController;
use App\Http\Controllers\Site\HomeController;
use App\Http\Controllers\Site\PageController;
use Illuminate\Support\Facades\Route;

Route::get('/', [HomeController::class, 'index'])->name('home');

Route::get('/locale/{locale}', [LocaleController::class, 'switch'])
    ->whereIn('locale', ['en', 'de'])
    ->name('locale.switch');

Route::get('/about', [PageController::class, 'about'])->name('site.about');
Route::get('/services', [PageController::class, 'services'])->name('site.services');
Route::get('/services/{slug}', [PageController::class, 'serviceShow'])->name('site.services.show');
Route::get('/portfolio', [PageController::class, 'portfolio'])->name('site.portfolio');
Route::get('/portfolio/{slug}', [PageController::class, 'portfolioShow'])->name('site.portfolio.show');
Route::get('/team', [PageController::class, 'team'])->name('site.team');
Route::get('/faq', [PageController::class, 'faq'])->name('site.faq');
Route::get('/contact', [PageController::class, 'contact'])->name('site.contact');
Route::get('/request-quote', [PageController::class, 'requestQuote'])->name('site.request-quote');
Route::get('/order', [PageController::class, 'order'])->name('site.order');

Route::post('/contact', [FormController::class, 'contact'])->name('site.contact.store');
Route::post('/request-quote', [FormController::class, 'quote'])->name('site.quote.store');
Route::post('/order', [FormController::class, 'order'])->name('site.order.store');
Route::post('/newsletter', [FormController::class, 'newsletter'])->name('site.newsletter.store');

Route::middleware(['auth'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/', [DashboardController::class, 'index'])->name('dashboard');

    Route::get('/settings', [SettingsController::class, 'edit'])->name('settings.edit');
    Route::post('/settings', [SettingsController::class, 'update'])->name('settings.update');

    Route::get('/website', [WebsiteController::class, 'index'])->name('website.index');

    Route::get('/sections', [SectionController::class, 'index'])->name('sections.index');
    Route::get('/sections/{section}/edit', [SectionController::class, 'edit'])->name('sections.edit');
    Route::put('/sections/{section}', [SectionController::class, 'update'])->name('sections.update');

    // Customer & Employee CRM
    Route::resource('customers', CustomerController::class);
    Route::post('/customers/{customer}/notes', [CustomerController::class, 'storeNote'])->name('customers.notes.store');
    Route::resource('employees', EmployeeController::class);
    Route::post('/employees/{employee}/notes', [EmployeeController::class, 'storeNote'])->name('employees.notes.store');

    Route::resource('services', ServiceController::class)->except(['show']);
    Route::resource('projects', ProjectController::class)->except(['show']);
    Route::resource('team', TeamMemberController::class)->except(['show'])->parameters(['team' => 'teamMember']);
    Route::resource('testimonials', TestimonialController::class)->except(['show']);
    Route::resource('faqs', FaqController::class)->except(['show']);
    Route::resource('why-choose-us', WhyChooseUsController::class)->except(['show'])->parameters(['why-choose-us' => 'whyChooseUs']);
    Route::resource('statistics', StatisticController::class)->except(['show']);
    Route::resource('process-steps', ProcessStepController::class)->except(['show']);

    Route::get('/orders', [OrderController::class, 'index'])->name('orders.index');
    Route::get('/orders/{order}', [OrderController::class, 'show'])->name('orders.show');
    Route::put('/orders/{order}', [OrderController::class, 'update'])->name('orders.update');

    Route::get('/leads', [QuoteRequestController::class, 'index'])->name('leads.index');
    Route::get('/leads/{quoteRequest}', [QuoteRequestController::class, 'show'])->name('leads.show');
    Route::put('/leads/{quoteRequest}', [QuoteRequestController::class, 'update'])->name('leads.update');

    Route::get('/messages', [ContactMessageController::class, 'index'])->name('messages.index');
    Route::get('/messages/{contactMessage}', [ContactMessageController::class, 'show'])->name('messages.show');
    Route::put('/messages/{contactMessage}', [ContactMessageController::class, 'update'])->name('messages.update');
});

// Keep starter auth dashboard redirect to admin
Route::middleware(['auth'])->group(function () {
    Route::get('dashboard', fn () => redirect()->route('admin.dashboard'))->name('dashboard');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
