<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\PortfolioCaseResource;
use App\Models\PortfolioCase;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class PortfolioController extends Controller
{
    public function index(Request $request): AnonymousResourceCollection
    {
        $query = PortfolioCase::query()
            ->active()
            ->with(['service', 'doctor'])
            ->orderBy('sort');

        if ($request->filled('service')) {
            $query->whereHas('service', fn ($q) => $q->where('slug', $request->string('service')));
        }

        if ($request->filled('doctor')) {
            $query->whereHas('doctor', fn ($q) => $q->where('slug', $request->string('doctor')));
        }

        $perPage = min((int) $request->integer('per_page', 12), 50);

        return PortfolioCaseResource::collection($query->paginate($perPage));
    }

    public function show(string $slug): PortfolioCaseResource
    {
        $case = PortfolioCase::query()
            ->active()
            ->where('slug', $slug)
            ->with(['service', 'doctor'])
            ->firstOrFail();

        return new PortfolioCaseResource($case);
    }
}
