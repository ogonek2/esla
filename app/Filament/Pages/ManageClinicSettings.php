<?php

namespace App\Filament\Pages;

use App\Models\ClinicSetting;
use App\Support\SocialNetworks;
use BackedEnum;
use Filament\Actions\Action;
use Filament\Forms\Components\KeyValue;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Notifications\Notification;
use Filament\Pages\Page;
use Filament\Schemas\Components\Actions;
use Filament\Schemas\Components\EmbeddedSchema;
use Filament\Schemas\Components\Form;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use UnitEnum;

/**
 * @property-read Schema $form
 */
class ManageClinicSettings extends Page
{
    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedCog6Tooth;

    protected static string|UnitEnum|null $navigationGroup = 'Налаштування';

    protected static ?string $navigationLabel = 'Клініка';

    protected static ?string $title = 'Налаштування клініки';

    protected static ?int $navigationSort = 1;

    /**
     * @var array<string, mixed>|null
     */
    public ?array $data = [];

    public function mount(): void
    {
        $settings = ClinicSetting::current();
        $payload = $settings->attributesToArray();
        $payload['social'] = SocialNetworks::normalize($settings->social);

        $this->form->fill($payload);
    }

    public function form(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Контакти')->schema([
                    TextInput::make('email')->email(),
                    KeyValue::make('phones')
                        ->label('Телефони')
                        ->keyLabel('Мітка')
                        ->valueLabel('Номер')
                        ->reorderable(),
                    KeyValue::make('messengers')
                        ->label('Месенджери')
                        ->keyLabel('Канал')
                        ->valueLabel('Посилання / номер'),
                ]),
                Section::make('Соціальні мережі')
                    ->description('Додайте мережі айтемами. Іконки — Font Awesome 6 (brands / solid).')
                    ->schema([
                        Repeater::make('social')
                            ->label('Мережі')
                            ->defaultItems(0)
                            ->collapsible()
                            ->cloneable()
                            ->reorderable()
                            ->itemLabel(fn (array $state): ?string => $state['label'] ?? 'Соцмережа')
                            ->schema([
                                TextInput::make('label')
                                    ->label('Назва')
                                    ->required()
                                    ->placeholder('Instagram'),
                                TextInput::make('url')
                                    ->label('URL / посилання')
                                    ->required()
                                    ->placeholder('https://instagram.com/esla'),
                                Select::make('icon')
                                    ->label('Іконка Font Awesome')
                                    ->options(SocialNetworks::iconOptions())
                                    ->searchable()
                                    ->required()
                                    ->default('fa-brands fa-instagram')
                                    ->helperText('Клас FA, напр. fa-brands fa-instagram'),
                                TextInput::make('icon_custom')
                                    ->label('Кастомний клас FA (опційно)')
                                    ->placeholder('fa-brands fa-discord')
                                    ->helperText('Якщо заповнено — перекриває вибір вище при збереженні'),
                            ])
                            ->columns(2)
                            ->columnSpanFull(),
                    ]),
                Section::make('Адреса та графік')->schema([
                    KeyValue::make('address')
                        ->label('Адреса (uk/en/ru)')
                        ->keyLabel('locale')
                        ->valueLabel('Адреса'),
                    KeyValue::make('schedule')
                        ->label('Графік (uk/en/ru)')
                        ->keyLabel('locale')
                        ->valueLabel('Графік'),
                    TextInput::make('map_embed_url')->label('Google Maps embed URL')->columnSpanFull(),
                    TextInput::make('map_lat')->label('Lat'),
                    TextInput::make('map_lng')->label('Lng'),
                ])->columns(2),
                Section::make('Аналітика')->schema([
                    TextInput::make('ga4_id')->label('GA4'),
                    TextInput::make('gtm_id')->label('GTM'),
                    TextInput::make('meta_pixel_id')->label('Meta Pixel'),
                    TextInput::make('tiktok_pixel_id')->label('TikTok Pixel'),
                ])->columns(2),
            ])
            ->statePath('data');
    }

    public function content(Schema $schema): Schema
    {
        return $schema
            ->components([
                Form::make([
                    EmbeddedSchema::make('form'),
                ])
                    ->id('form')
                    ->livewireSubmitHandler('save')
                    ->footer([
                        Actions::make([
                            Action::make('save')
                                ->label('Зберегти')
                                ->submit('save'),
                        ]),
                    ]),
            ]);
    }

    public function save(): void
    {
        $data = $this->form->getState();

        $social = [];
        foreach ($data['social'] ?? [] as $row) {
            if (! is_array($row)) {
                continue;
            }
            $custom = trim((string) ($row['icon_custom'] ?? ''));
            $icon = $custom !== '' ? $custom : trim((string) ($row['icon'] ?? ''));
            $url = trim((string) ($row['url'] ?? ''));
            $label = trim((string) ($row['label'] ?? ''));
            if ($url === '' || $label === '') {
                continue;
            }
            $social[] = [
                'label' => $label,
                'url' => $url,
                'icon' => $icon !== '' ? $icon : SocialNetworks::guessIcon($label),
            ];
        }
        $data['social'] = $social;

        $settings = ClinicSetting::current();
        $settings->fill($data);
        $settings->save();

        foreach (config('esla.locales', ['uk', 'en', 'ru']) as $locale) {
            \Illuminate\Support\Facades\Cache::forget("clinic.{$locale}");
        }

        Notification::make()
            ->title('Збережено')
            ->success()
            ->send();
    }
}
