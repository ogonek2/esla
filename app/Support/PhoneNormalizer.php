<?php

namespace App\Support;

class PhoneNormalizer
{
    /**
     * Normalize Ukrainian/international phone to E.164 (+380...).
     */
    public static function toE164(?string $phone): ?string
    {
        if ($phone === null || trim($phone) === '') {
            return null;
        }

        $digits = preg_replace('/\D+/', '', $phone) ?? '';

        if (str_starts_with($digits, '380') && strlen($digits) === 12) {
            return '+'.$digits;
        }

        if (str_starts_with($digits, '0') && strlen($digits) === 10) {
            return '+38'.$digits;
        }

        if (strlen($digits) === 9) {
            return '+380'.$digits;
        }

        if (str_starts_with($phone, '+') && strlen($digits) >= 10 && strlen($digits) <= 15) {
            return '+'.$digits;
        }

        return null;
    }
}
