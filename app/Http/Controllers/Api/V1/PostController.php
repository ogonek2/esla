<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\PostResource;
use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class PostController extends Controller
{
    public function index(Request $request): AnonymousResourceCollection
    {
        $perPage = min((int) $request->integer('per_page', 12), 50);

        $posts = Post::query()
            ->published()
            ->orderByDesc('published_at')
            ->paginate($perPage);

        return PostResource::collection($posts);
    }

    public function show(string $slug): PostResource
    {
        $post = Post::query()
            ->published()
            ->where('slug', $slug)
            ->firstOrFail();

        return new PostResource($post);
    }
}
