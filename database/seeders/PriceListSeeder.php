<?php

namespace Database\Seeders;

use App\Models\Page;
use App\Models\Service;
use App\Models\ServiceCategory;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Cache;

/**
 * Syncs services/prices from database/seeders/data/price_list.json
 * and updates the About page from the clinic copy brief.
 */
class PriceListSeeder extends Seeder
{
    public function run(): void
    {
        $path = database_path('seeders/data/price_list.json');
        if (! is_file($path)) {
            $this->command?->error("Missing {$path}. Run build_price_list.py first.");

            return;
        }

        /** @var list<array<string, mixed>> $catalog */
        $catalog = json_decode((string) file_get_contents($path), true, 512, JSON_THROW_ON_ERROR);

        $keepCategorySlugs = [];
        $keepServiceSlugs = [];

        foreach ($catalog as $index => $categoryData) {
            $category = ServiceCategory::query()->updateOrCreate(
                ['slug' => $categoryData['slug']],
                [
                    'name' => $categoryData['name'],
                    'description' => $categoryData['description'] ?? null,
                    'sort' => $index + 1,
                    'is_active' => true,
                ]
            );
            $keepCategorySlugs[] = $category->slug;

            foreach ($categoryData['services'] as $sIndex => $serviceData) {
                $ukName = (string) $serviceData['name'];
                $priceLabel = isset($serviceData['price_label'])
                    ? $this->t3((string) $serviceData['price_label'])
                    : null;

                Service::query()->updateOrCreate(
                    ['slug' => $serviceData['slug']],
                    [
                        'service_category_id' => $category->id,
                        'name' => $this->t3($ukName),
                        'short_description' => null,
                        'price_from' => $serviceData['price'] ?? null,
                        'price_label' => $priceLabel,
                        'is_featured' => (bool) ($serviceData['featured'] ?? ($categoryData['featured'] ?? false)),
                        'sort' => $sIndex + 1,
                        'is_active' => true,
                    ]
                );
                $keepServiceSlugs[] = $serviceData['slug'];
            }
        }

        // Keep lab checkup category as informational (no sheet in the price file).
        $checkup = ServiceCategory::query()->updateOrCreate(
            ['slug' => 'checkup'],
            [
                'name' => $this->t3('Лабораторна діагностика', 'Lab diagnostics', 'Лабораторная диагностика'),
                'description' => $this->t3(
                    'Профільні пакети аналізів та лабораторна діагностика',
                    'Profile lab packages and diagnostics',
                    'Профильные пакеты анализов и лабораторная диагностика'
                ),
                'sort' => count($catalog) + 1,
                'is_active' => true,
            ]
        );
        $keepCategorySlugs[] = 'checkup';
        Service::query()->updateOrCreate(
            ['slug' => 'lab-checkup-packages'],
            [
                'service_category_id' => $checkup->id,
                'name' => $this->t3('Профільні пакети аналізів', 'Profile lab packages', 'Профильные пакеты анализов'),
                'short_description' => $this->t3(
                    'Підбираються індивідуально після консультації',
                    'Selected individually after consultation',
                    'Подбираются индивидуально после консультации'
                ),
                'price_from' => null,
                'price_label' => $this->t3('за запитом', 'on request', 'по запросу'),
                'is_featured' => false,
                'sort' => 1,
                'is_active' => true,
            ]
        );
        $keepServiceSlugs[] = 'lab-checkup-packages';

        ServiceCategory::query()
            ->whereNotIn('slug', $keepCategorySlugs)
            ->update(['is_active' => false]);

        Service::query()
            ->whereNotIn('slug', $keepServiceSlugs)
            ->update(['is_active' => false]);

        $this->seedAboutPage();
        $this->clearCaches();

        $this->command?->info(
            'Price list synced: '.count($keepServiceSlugs).' active services, '.count($keepCategorySlugs).' categories.'
        );
    }

