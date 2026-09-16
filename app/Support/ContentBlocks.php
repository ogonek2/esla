<?php

namespace App\Support;

use Filament\Forms\Components\Builder;
use Filament\Forms\Components\Builder\Block;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\RichEditor;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Components\Tabs;
use Filament\Schemas\Components\Tabs\Tab;
use Filament\Support\Icons\Heroicon;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ContentBlocks
{
    /**
     * Full Word-like toolbar for article text modules.
     *
     * @return list<string>
     */
    public static function richToolbar(): array
    {
        return [
            'bold', 'italic', 'underline', 'strike', 'subscript', 'superscript',
            'link',
            'h2', 'h3',
            'blockquote', 'code', 'codeBlock',
            'bulletList', 'orderedList',
            'table',
            'attachFiles',
            'horizontalRule',
            'highlight', 'small', 'lead',
            'alignStart', 'alignCenter', 'alignEnd', 'alignJustify',
            'undo', 'redo',
            'clearFormatting',
        ];
    }

    public static function richEditor(string $name = 'html', string $directory = 'posts/editor'): RichEditor
    {
        return RichEditor::make($name)
            ->label('Текст')
            ->toolbarButtons(self::richToolbar())
            ->fileAttachmentsDisk('public')
            ->fileAttachmentsDirectory($directory)
            ->fileAttachmentsVisibility('public')
            ->columnSpanFull();
    }

    /**
     * @return list<Block>
     */
    public static function blocks(): array
    {
        return [
            Block::make('heading')
                ->label('Заголовок')
                ->icon(Heroicon::OutlinedHashtag)
                ->schema([
                    Select::make('level')
                        ->label('Рівень')
                        ->options([
                            'h2' => 'H2',
                            'h3' => 'H3',
                            'h4' => 'H4',
                        ])
                        ->default('h2')
                        ->required(),
                    TextInput::make('text')
                        ->label('Текст заголовка')
                        ->required()
                        ->columnSpanFull(),
                ]),

            Block::make('text')
                ->label('Текст (як у Word)')
                ->icon(Heroicon::OutlinedDocumentText)
                ->schema([
                    self::richEditor('html')->required(),
                ]),

            Block::make('image')
                ->label('Зображення')
                ->icon(Heroicon::OutlinedPhoto)
                ->schema([
                    FileUpload::make('path')
                        ->label('Файл')
                        ->image()
                        ->directory('posts/blocks')
                        ->disk('public')
                        ->imageEditor()
                        ->required()
                        ->columnSpanFull(),
                    TextInput::make('alt')->label('Alt-текст')->maxLength(180),
                    TextInput::make('caption')->label('Підпис')->maxLength(255),
                    Select::make('width')
                        ->label('Ширина')
                        ->options([
                            'full' => 'На всю ширину',
                            'wide' => 'Широка',
                            'content' => 'По контенту',
                        ])
                        ->default('content'),
                ]),

            Block::make('gallery')
                ->label('Галерея')
                ->icon(Heroicon::OutlinedSquares2x2)
                ->schema([
                    FileUpload::make('images')
                        ->label('Зображення')
                        ->image()
                        ->multiple()
                        ->reorderable()
                        ->directory('posts/blocks')
                        ->disk('public')
                        ->required()
                        ->columnSpanFull(),
                    TextInput::make('caption')->label('Підпис до галереї')->maxLength(255),
                ]),

            Block::make('quote')
                ->label('Цитата')
                ->icon(Heroicon::OutlinedChatBubbleBottomCenterText)
                ->schema([
                    Textarea::make('text')->label('Цитата')->rows(4)->required()->columnSpanFull(),
                    TextInput::make('author')->label('Автор')->maxLength(120),
                ]),

            Block::make('list')
                ->label('Список')
                ->icon(Heroicon::OutlinedListBullet)
                ->schema([
                    Select::make('style')
                        ->label('Тип')
                        ->options([
                            'bullet' => 'Маркований',
                            'numbered' => 'Нумерований',
                        ])
                        ->default('bullet')
                        ->required(),
                    Repeater::make('items')
                        ->label('Пункти')
                        ->simple(TextInput::make('value')->required())
                        ->minItems(1)
                        ->defaultItems(2)
                        ->columnSpanFull(),
                ]),

            Block::make('callout')
                ->label('Виноска / акцент')
                ->icon(Heroicon::OutlinedInformationCircle)
                ->schema([
                    Select::make('tone')
                        ->label('Стиль')
                        ->options([
                            'gold' => 'Золота',
                            'dark' => 'Темна',
                            'soft' => 'Мʼяка',
                        ])
                        ->default('gold'),
                    TextInput::make('title')->label('Заголовок')->maxLength(160),
                    Textarea::make('text')->label('Текст')->rows(4)->required()->columnSpanFull(),
                ]),

            Block::make('cta')
                ->label('CTA-кнопка')
                ->icon(Heroicon::OutlinedCursorArrowRays)
                ->schema([
                    TextInput::make('title')->label('Заголовок')->maxLength(160),
                    Textarea::make('text')->label('Текст')->rows(3)->columnSpanFull(),
                    TextInput::make('button_label')->label('Текст кнопки')->required()->default('Записатися'),
                    TextInput::make('button_url')->label('URL кнопки')->required()->default('/booking'),
                    Toggle::make('dark')->label('Темний фон')->default(true),
                ]),

            Block::make('divider')
                ->label('Роздільник')
                ->icon(Heroicon::OutlinedMinus)
                ->schema([
                    Select::make('style')
                        ->label('Стиль')
                        ->options([
                            'line' => 'Лінія',
                            'space' => 'Відступ',
                            'gold' => 'Золота риска',
                        ])
                        ->default('line'),
                ]),

            Block::make('embed')
                ->label('Відео / embed')
                ->icon(Heroicon::OutlinedPlayCircle)
                ->schema([
                    TextInput::make('url')
                        ->label('URL (YouTube / Vimeo)')
                        ->url()
                        ->helperText('Або вставте iframe HTML нижче.'),
                    Textarea::make('html')
                        ->label('HTML embed')
                        ->rows(4)
                        ->columnSpanFull(),
                    TextInput::make('caption')->label('Підпис')->maxLength(255),
                ]),
        ];
    }

    public static function builder(string $name = 'blocks'): Builder
    {
        return Builder::make($name)
            ->label('Конструктор сторінки')
            ->blocks(self::blocks())
            ->collapsible()
            ->cloneable()
            ->blockNumbers(false)
            ->addActionLabel('Додати модуль')
            ->columnSpanFull();
    }

    /** Locale tabs with independent page builders. */
    public static function localeBuilders(string $field = 'blocks'): Tabs
    {
        $locales = config('esla.locales', ['uk', 'en', 'ru']);

        return Tabs::make('ContentLocales')
            ->tabs(collect($locales)->map(function (string $locale) use ($field) {
                return Tab::make(strtoupper($locale))
                    ->schema([
                        self::builder("{$field}.{$locale}")
                            ->helperText($locale === 'uk'
                                ? 'Збирайте статтю з модулів. Текстовий модуль — повноцінний редактор як у Word.'
                                : 'Переклад конструктора для локалі '.$locale.'.'),
                    ]);
            })->all())
            ->persistTabInQueryString('content_locale')
            ->columnSpanFull();
    }

    /**
     * Normalize Filament builder state for the public API.
     *
     * @param  mixed  $blocks
     * @return list<array{type: string, data: array<string, mixed>}>
     */
    public static function normalizeForApi(mixed $blocks, ?string $plainBodyFallback = null): array
    {
        $items = self::orderedItems($blocks);

        if ($items === [] && filled($plainBodyFallback)) {
            $html = nl2br(e($plainBodyFallback));

            return [[
                'type' => 'text',
                'data' => ['html' => '<p>'.$html.'</p>'],
            ]];
        }

        return collect($items)
            ->map(function (array $item): ?array {
                $type = $item['type'] ?? null;
                $data = is_array($item['data'] ?? null) ? $item['data'] : [];

                if (! is_string($type) || $type === '') {
                    return null;
                }

                return [
                    'type' => $type,
                    'data' => self::normalizeData($type, $data),
                ];
            })
            ->filter()
            ->values()
            ->all();
    }

    /**
     * @param  mixed  $blocks
     * @return list<array{type?: string, data?: array<string, mixed>}>
     */
    protected static function orderedItems(mixed $blocks): array
    {
        if (! is_array($blocks) || $blocks === []) {
            return [];
        }

        // Already a list of blocks
        if (array_is_list($blocks)) {
            return array_values(array_filter($blocks, 'is_array'));
        }

        // Filament UUID-keyed map
        return array_values(array_filter($blocks, 'is_array'));
    }

    /**
     * @param  array<string, mixed>  $data
     * @return array<string, mixed>
     */
    protected static function normalizeData(string $type, array $data): array
    {
        if ($type === 'image') {
            $data['url'] = self::mediaUrl($data['path'] ?? null);
            unset($data['path']);
        }

        if ($type === 'gallery') {
            $images = $data['images'] ?? [];
            $data['urls'] = collect(is_array($images) ? $images : [])
                ->map(fn ($path) => self::mediaUrl($path))
                ->filter()
                ->values()
                ->all();
            unset($data['images']);
        }

        if ($type === 'list') {
            $items = $data['items'] ?? [];
            $data['items'] = collect(is_array($items) ? $items : [])
                ->map(function ($item) {
                    if (is_string($item)) {
                        return $item;
                    }
                    if (is_array($item)) {
                        return $item['value'] ?? $item['text'] ?? null;
                    }

                    return null;
                })
                ->filter(fn ($v) => filled($v))
                ->values()
                ->all();
        }

        if ($type === 'embed') {
            $data['embed_url'] = self::embedUrl($data['url'] ?? null);
        }

        if ($type === 'text' && isset($data['html']) && is_string($data['html'])) {
            // Keep HTML; rewrite relative /storage paths if needed later
            $data['html'] = $data['html'];
        }

        return $data;
    }

    protected static function mediaUrl(mixed $path): ?string
    {
        if (! is_string($path) || $path === '') {
            return null;
        }

        if (Str::startsWith($path, ['http://', 'https://', '/'])) {
            if (Str::startsWith($path, '/storage/')) {
                return url($path);
            }

            return $path;
        }

        return Storage::disk('public')->url($path);
    }

    protected static function embedUrl(mixed $url): ?string
    {
        if (! is_string($url) || $url === '') {
            return null;
        }

        if (preg_match('~(?:youtube\.com/watch\?v=|youtu\.be/)([A-Za-z0-9_-]{6,})~', $url, $m)) {
            return 'https://www.youtube.com/embed/'.$m[1];
        }

        if (preg_match('~vimeo\.com/(\d+)~', $url, $m)) {
            return 'https://player.vimeo.com/video/'.$m[1];
        }

        return $url;
    }
}
