<?php

namespace App\Http\Requests\Api\V1;

use App\Support\PhoneNormalizer;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Validator;

class StoreLeadRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:120'],
            'phone' => ['required', 'string', 'max:32'],
            'email' => ['nullable', 'email', 'max:255'],
            'service_id' => ['nullable', 'integer', 'exists:services,id'],
            'service_slug' => ['nullable', 'string', 'exists:services,slug'],
            'doctor_id' => ['nullable', 'integer', 'exists:doctors,id'],
            'doctor_slug' => ['nullable', 'string', 'exists:doctors,slug'],
            'preferred_date' => ['nullable', 'date', 'after_or_equal:today'],
            'preferred_time' => ['nullable', 'string', 'max:32'],
            'messenger' => ['nullable', 'string', 'in:telegram,whatsapp,viber'],
            'comment' => ['nullable', 'string', 'max:2000'],
            'consent' => ['accepted'],
            'page_url' => ['nullable', 'string', 'max:500'],
            'utm_source' => ['nullable', 'string', 'max:120'],
            'utm_medium' => ['nullable', 'string', 'max:120'],
            'utm_campaign' => ['nullable', 'string', 'max:120'],
            'utm_term' => ['nullable', 'string', 'max:120'],
            'utm_content' => ['nullable', 'string', 'max:120'],
            'locale' => ['nullable', 'string', 'in:uk,en,ru'],
            'website' => ['nullable', 'string', 'max:0'],
        ];
    }

    protected function prepareForValidation(): void
    {
        $normalized = PhoneNormalizer::toE164($this->input('phone'));

        $this->merge([
            'phone' => $normalized ?? $this->input('phone'),
        ]);
    }

    public function withValidator(Validator $validator): void
    {
        $validator->after(function (Validator $validator) {
            if (filled($this->input('website'))) {
                $validator->errors()->add('website', 'Spam detected.');
            }

            if (PhoneNormalizer::toE164((string) $this->input('phone')) === null) {
                $validator->errors()->add('phone', 'Невірний формат телефону');
            }
        });
    }

    public function messages(): array
    {
        return [
            'consent.accepted' => 'Потрібна згода на обробку персональних даних',
            'phone.required' => 'Вкажіть телефон',
            'name.required' => 'Вкажіть імʼя',
            'website.max' => 'Spam detected.',
        ];
    }
}
