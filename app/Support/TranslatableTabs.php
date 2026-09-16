<?php

namespace App\Support;

use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Components\Tabs;
use Filament\Schemas\Components\Tabs\Tab;

class TranslatableTabs
{
    /**
     * @param  array<string, array{label: string, type?: string, rows?: int, required?: bool, directory?: string}>  $fields
     */
    public static function make(array $fields): Tabs
    {
        $locales = config('esla.locales', ['uk', 'en', 'ru']);

        return Tabs::make('Translations')
            ->tabs(collect($locales)->map(function (string $locale) use ($fields) {
                return Tab::make(strtoupper($locale))
                    ->schema(collect($fields)->map(function (array $config, string $name) use ($locale) {
                        $type = $config['type'] ?? 'text';
                        $required = ($config['required'] ?? false) && $locale === 'uk';
                        $label = ($config['label'] ?? $name).' ('.$locale.')';

                        if ($type === 'rich') {
                            return ContentBlocks::richEditor("{$name}.{$locale}", $config['directory'] ?? 'editor')
                                ->label($label)
                                ->required($required)
                                ->columnSpanFull();
                        }

                        if ($type === 'textarea') {
                            return Textarea::make("{$name}.{$locale}")
                                ->label($label)
                                ->rows($config['rows'] ?? 4)
                                ->required($required)
                                ->columnSpanFull();
                        }

                        return TextInput::make("{$name}.{$locale}")
                            ->label($label)
                            ->required($required)
                            ->columnSpanFull();
                    })->values()->all());
            })->all())
            ->columnSpanFull();
    }
}
