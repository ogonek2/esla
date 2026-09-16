<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\FaqItemResource;
use App\Models\FaqItem;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class FaqController extends Controller
{
    public function index(Request $request): AnonymousResourceCollection
    {
        $query = FaqItem::query()->active()->orderBy('sort');

        if ($request->filled('category')) {
            $query->where('category_slug', $request->string('category'));
        }

        return FaqItemResource::collection($query->get());
    }
}
