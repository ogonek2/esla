<?php

use App\Models\Service;
use App\Models\ServiceCategory;
use Database\Seeders\DatabaseSeeder;
use Illuminate\Support\Facades\Queue;
use App\Jobs\NotifyLeadCreated;

beforeEach(function () {
    $this->seed(DatabaseSeeder::class);
});

it('returns clinic settings', function () {
    $this->getJson('/api/v1/clinic?locale=uk')
        ->assertOk()
        ->assertJsonPath('data.locale', 'uk')
        ->assertJsonStructure(['data' => ['phones', 'messengers', 'address', 'schedule', 'analytics']]);
});

it('lists service categories and services', function () {
    $this->getJson('/api/v1/service-categories')
        ->assertOk()
        ->assertJsonStructure(['data' => [['slug', 'name']]]);

    $this->getJson('/api/v1/services?featured=1')
        ->assertOk()
        ->assertJsonStructure(['data', 'meta', 'links']);
});

it('shows a service by slug', function () {
    $service = Service::query()->where('slug', 'endolift-face')->firstOrFail();

    $this->getJson('/api/v1/services/'.$service->slug)
        ->assertOk()
        ->assertJsonPath('data.slug', 'endolift-face');
});

it('searches content', function () {
    $this->getJson('/api/v1/search?q=ендо')
        ->assertOk()
        ->assertJsonStructure(['data' => ['services', 'doctors', 'posts', 'faq']]);
});

it('creates a consultation lead', function () {
    Queue::fake();

    $category = ServiceCategory::query()->first();
    $service = Service::query()->where('service_category_id', $category->id)->first();

    $this->postJson('/api/v1/leads/consultation', [
        'name' => 'Тест Користувач',
        'phone' => '+380991112233',
        'consent' => true,
        'service_id' => $service->id,
        'page_url' => 'https://esla.ua/',
        'locale' => 'uk',
        'website' => '',
    ])
        ->assertCreated()
        ->assertJsonPath('data.type', 'consultation');

    Queue::assertPushed(NotifyLeadCreated::class);

    $this->assertDatabaseHas('leads', [
        'phone' => '+380991112233',
        'type' => 'consultation',
    ]);
});

it('rejects lead spam honeypot', function () {
    $this->postJson('/api/v1/leads/feedback', [
        'name' => 'Bot',
        'phone' => '+380991112233',
        'consent' => true,
        'website' => 'http://spam.test',
    ])->assertStatus(422);
});

it('returns a static page', function () {
    $this->getJson('/api/v1/pages/about')
        ->assertOk()
        ->assertJsonPath('data.slug', 'about');
});
