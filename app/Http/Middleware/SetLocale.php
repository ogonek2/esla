<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class SetLocale
{
    public const LOCALES = ['uk', 'en', 'ru'];

    public const DEFAULT = 'uk';

    public function handle(Request $request, Closure $next): Response
    {
        $locale = $request->query('locale')
            ?? $request->header('Accept-Language');

        if (is_string($locale)) {
            $locale = strtolower(substr(trim(explode(',', $locale)[0]), 0, 2));
        }

        if (! in_array($locale, self::LOCALES, true)) {
            $locale = self::DEFAULT;
        }

        app()->setLocale($locale);

        return $next($request);
    }
}
