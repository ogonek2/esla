<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\DoctorResource;
use App\Http\Resources\FaqItemResource;
use App\Http\Resources\PostResource;
use App\Http\Resources\ServiceResource;
use App\Models\Doctor;
use App\Models\FaqItem;
use App\Models\Post;
use App\Models\Service;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SearchController extends Controller
{
    public function __invoke(Request $request): JsonResponse
    {
        $q = trim((string) $request->query('q', ''));

        if (mb_strlen($q) < 2) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => ['q' => ['Мінімум 2 символи']],
            ], 422);
        }

        $locale = app()->getLocale();
        $like = '%'.$q.'%';

        $services = Service::query()
            ->active()
            ->where(function ($query) use ($like, $locale) {
                $query->where("name->{$locale}", 'like', $like)
                    ->orWhere('slug', 'like', $like)
                    ->orWhere("short_description->{$locale}", 'like', $like);
            })
            ->orderBy('sort')
            ->limit(10)
            ->get();

        $doctors = Doctor::query()
            ->active()
            ->where(function ($query) use ($like, $locale) {
                $query->where("name->{$locale}", 'like', $like)
                    ->orWhere('slug', 'like', $like)
                    ->orWhere("position->{$locale}", 'like', $like);
            })
            ->orderBy('sort')
            ->limit(10)
            ->get();

        $posts = Post::query()
            ->published()
            ->where(function ($query) use ($like, $locale) {
                $query->where("title->{$locale}", 'like', $like)
                    ->orWhere('slug', 'like', $like)
                    ->orWhere("excerpt->{$locale}", 'like', $like);
            })
            ->orderByDesc('published_at')
            ->limit(10)
            ->get();

        $faq = FaqItem::query()
            ->active()
            ->where(function ($query) use ($like, $locale) {
                $query->where("question->{$locale}", 'like', $like)
                    ->orWhere("answer->{$locale}", 'like', $like);
            })
            ->orderBy('sort')
            ->limit(10)
            ->get();

        return response()->json([
            'data' => [
                'services' => ServiceResource::collection($services),
                'doctors' => DoctorResource::collection($doctors),
                'posts' => PostResource::collection($posts),
                'faq' => FaqItemResource::collection($faq),
            ],
            'meta' => [
                'q' => $q,
                'locale' => $locale,
            ],
        ]);
    }
}
