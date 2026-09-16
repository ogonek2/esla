<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\ServiceResource;
use App\Models\FaqItem;
use App\Models\Service;
use App\Http\Resources\FaqItemResource;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class ServiceController extends Controller
{
    public function index(Request $request): AnonymousResourceCollection
    {
        $query = Service::query()
            ->active()
            ->with('category')
            ->orderBy('sort');

        if ($request->filled('category')) {
            $query->whereHas('category', fn ($q) => $q->where('slug', $request->string('category')));
        }

        if ($request->boolean('featured')) {
            $query->featured();
        }

        $perPage = min((int) $request->integer('per_page', 12), 50);

        return ServiceResource::collection($query->paginate($perPage));
    }

    public function show(string $slug): array
    {
        $service = Service::query()
            ->active()
            ->where('slug', $slug)
            ->with(['category', 'doctors' => fn ($q) => $q->active(), 'portfolioCases' => fn ($q) => $q->active()])
            ->firstOrFail();

        $faq = FaqItem::query()
            ->active()
            ->where(function ($q) use ($service) {
                $q->where('category_slug', $service->slug)
                    ->orWhere('category_slug', $service->category?->slug)
                    ->orWhere('category_slug', 'general');
            })
            ->orderBy('sort')
            ->limit(20)
            ->get();

        return [
            'data' => new ServiceResource($service),
            'faq' => FaqItemResource::collection($faq),
        ];
    }
}