    private function seedAboutPage(): void
    {
        $license = 'https://moz.gov.ua/storage/uploads/eb05a9bd-5c35-4614-8cbf-be4109034a1f/dn_1532_09102026_dod.pdf';

        $uk = <<<TXT
ЕСЛА — простір, де медицина зустрічається із естетикою.

Клініка «Есла» — це більше, ніж місце, де змінюють зовнішність. Це простір, у якому здоровʼя, функція та естетика обʼєднані в єдину філософію гармонії людини.

Привіт, мене звати Марʼяна Бандурка-Кіншин, я лікар-отоларинголог та пластичний хірург із досвідом у медицині понад 15 років, а також медичний директор та співавтор клініки ЕСЛА.

Я переконана, що справжня краса неможлива без здоровʼя, а естетичне вдосконалення має починатися з глибокого розуміння анатомії, фізіології та індивідуальних особливостей кожної людини.

Саме тому в «Есла» поєднано пластичну хірургію, естетичну медицину та сучасні технології, створивши комплексний підхід до турботи про зовнішність.

Для мене важливо не просто досягти бажаного візуального результату. Важливо зберегти природність, функціональність, здоровʼя та індивідуальність.

Ми працюємо не заради змін заради змін. Ми працюємо заради результату, який підкреслює особистість, додає впевненості та позитивно впливає на якість життя.

Наша філософія проста: краса не повинна суперечити здоровʼю, естетика не повинна порушувати функцію, а медицина має залишатися основою кожного рішення.

Есла — місце, де важливо не лише те, як ви виглядаєте, а й те, як ви почуваєтеся.

Краса, за якою стоїть медицина. Естетика, що зберігає функцію. Здоровʼя, яке відчувається. Краса, яка має сенс.

Напрямки клініки: масаж і реабілітація, обгортання, базова та інʼєкційна косметологія, апаратна косметологія, ендоліфт, ЛОР, пластична хірургія, дерматологія та дерматохірургія, трихологія, лабораторна діагностика, домашній догляд.

Ліцензія МОЗ: {$license}
TXT;

        $en = <<<TXT
ESLA is a space where medicine meets aesthetics.

Esla clinic is more than a place that changes appearance. It is a space where health, function and aesthetics are united in one philosophy of human harmony.

Hello, my name is Maryana Bandurka-Kinshyn. I am an otolaryngologist and plastic surgeon with over 15 years of medical experience, and the medical director and co-author of ESLA clinic.

I believe true beauty is impossible without health, and aesthetic refinement should begin with a deep understanding of anatomy, physiology and each person’s individuality.

That is why Esla combines plastic surgery, aesthetic medicine and modern technologies into a comprehensive approach to caring for appearance.

For me it is important not only to achieve the desired visual result, but to preserve naturalness, function, health and individuality.

We do not change for the sake of change. We work for a result that highlights personality, builds confidence and positively affects quality of life.

Our philosophy is simple: beauty should not contradict health, aesthetics should not break function, and medicine must remain the basis of every decision.

Esla is a place where it matters not only how you look, but how you feel.

Beauty backed by medicine. Aesthetics that preserve function. Health you can feel. Beauty that makes sense.

Clinic directions: massage and rehabilitation, wraps, basic and injectable cosmetology, hardware cosmetology, Endolift, ENT, plastic surgery, dermatology and dermatosurgery, trichology, lab diagnostics, home care.

MOH license: {$license}
TXT;

        $ru = <<<TXT
ЕСЛА — пространство, где медицина встречается с эстетикой.

Клиника «Эсла» — это больше, чем место, где меняют внешность. Это пространство, в котором здоровье, функция и эстетика объединены в единую философию гармонии человека.

Здравствуйте, меня зовут Марьяна Бандурка-Киншин, я врач-отоларинголог и пластический хирург с опытом в медицине более 15 лет, а также медицинский директор и соавтор клиники ЕСЛА.

Я убеждена, что настоящая красота невозможна без здоровья, а эстетическое совершенствование должно начинаться с глубокого понимания анатомии, физиологии и индивидуальных особенностей каждого человека.

Именно поэтому в «Эсла» объединены пластическая хирургия, эстетическая медицина и современные технологии, создавая комплексный подход к заботе о внешности.

Для меня важно не просто достичь желаемого визуального результата. Важно сохранить естественность, функциональность, здоровье и индивидуальность.

Мы работаем не ради изменений ради изменений. Мы работаем ради результата, который подчеркивает личность, добавляет уверенности и положительно влияет на качество жизни.

Наша философия проста: красота не должна противоречить здоровью, эстетика не должна нарушать функцию, а медицина должна оставаться основой каждого решения.

Эсла — место, где важно не только то, как вы выглядите, но и то, как вы себя чувствуете.

Красота, за которой стоит медицина. Эстетика, сохраняющая функцию. Здоровье, которое ощущается. Красота, имеющая смысл.

Направления клиники: массаж и реабилитация, обертывания, базовая и инъекционная косметология, аппаратная космеология, эндолифт, ЛОР, пластическая хирургия, дерматология и дерматохирургия, трихология, лабораторная диагностика, домашний уход.

Лицензия МЗ: {$license}
TXT;

        Page::query()->updateOrCreate(
            ['slug' => 'about'],
            [
                'title' => $this->t3('Про клініку', 'About the clinic', 'О клинике'),
                'body' => $this->t3($uk, $en, $ru),
                'is_published' => true,
            ]
        );
    }

    private function clearCaches(): void
    {
        foreach (['uk', 'en', 'ru'] as $locale) {
            Cache::forget("clinic.{$locale}");
        }
        // Broad cache wipe for API resource caches if present
        try {
            Cache::flush();
        } catch (\Throwable) {
            // ignore drivers that disallow flush
        }
    }

    private function t3(string $uk, ?string $en = null, ?string $ru = null): array
    {
        return [
            'uk' => $uk,
            'en' => $en ?? $uk,
            'ru' => $ru ?? $uk,
        ];
    }
}
