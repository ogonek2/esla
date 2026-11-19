<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\DirectionResource;
use App\Models\Direction;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class DirectionController extends Controller
{
    public function index(): AnonymousResourceCollection
    {
        $directions = Direction::query()
            ->active()
            ->with('category')
            ->orderBy('sort')
            ->get();

        return DirectionResource::collection($directions);
    }
}
