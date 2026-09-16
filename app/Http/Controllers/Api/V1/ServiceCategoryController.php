<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\ServiceCategoryResource;
use App\Models\ServiceCategory;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\Cache;

class ServiceCategoryController extends Controller
{
    public function index(): AnonymousResourceCollection
    {
        $locale = app()->getLocale();

        $categories = Cache::remember("service-categories.{$locale}", 300, function () {
            return ServiceCategory::query()
                ->active()
                ->withCount(['services' => fn ($q) => $q->active()])
                ->orderBy('sort')
                ->get();
        });

        return ServiceCategoryResource::collection($categories);
    }
}
