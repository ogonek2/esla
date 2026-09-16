<?php

use App\Http\Controllers\Api\V1\ClinicController;
use App\Http\Controllers\Api\V1\DoctorController;
use App\Http\Controllers\Api\V1\FaqController;
use App\Http\Controllers\Api\V1\LeadController;
use App\Http\Controllers\Api\V1\PageController;
use App\Http\Controllers\Api\V1\PortfolioController;
use App\Http\Controllers\Api\V1\PostController;
use App\Http\Controllers\Api\V1\ReviewController;
use App\Http\Controllers\Api\V1\SearchController;
use App\Http\Controllers\Api\V1\ServiceCategoryController;
use App\Http\Controllers\Api\V1\ServiceController;
use Illuminate\Support\Facades\Route;

Route::get('/clinic', ClinicController::class)->name('clinic.show');
Route::get('/service-categories', [ServiceCategoryController::class, 'index'])->name('service-categories.index');
Route::get('/services', [ServiceController::class, 'index'])->name('services.index');
Route::get('/services/{slug}', [ServiceController::class, 'show'])->name('services.show');
Route::get('/doctors', [DoctorController::class, 'index'])->name('doctors.index');
Route::get('/doctors/{slug}', [DoctorController::class, 'show'])->name('doctors.show');
Route::get('/portfolio', [PortfolioController::class, 'index'])->name('portfolio.index');
Route::get('/portfolio/{slug}', [PortfolioController::class, 'show'])->name('portfolio.show');
Route::get('/reviews', [ReviewController::class, 'index'])->name('reviews.index');
Route::get('/faq', [FaqController::class, 'index'])->name('faq.index');
Route::get('/posts', [PostController::class, 'index'])->name('posts.index');
Route::get('/posts/{slug}', [PostController::class, 'show'])->name('posts.show');
Route::get('/pages/{slug}', [PageController::class, 'show'])->name('pages.show');
Route::get('/search', SearchController::class)->name('search');

Route::prefix('leads')->middleware('throttle:5,1')->group(function () {
    Route::post('/consultation', [LeadController::class, 'consultation'])->name('leads.consultation');
    Route::post('/booking', [LeadController::class, 'booking'])->name('leads.booking');
    Route::post('/feedback', [LeadController::class, 'feedback'])->name('leads.feedback');
});
