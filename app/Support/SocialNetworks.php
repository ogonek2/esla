<?php

namespace App\Support;

final class SocialNetworks
{
    /**
     * Preset Font Awesome 6 brand icons for the admin select.
     *
     * @return array<string, string>
     */
    public static function iconOptions(): array
    {
        return [
            'fa-brands fa-instagram' => 'Instagram',
            'fa-brands fa-facebook-f' => 'Facebook',
            'fa-brands fa-telegram' => 'Telegram',
            'fa-brands fa-whatsapp' => 'WhatsApp',
            'fa-brands fa-viber' => 'Viber',
            'fa-brands fa-youtube' => 'YouTube',
            'fa-brands fa-tiktok' => 'TikTok',
            'fa-brands fa-x-twitter' => 'X (Twitter)',
            'fa-brands fa-linkedin-in' => 'LinkedIn',
            'fa-brands fa-threads' => 'Threads',
            'fa-brands fa-pinterest-p' => 'Pinterest',
            'fa-brands fa-google' => 'Google',
            'fa-solid fa-globe' => 'Website / Other',
            'fa-solid fa-envelope' => 'Email',
            'fa-solid fa-phone' => 'Phone',
        ];
    }

    public static function guessIcon(string $label): string
    {
        $key = mb_strtolower(trim($label));

        return match (true) {
            str_contains($key, 'instagram') => 'fa-brands fa-instagram',
            str_contains($key, 'facebook'), str_contains($key, 'fb') => 'fa-brands fa-facebook-f',
            str_contains($key, 'telegram'), str_contains($key, 'tg') => 'fa-brands fa-telegram',
            str_contains($key, 'whatsapp'), str_contains($key, 'wa') => 'fa-brands fa-whatsapp',
            str_contains($key, 'viber') => 'fa-brands fa-viber',
            str_contains($key, 'youtube'), str_contains($key, 'yt') => 'fa-brands fa-youtube',
            str_contains($key, 'tiktok') => 'fa-brands fa-tiktok',
            str_contains($key, 'twitter'), $key === 'x' => 'fa-brands fa-x-twitter',
            str_contains($key, 'linkedin') => 'fa-brands fa-linkedin-in',
            str_contains($key, 'threads') => 'fa-brands fa-threads',
            str_contains($key, 'pinterest') => 'fa-brands fa-pinterest-p',
            str_contains($key, 'mail'), str_contains($key, 'email') => 'fa-solid fa-envelope',
            str_contains($key, 'phone'), str_contains($key, 'tel') => 'fa-solid fa-phone',
            default => 'fa-solid fa-globe',
        };
    }

    /**
     * Normalize legacy KeyValue {name: url} and new item list into a unified shape.
     *
     * @param  mixed  $social
     * @return list<array{label: string, url: string, icon: string}>
     */
    public static function normalize(mixed $social): array
    {
        if (! is_array($social) || $social === []) {
            return [];
        }

        $items = [];

        // New format: list of {label,url,icon}
        if (array_is_list($social)) {
            foreach ($social as $row) {
                if (! is_array($row)) {
                    continue;
                }
                $url = trim((string) ($row['url'] ?? ''));
                if ($url === '') {
                    continue;
                }
                $label = trim((string) ($row['label'] ?? $row['name'] ?? 'Social'));
                $icon = trim((string) ($row['icon'] ?? ''));
                if ($icon === '') {
                    $icon = self::guessIcon($label);
                }
                $items[] = [
                    'label' => $label !== '' ? $label : 'Social',
                    'url' => $url,
                    'icon' => $icon,
                ];
            }

            return $items;
        }

        // Legacy KeyValue: network => url
        foreach ($social as $label => $url) {
            if (is_array($url)) {
                $nestedUrl = trim((string) ($url['url'] ?? ''));
                if ($nestedUrl === '') {
                    continue;
                }
                $nestedLabel = trim((string) ($url['label'] ?? $label));
                $items[] = [
                    'label' => $nestedLabel !== '' ? $nestedLabel : (string) $label,
                    'url' => $nestedUrl,
                    'icon' => trim((string) ($url['icon'] ?? self::guessIcon((string) $label))),
                ];
                continue;
            }

            $url = trim((string) $url);
            if ($url === '') {
                continue;
            }
            $items[] = [
                'label' => (string) $label,
                'url' => $url,
                'icon' => self::guessIcon((string) $label),
            ];
        }

        return $items;
    }
}
