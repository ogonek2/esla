<?php

namespace App\Filament\Resources\Services;

use App\Filament\Resources\Services\Pages\CreateService;
use App\Filament\Resources\Services\Pages\EditService;
use App\Filament\Resources\Services\Pages\ListServices;
use App\Filament\Resources\Services\RelationManagers\FaqItemsRelationManager;
use App\Filament\Resources\Services\RelationManagers\PortfolioCasesRelationManager;
use App\Models\Doctor;
use App\Models\Service;
use App\Models\ServiceCategory;
use App\Support\TranslatableTabs;
use BackedEnum;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteAction;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Resources\Resource;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Components\Tabs;
use Filament\Schemas\Components\Tabs\Tab;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\ImageColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Filters\TernaryFilter;
use Filament\Tables\Table;
use UnitEnum;

class ServiceResource extends Resource
{
    protected static ?string $model = Service::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedSparkles;

    protected static string|UnitEnum|null $navigationGroup = 'Контент';

    protected static ?int $navigationSort = 2;

    protected static ?string $navigationLabel = 'Послуги';

    protected static ?string $modelLabel = 'послугу';

    protected static ?string $pluralModelLabel = 'Послуги';

    protected static ?string $recordTitleAttribute = 'slug';

    public static function form(Schema $schema): Schema
    {
        return $schema
            ->components([
                Tabs::make('ServiceEditor')
                    ->persistTabInQueryString('tab')
                    ->tabs([
                        Tab::make('Основне')
                            ->icon(Heroicon::OutlinedCog6Tooth)
                            ->schema([
                                Section::make('Картка послуги')
                                    ->description('Базові поля, які впливають на URL, каталог і статус публікації.')
                                    ->columns(2)
                                    ->schema([
                                        Select::make('service_category_id')
                                            ->label('Категорія / напрямок')
                                            ->options(fn () => ServiceCategory::query()->orderBy('sort')->get()->mapWithKeys(
                                                fn (ServiceCategory $c) => [$c->id => $c->getTranslation('name', 'uk')]
                                            ))
                                            ->required()
                                            ->searchable()
                                            ->preload(),
                                        TextInput::make('slug')
                                            ->label('Slug (URL)')
                                            ->required()
                                            ->unique(ignoreRecord: true)
                                            ->maxLength(120)
                                            ->helperText('Використовується в /services/{slug} та для FAQ цієї послуги.'),
                                        TextInput::make('sort')
                                            ->label('Порядок у каталозі')
                                            ->numeric()
                                            ->default(0),
                                        Toggle::make('is_featured')
                                            ->label('Featured (виділена, напр. Endolift)')
                                            ->inline(false),
                                        Toggle::make('is_active')
                                            ->label('Опублікована')
                                            ->default(true)
                                            ->inline(false),
                                        FileUpload::make('cover_path')
                                            ->label('Обкладинка сторінки (hero)')
                                            ->image()
                                            ->directory('services')
                                            ->disk('public')
                                            ->imageEditor()
                                            ->helperText('Якщо порожньо — на сайті показується атмосферне фото напрямку.')
                                            ->columnSpanFull(),
                                    ]),
                                Section::make('Лікарі на сторінці')
                                    ->description('Блок «Лікарі напрямку» на канонічній сторінці послуги.')
                                    ->schema([
                                        Select::make('doctors')
                                            ->label('Лікарі')
                                            ->multiple()
                                            ->relationship('doctors', 'slug')
                                            ->getOptionLabelFromRecordUsing(
                                                fn (Doctor $record) => $record->getTranslation('name', 'uk')
                                                    .($record->getTranslation('position', 'uk')
                                                        ? ' — '.$record->getTranslation('position', 'uk')
                                                        : '')
                                            )
                                            ->preload()
                                            ->searchable()
                                            ->helperText('Порядок відображення береться з сортування лікарів.'),
                                    ]),
                            ]),

                        Tab::make('Контент')
                            ->icon(Heroicon::OutlinedDocumentText)
                            ->schema([
                                Section::make('Тексти сторінки')
                                    ->description('Короткий опис лишається простим текстом для hero. Повний опис — редактор як у Word.')
                                    ->schema([
                                        TranslatableTabs::make([
                                            'name' => ['label' => 'Назва послуги', 'required' => true],
                                            'short_description' => [
                                                'label' => 'Короткий опис (hero / картки)',
                                                'type' => 'textarea',
                                                'rows' => 3,
                                            ],
                                            'about_title' => [
                                                'label' => 'Заголовок блоку опису',
                                                'type' => 'text',
                                            ],
                                            'description' => [
                                                'label' => 'Повний опис',
                                                'type' => 'rich',
                                                'directory' => 'services/editor',
                                            ],
                                        ]),
                                    ]),
                            ]),

                        Tab::make('Медицина')
                            ->icon(Heroicon::OutlinedHeart)
                            ->schema([
                                Section::make('Показання та протипоказання')
                                    ->description('Форматований клінічний текст (списки, абзаци, посилання).')
                                    ->schema([
                                        TranslatableTabs::make([
                                            'indications' => [
                                                'label' => 'Показання',
                                                'type' => 'rich',
                                                'directory' => 'services/editor',
                                            ],
                                            'contraindications' => [
                                                'label' => 'Протипоказання',
                                                'type' => 'rich',
                                                'directory' => 'services/editor',
                                            ],
                                        ]),
                                    ]),
                            ]),

                        Tab::make('Ціна')
                            ->icon(Heroicon::OutlinedBanknotes)
                            ->schema([
                                Section::make('Вартість')
                                    ->columns(2)
                                    ->schema([
                                        TextInput::make('price_from')
                                            ->label('Ціна від (грн)')
                                            ->numeric()
                                            ->minValue(0)
                                            ->helperText('Порожнє = «за запитом / на консультації».'),
                                        TranslatableTabs::make([
                                            'price_label' => [
                                                'label' => 'Підпис до ціни (замість «від X грн»)',
                                            ],
                                        ]),
                                    ]),
                            ]),

                        Tab::make('Шлях пацієнта')
                            ->icon(Heroicon::OutlinedMap)
                            ->schema([
                                Section::make('Блок journey')
                                    ->description('Якщо кроки порожні — на сайті показуються стандартні 4 кроки з перекладів.')
                                    ->schema([
                                        TranslatableTabs::make([
                                            'journey_title' => [
                                                'label' => 'Заголовок блоку',
                                            ],
                                        ]),
                                        Repeater::make('journey_steps')
                                            ->label('Кроки')
                                            ->helperText('Рекомендовано 3–5 кроків.')
                                            ->defaultItems(0)
                                            ->collapsible()
                                            ->cloneable()
                                            ->reorderable()
                                            ->itemLabel(fn (array $state): ?string => $state['title']['uk'] ?? $state['title']['en'] ?? 'Крок')
                                            ->schema([
                                                Tabs::make('StepLocales')
                                                    ->tabs(collect(config('esla.locales', ['uk', 'en', 'ru']))->map(
                                                        fn (string $locale) => Tab::make(strtoupper($locale))
                                                            ->schema([
                                                                TextInput::make("title.{$locale}")
                                                                    ->label('Заголовок ('.$locale.')')
                                                                    ->required($locale === 'uk'),
                                                                Textarea::make("text.{$locale}")
                                                                    ->label('Текст ('.$locale.')')
                                                                    ->rows(3),
                                                            ])
                                                    )->all())
                                                    ->columnSpanFull(),
                                            ])
                                            ->columnSpanFull(),
                                    ]),
                            ]),

                        Tab::make('Довіра')
                            ->icon(Heroicon::OutlinedShieldCheck)
                            ->schema([
                                Section::make('Смуга довіри під hero')
                                    ->description('3 короткі пункти. Якщо порожньо — стандартні значення з перекладів сайту.')
                                    ->schema([
                                        Repeater::make('trust_items')
                                            ->label('Пункти')
                                            ->maxItems(4)
                                            ->defaultItems(0)
                                            ->collapsible()
                                            ->reorderable()
                                            ->itemLabel(fn (array $state): ?string => $state['label']['uk'] ?? 'Пункт')
                                            ->schema([
                                                Tabs::make('TrustLocales')
                                                    ->tabs(collect(config('esla.locales', ['uk', 'en', 'ru']))->map(
                                                        fn (string $locale) => Tab::make(strtoupper($locale))
                                                            ->schema([
                                                                TextInput::make("label.{$locale}")
                                                                    ->label('Ярлик ('.$locale.')')
                                                                    ->required($locale === 'uk'),
                                                                Textarea::make("text.{$locale}")
                                                                    ->label('Текст ('.$locale.')')
                                                                    ->rows(2)
                                                                    ->required($locale === 'uk'),
                                                            ])
                                                    )->all())
                                                    ->columnSpanFull(),
                                            ])
                                            ->columnSpanFull(),
                                    ]),
                            ]),

                        Tab::make('SEO')
                            ->icon(Heroicon::OutlinedGlobeAlt)
                            ->schema([
                                Section::make('Мета-теги')
                                    ->schema([
                                        TranslatableTabs::make([
                                            'seo_title' => ['label' => 'SEO title'],
                                            'seo_description' => [
                                                'label' => 'SEO description',
                                                'type' => 'textarea',
                                                'rows' => 3,
                                            ],
                                        ]),
                                    ]),
                            ]),
                    ])
                    ->columnSpanFull()
                    ->contained(false),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('sort')->sortable()->label('#')->width('4rem'),
                ImageColumn::make('cover_path')->disk('public')->label('')->circular(),
                TextColumn::make('name')->searchable()->label('Назва')->wrap(),
                TextColumn::make('slug')->searchable()->toggleable(isToggledHiddenByDefault: true),
                TextColumn::make('category.name')->label('Категорія')->toggleable(),
                TextColumn::make('price_from')
                    ->label('Ціна')
                    ->formatStateUsing(fn ($state) => $state !== null ? number_format((int) $state, 0, ',', ' ').' грн' : '—'),
                TextColumn::make('doctors_count')
                    ->counts('doctors')
                    ->label('Лікарі')
                    ->toggleable(),
                IconColumn::make('is_featured')->boolean()->label('Featured'),
                IconColumn::make('is_active')->boolean()->label('On'),
            ])
            ->defaultSort('sort')
            ->filters([
                SelectFilter::make('service_category_id')
                    ->label('Категорія')
                    ->relationship('category', 'slug'),
                TernaryFilter::make('is_featured')->label('Featured'),
                TernaryFilter::make('is_active')->label('Опубліковані'),
            ])
            ->recordActions([
                EditAction::make(),
                DeleteAction::make(),
            ])
            ->toolbarActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make(),
                ]),
            ]);
    }

    public static function getRelations(): array
    {
        return [
            FaqItemsRelationManager::class,
            PortfolioCasesRelationManager::class,
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => ListServices::route('/'),
            'create' => CreateService::route('/create'),
            'edit' => EditService::route('/{record}/edit'),
        ];
    }
}
