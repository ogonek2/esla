<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\ClinicSettingResource;
use App\Models\ClinicSetting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class ClinicController extends Controller
{
    public function __invoke(Request $request): ClinicSettingResource
    {
        $locale = app()->getLocale();

        $settings = Cache::remember("clinic.{$locale}", 300, fn () => ClinicSetting::current());

        return new ClinicSettingResource($settings);
    }
}
