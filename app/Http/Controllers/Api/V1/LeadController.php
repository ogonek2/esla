<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\StoreLeadRequest;
use App\Http\Resources\LeadResource;
use App\Jobs\NotifyLeadCreated;
use App\Models\Doctor;
use App\Models\Lead;
use App\Models\Service;
use App\Support\PhoneNormalizer;
use Illuminate\Http\JsonResponse;

class LeadController extends Controller
{
    public function consultation(StoreLeadRequest $request): JsonResponse
    {
        return $this->store($request, Lead::TYPE_CONSULTATION);
    }

    public function booking(StoreLeadRequest $request): JsonResponse
    {
        return $this->store($request, Lead::TYPE_BOOKING);
    }

    public function feedback(StoreLeadRequest $request): JsonResponse
    {
        return $this->store($request, Lead::TYPE_FEEDBACK);
    }

    private function store(StoreLeadRequest $request, string $type): JsonResponse
    {
        $data = $request->validated();

        $serviceId = $data['service_id'] ?? null;
        if (! $serviceId && ! empty($data['service_slug'])) {
            $serviceId = Service::query()->where('slug', $data['service_slug'])->value('id');
        }

        $doctorId = $data['doctor_id'] ?? null;
        if (! $doctorId && ! empty($data['doctor_slug'])) {
            $doctorId = Doctor::query()->where('slug', $data['doctor_slug'])->value('id');
        }

        $lead = Lead::query()->create([
            'type' => $type,
            'name' => $data['name'],
            'phone' => PhoneNormalizer::toE164($data['phone']) ?? $data['phone'],
            'email' => $data['email'] ?? null,
            'service_id' => $serviceId,
            'doctor_id' => $doctorId,
            'preferred_date' => $data['preferred_date'] ?? null,
            'preferred_time' => $data['preferred_time'] ?? null,
            'messenger' => $data['messenger'] ?? null,
            'comment' => $data['comment'] ?? null,
            'consent' => true,
            'page_url' => $data['page_url'] ?? null,
            'utm_source' => $data['utm_source'] ?? null,
            'utm_medium' => $data['utm_medium'] ?? null,
            'utm_campaign' => $data['utm_campaign'] ?? null,
            'utm_term' => $data['utm_term'] ?? null,
            'utm_content' => $data['utm_content'] ?? null,
            'locale' => $data['locale'] ?? app()->getLocale(),
            'status' => Lead::STATUS_NEW,
        ]);

        NotifyLeadCreated::dispatch($lead);

        return response()->json([
            'message' => 'Заявку прийнято',
            'data' => new LeadResource($lead),
        ], 201);
    }
}
