<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\DoctorResource;
use App\Models\Doctor;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class DoctorController extends Controller
{
    public function index(Request $request): AnonymousResourceCollection
    {
        $perPage = min((int) $request->integer('per_page', 12), 50);

        $doctors = Doctor::query()
            ->active()
            ->with(['services' => fn ($q) => $q->active()])
            ->orderBy('sort')
            ->paginate($perPage);

        return DoctorResource::collection($doctors);
    }

    public function show(string $slug): DoctorResource
    {
        $doctor = Doctor::query()
            ->active()
            ->where('slug', $slug)
            ->with([
                'services' => fn ($q) => $q->active(),
                'portfolioCases' => fn ($q) => $q->active(),
            ])
            ->firstOrFail();

        return new DoctorResource($doctor);
    }
}
