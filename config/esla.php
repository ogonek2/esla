<?php

return [
    'locales' => ['uk', 'en', 'ru'],
    'default_locale' => 'uk',
    'frontend_url' => env('FRONTEND_URL', 'http://localhost:3000'),
    'cors_origins' => array_filter(array_map(
        'trim',
        explode(',', (string) env('CORS_ORIGINS', env('FRONTEND_URL', 'http://localhost:3000')))
    )),
];
