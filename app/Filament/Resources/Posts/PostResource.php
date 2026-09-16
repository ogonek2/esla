<?php

namespace App\Filament\Resources\Posts;

use App\Filament\Resources\Posts\Pages\CreatePost;
use App\Filament\Resources\Posts\Pages\EditPost;
use App\Filament\Resources\Posts\Pages\ListPosts;
use App\Models\Post;
use App\Support\ContentBlocks;
use App\Support\TranslatableTabs;
use BackedEnum;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteAction;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\FileUpload;
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
use Filament\Tables\Filters\TernaryFilter;
use Filament\Tables\Table;
use UnitEnum;

class PostResource extends Resource
{
    protected static ?string $model = Post::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedNewspaper;

    protected static string|UnitEnum|null $navigationGroup = 'Контент';

    protected static ?int $navigationSort = 7;

    protected static ?string $navigationLabel = 'Блог';

    protected static ?string $modelLabel = 'статтю';

    protected static ?string $pluralModelLabel = 'Блог';

    protected static ?string $recordTitleAttribute = 'slug';

    public static function form(Schema $schema): Schema
    {
        return $schema
            ->components([
                Tabs::make('PostEditor')
                    ->persistTabInQueryString('tab')
                    ->tabs([
                        Tab::make('Основне')
                            ->icon(Heroicon::OutlinedCog6Tooth)
                            ->schema([
                                Section::make('Публікація')
                                    ->columns(2)
                                    ->schema([
                                        TextInput::make('slug')
                                            ->label('Slug (URL)')
                                            ->required()
                                            ->unique(ignoreRecord: true)
                                            ->maxLength(120)
                                            ->helperText('Використовується в /blog/{slug}'),
                                        DateTimePicker::make('published_at')
                                            ->label('Дата публікації')
                                            ->seconds(false),
                                        Toggle::make('is_published')
                                            ->label('Опубліковано')
                                            ->inline(false),
                                        FileUpload::make('cover_path')
                                            ->label('Обкладинка')
                                            ->image()
                                            ->directory('posts')
                                            ->disk('public')
                                            ->imageEditor()
                                            ->columnSpanFull(),
                                    ]),
                                Section::make('Заголовок і лід')
                                    ->schema([
                                        TranslatableTabs::make([
                                            'title' => ['label' => 'Заголовок', 'required' => true],
                                            'excerpt' => [
                                                'label' => 'Короткий опис (лід)',
                                                'type' => 'textarea',
                                                'rows' => 3,
                                            ],
                                        ]),
                                    ]),
                            ]),

                        Tab::make('Конструктор')
                            ->icon(Heroicon::OutlinedSquaresPlus)
                            ->schema([
                                Section::make('Модулі сторінки статті')
                                    ->description('Збирайте статтю блоками. Модуль «Текст» — повноцінний редактор з форматуванням (як Word): заголовки, списки, таблиці, посилання, вирівнювання, зображення в тексті.')
                                    ->schema([
                                        ContentBlocks::localeBuilders('blocks'),
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
                ImageColumn::make('cover_path')->disk('public')->label('')->circular(),
                TextColumn::make('title')->searchable()->label('Заголовок')->limit(50)->wrap(),
                TextColumn::make('slug')->searchable()->toggleable(isToggledHiddenByDefault: true),
                TextColumn::make('published_at')->dateTime('d.m.Y H:i')->sortable()->label('Дата'),
                IconColumn::make('is_published')->boolean()->label('On'),
            ])
            ->defaultSort('published_at', 'desc')
            ->filters([
                TernaryFilter::make('is_published')->label('Опубліковані'),
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

    public static function getPages(): array
    {
        return [
            'index' => ListPosts::route('/'),
            'create' => CreatePost::route('/create'),
            'edit' => EditPost::route('/{record}/edit'),
        ];
    }
}
