<?php

namespace Database\Seeders;

use App\Models\ClinicSetting;
use App\Models\Doctor;
use App\Models\FaqItem;
use App\Models\Page;
use App\Models\PortfolioCase;
use App\Models\Post;
use App\Models\Review;
use App\Models\Service;
use App\Models\ServiceCategory;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        User::query()->updateOrCreate(
            ['email' => env('ADMIN_EMAIL', 'admin@esla.local')],
            [
                'name' => 'Esla Admin',
                'password' => Hash::make(env('ADMIN_PASSWORD', 'password')),
                'email_verified_at' => now(),
            ]
        );

        ClinicSetting::query()->firstOrCreate([], [
            'phones' => ['main' => '+380991370582'],
            'messengers' => [
                'telegram' => '',
                'whatsapp' => '',
                'viber' => '',
            ],
            'address' => [
                'uk' => 'Київ',
                'en' => 'Kyiv',
                'ru' => 'Киев',
            ],
            'schedule' => [
                'uk' => 'Пн–Сб: 09:00–20:00',
                'en' => 'Mon–Sat: 09:00–20:00',
                'ru' => 'Пн–Сб: 09:00–20:00',
            ],
            'email' => 'info@esla.ua',
        ]);

        $this->seedCategoriesAndServices();
        $this->seedPages();
        $this->seedFaq();
        $this->seedDoctors();
        $this->seedPosts();
        $this->seedReviews();
        $this->seedPortfolio();
    }

    private function t3(string $uk, ?string $en = null, ?string $ru = null): array
    {
        return [
            'uk' => $uk,
            'en' => $en ?? $uk,
            'ru' => $ru ?? $uk,
        ];
    }

    private function seedCategoriesAndServices(): void
    {
        $catalog = [
            [
                'slug' => 'otolaryngology',
                'name' => $this->t3('Отоларингологія', 'Otolaryngology', 'Отоларингология'),
                'description' => $this->t3(
                    'Лікування захворювань вуха, горла та носа',
                    'Treatment of ear, nose and throat conditions',
                    'Лечение заболеваний уха, горла и носа'
                ),
                'services' => [
                    [
                        'slug' => 'lor-consultation',
                        'name' => 'Консультація ЛОРа',
                        'desc' => 'Огляд та встановлення діагнозу фахівцем',
                        'price' => 1290,
                    ],
                    [
                        'slug' => 'tonsil-lacunae-washing',
                        'name' => 'Промивання лакун мигдаликів',
                        'desc' => 'Очищення піднебінних мигдаликів від інфекції',
                        'price' => 700,
                    ],
                    [
                        'slug' => 'cuckoo-nasal-toilet',
                        'name' => 'Туалет носової порожнини, «кукушка»',
                        'desc' => 'Промивання носа для видалення слизу',
                        'price' => 700,
                    ],
                ],
            ],
            [
                'slug' => 'lor-surgery',
                'name' => $this->t3('ЛОР-хірургія', 'ENT surgery', 'ЛОР-хирургия'),
                'description' => $this->t3(
                    'Оперативне лікування за принципом «під ключ»',
                    'Surgical treatment on a turnkey basis',
                    'Оперативное лечение по принципу «под ключ»'
                ),
                'services' => [
                    [
                        'slug' => 'septoplasty',
                        'name' => 'Септопластика',
                        'desc' => 'Корекція викривленої носової перетинки для відновлення дихання',
                        'price' => 38900,
                    ],
                    [
                        'slug' => 'rhinoplasty-partial',
                        'name' => 'Ринопластика часткова',
                        'desc' => 'Зміна форми окремих частин носа, наприклад кінчика',
                        'price' => 78900,
                    ],
                    [
                        'slug' => 'rhinoplasty-full',
                        'name' => 'Ринопластика повна',
                        'desc' => 'Комплексна зміна зовнішньої форми носа',
                        'price' => 139000,
                    ],
                    [
                        'slug' => 'rhinoseptoplasty',
                        'name' => 'Риносептопластика',
                        'desc' => 'Поєднання корекції форми носа та вирівнювання перетинки',
                        'price' => 156000,
                    ],
                    [
                        'slug' => 'rhinoplasty-cartilage',
                        'name' => 'Ринопластика із забором власного хряща',
                        'desc' => 'Використання власних тканин для реконструкції',
                        'price' => 189000,
                    ],
                    [
                        'slug' => 'laser-snoring',
                        'name' => 'Лазерне лікування храпу',
                        'desc' => 'Малоінвазивна процедура для покращення якості сну',
                        'price' => 48900,
                    ],
                ],
            ],
            [
                'slug' => 'face-neck-plastics',
                'name' => $this->t3('Пластика обличчя та шиї', 'Face and neck plastics', 'Пластика лица и шеи'),
                'description' => $this->t3(
                    'Естетична корекція та омолодження',
                    'Aesthetic correction and rejuvenation',
                    'Эстетическая коррекция и омоложение'
                ),
                'services' => [
                    [
                        'slug' => 'blepharoplasty-circular',
                        'name' => 'Блефаропластика кругова',
                        'desc' => 'Комплексна підтяжка верхніх та нижніх повік',
                        'price' => 69900,
                    ],
                    [
                        'slug' => 'blepharoplasty-upper',
                        'name' => 'Блефаропластика верхня',
                        'desc' => 'Корекція нависаючої шкіри верхніх повік',
                        'price' => 38000,
                    ],
                    [
                        'slug' => 'blepharoplasty-lower',
                        'name' => 'Блефаропластика нижня',
                        'desc' => 'Видалення мішків під очима, у т.ч. без розрізів',
                        'price' => 36900,
                    ],
                    [
                        'slug' => 'temporal-brow-lift',
                        'name' => 'Скроневий ліфтинг, броуліфтинг',
                        'desc' => 'Підтяжка брів та зовнішніх кутиків очей',
                        'price' => null,
                    ],
                    [
                        'slug' => 'lower-third-lift',
                        'name' => 'Нижня третина',
                        'desc' => 'Підтяжка контурів нижньої частини обличчя та підборіддя',
                        'price' => null,
                    ],
                    [
                        'slug' => 'facelift-circular',
                        'name' => 'Кругова підтяжка обличчя',
                        'desc' => 'Повне відновлення пружності шкіри та овалу обличчя',
                        'price' => null,
                    ],
                    [
                        'slug' => 'face-neck-lift',
                        'name' => 'Підтяжка обличчя та шиї',
                        'desc' => 'Комплексна корекція вікових змін',
                        'price' => null,
                    ],
                    [
                        'slug' => 'chin-liporeduction',
                        'name' => 'Ліпоредукція підборіддя',
                        'desc' => 'Видалення надлишкового жиру в зоні підборіддя',
                        'price' => null,
                    ],
                    [
                        'slug' => 'otoplasty',
                        'name' => 'Отопластика',
                        'desc' => 'Корекція форми вух та усунення клаповухості',
                        'price' => null,
                    ],
                    [
                        'slug' => 'face-lipofilling',
                        'name' => 'Ліпофілінг обличчя',
                        'desc' => 'Відновлення обʼємів обличчя за допомогою власного жиру',
                        'price' => null,
                    ],
                    [
                        'slug' => 'bisha-removal',
                        'name' => 'Видалення комків Біша',
                        'desc' => 'Моделювання скул шляхом видалення жирових тіл щік',
                        'price' => null,
                    ],
                    [
                        'slug' => 'cheiloplasty',
                        'name' => 'Хейлопластика',
                        'desc' => 'Хірургічна корекція форми та розміру губ',
                        'price' => null,
                    ],
                    [
                        'slug' => 'earlobe-plasty',
                        'name' => 'Пластика мочки вуха',
                        'desc' => 'Відновлення після розривів або розтягнень тунелями',
                        'price' => null,
                    ],
                    [
                        'slug' => 'scar-excision',
                        'name' => 'Висічення рубців',
                        'desc' => 'Хірургічне видалення шрамів для естетичного вигляду',
                        'price' => null,
                    ],
                    [
                        'slug' => 'hump-liporeduction',
                        'name' => 'Ліпоредукція холки',
                        'desc' => 'Видалення жирових відкладень у зоні сьомого хребця',
                        'price' => null,
                    ],
                ],
            ],
            [
                'slug' => 'endolift',
                'name' => $this->t3('Ендоліфт', 'Endolift', 'Эндолифт'),
                'description' => $this->t3(
                    'Лазерна підтяжка шкіри та розщеплення жиру',
                    'Laser skin tightening and fat reduction',
                    'Лазерная подтяжка кожи и расщепление жира'
                ),
                'featured' => true,
                'services' => [
                    [
                        'slug' => 'endolift-face',
                        'name' => 'Ендоліфт обличчя',
                        'desc' => 'Безопераційне омолодження контурів',
                        'price' => null,
                        'featured' => true,
                    ],
                    [
                        'slug' => 'endolift-double-chin',
                        'name' => 'Ендоліфт друге підборіддя',
                        'desc' => 'Усунення зайвого обʼєму лазером',
                        'price' => null,
                        'featured' => true,
                    ],
                    [
                        'slug' => 'endolift-neck',
                        'name' => 'Ендоліфт шия',
                        'desc' => 'Ліфтинг та покращення тургору шкіри',
                        'price' => null,
                        'featured' => true,
                    ],
                    [
                        'slug' => 'endolift-face-neck',
                        'name' => 'Ендоліфт обличчя + шия',
                        'desc' => 'Комплексна лазерна корекція',
                        'price' => null,
                        'featured' => true,
                    ],
                    [
                        'slug' => 'endolift-thighs',
                        'name' => 'Ендоліфт бедра («вушка»)',
                        'desc' => 'Моделювання силуету ніг',
                        'price' => null,
                        'featured' => true,
                    ],
                ],
            ],
            [
                'slug' => 'body-care',
                'name' => $this->t3('Апаратний масаж та догляд за тілом', 'Body care and massage', 'Аппаратный массаж и уход за телом'),
                'description' => $this->t3('Корекція фігури', 'Body contouring', 'Коррекция фигуры'),
                'services' => [
                    [
                        'slug' => 'body-complex-60',
                        'name' => 'Комплекс 60хв',
                        'desc' => 'Масаж проблемних зон: ноги, сідниці, живіт',
                        'price' => null,
                    ],
                    [
                        'slug' => 'body-complex-90',
                        'name' => 'Комплекс 90хв',
                        'desc' => 'Лімфодренажний масаж всього тіла',
                        'price' => null,
                    ],
                    [
                        'slug' => 'body-wrap',
                        'name' => 'Обгортання',
                        'desc' => 'Професійний догляд: зволоження, детокс або антицелюліт',
                        'price' => null,
                    ],
                ],
            ],
            [
                'slug' => 'cosmetology',
                'name' => $this->t3('Косметологія', 'Cosmetology', 'Косметология'),
                'description' => $this->t3(
                    'Інʼєкційні та доглядові методики',
                    'Injectable and care procedures',
                    'Инъекционные и уходовые методики'
                ),
                'services' => [
                    [
                        'slug' => 'cosmetologist-consultation',
                        'name' => 'Консультація спеціаліста',
                        'desc' => 'Оцінка стану шкіри, волосся та призначення лікування',
                        'price' => null,
                    ],
                    [
                        'slug' => 'botox',
                        'name' => 'Ботокс',
                        'desc' => 'Корекція мімічних зморшок за допомогою інʼєкцій',
                        'price' => null,
                    ],
                    [
                        'slug' => 'mesotherapy',
                        'name' => 'Мезотерапія',
                        'desc' => 'Введення вітамінних коктейлів для живлення шкіри',
                        'price' => null,
                    ],
                    [
                        'slug' => 'biorevitalization',
                        'name' => 'Біоревіталізація',
                        'desc' => 'Глибоке зволоження шкіри гіалуроновою кислотою',
                        'price' => null,
                    ],
                    [
                        'slug' => 'lip-augmentation',
                        'name' => 'Збільшення губ',
                        'desc' => 'Корекція форми та обʼєму філерами',
                        'price' => null,
                    ],
                ],
            ],
            [
                'slug' => 'checkup',
                'name' => $this->t3('Повний чек-ап', 'Full check-up', 'Полный чек-ап'),
                'description' => $this->t3(
                    'Комплексна лабораторна діагностика',
                    'Comprehensive lab diagnostics',
                    'Комплексная лабораторная диагностика'
                ),
                'services' => [
                    [
                        'slug' => 'lab-checkup-packages',
                        'name' => 'Профільні пакети аналізів',
                        'desc' => 'Відповідно до віку та статі для перевірки здоровʼя',
                        'price' => null,
                    ],
                ],
            ],
        ];

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

            foreach ($categoryData['services'] as $sIndex => $serviceData) {
                $ukName = $serviceData['name'];
                $ukDesc = $serviceData['desc'] ?? null;
                Service::query()->updateOrCreate(
                    ['slug' => $serviceData['slug']],
                    [
                        'service_category_id' => $category->id,
                        'name' => $this->t3($ukName),
                        'short_description' => $ukDesc ? $this->t3($ukDesc) : null,
                        'price_from' => $serviceData['price'],
                        'is_featured' => (bool) ($serviceData['featured'] ?? ($categoryData['featured'] ?? false)),
                        'sort' => $sIndex + 1,
                        'is_active' => true,
                    ]
                );
            }
        }
    }

    private function seedPages(): void
    {
        $pages = [
            [
                'slug' => 'about',
                'title' => $this->t3('Про клініку', 'About the clinic', 'О клинике'),
                'body' => $this->t3(
                    "Медичний центр Esla — пластична хірургія та естетична медицина в Києві.\n\nМи працюємо з напрямками: ендоліфт, пластика обличчя та шиї, ЛОР-хірургія, косметологія, апаратний догляд за тілом та лабораторний чек-ап.\n\nПервинна консультація допомагає скласти індивідуальний план. Детальний медичний опис процедур надає лікар на прийомі.\n\nЗапис — за телефоном або через форму на сайті.",
                    "Esla medical center — plastic surgery and aesthetic medicine in Kyiv.\n\nDirections: Endolift, face and neck plastics, ENT surgery, cosmetology, body care and lab check-up.\n\nA first consultation helps build an individual plan. Detailed medical information is provided by the doctor during the visit.\n\nBook by phone or via the website form.",
                    "Медицинский центр Esla — пластическая хирургия и эстетическая медицина в Киеве.\n\nНаправления: эндолифт, пластика лица и шеи, ЛОР-хирургия, косметология, аппаратный уход за телом и лабораторный чек-ап.\n\nПервичная консультация помогает составить индивидуальный план. Подробное медицинское описание процедур предоставляет врач на приеме.\n\nЗапись — по телефону или через форму на сайте."
                ),
            ],
            [
                'slug' => 'privacy',
                'title' => $this->t3('Політика конфіденційності', 'Privacy Policy', 'Политика конфиденциальности'),
                'body' => $this->t3(
                    "Ця сторінка описує, як медичний центр Esla обробляє персональні дані, отримані через сайт (заявки, телефон, email).\n\nДані використовуються для звʼязку щодо запису та консультації. Текст політики буде уточнено клієнтом перед публікацією у проді.",
                    "This page describes how Esla processes personal data submitted via the website (forms, phone, email).\n\nData is used to contact you about booking and consultation. Full legal text will be provided by the client before production.",
                    "Эта страница описывает, как медицинский центр Esla обрабатывает персональные данные, полученные через сайт (заявки, телефон, email).\n\nДанные используются для связи по записи и консультации. Полный текст политики будет предоставлен клиентом перед продакшеном."
                ),
            ],
            [
                'slug' => 'cookies',
                'title' => $this->t3('Cookie Policy', 'Cookie Policy', 'Cookie Policy'),
                'body' => $this->t3(
                    "Сайт може використовувати технічні cookies для коректної роботи та аналітики (якщо підключено).\n\nДетальний Cookie Policy буде надано клієнтом.",
                    "The site may use technical cookies for correct operation and analytics (if enabled).\n\nA detailed Cookie Policy will be provided by the client.",
                    "Сайт может использовать технические cookies для корректной работы и аналитики (если подключена).\n\nПодробный Cookie Policy будет предоставлен клиентом."
                ),
            ],
            [
                'slug' => 'terms',
                'title' => $this->t3('Умови використання', 'Terms of Use', 'Условия использования'),
                'body' => $this->t3(
                    "Користуючись сайтом Esla, ви погоджуєтесь з правилами використання матеріалів сайту.\n\nІнформація на сайті має ознайомчий характер і не замінює очну консультацію лікаря. Повний юридичний текст буде надано клієнтом.",
                    "By using the Esla website you agree to the site terms.\n\nWebsite information is informational and does not replace an in-person medical consultation. Full legal text will be provided by the client.",
                    "Используя сайт Esla, вы соглашаетесь с правилами использования материалов сайта.\n\nИнформация на сайте носит ознакомительный характер и не заменяет очную консультацию врача. Полный юридический текст будет предоставлен клиентом."
                ),
            ],
        ];

        foreach ($pages as $page) {
            Page::query()->updateOrCreate(
                ['slug' => $page['slug']],
                [
                    'title' => $page['title'],
                    'body' => $page['body'],
                    'is_published' => true,
                ]
            );
        }
    }

    private function seedFaq(): void
    {
        $items = [
            [
                'category_slug' => 'general',
                'question' => $this->t3(
                    'Як записатися на консультацію?',
                    'How do I book a consultation?',
                    'Как записаться на консультацию?'
                ),
                'answer' => $this->t3(
                    'Зателефонуйте або залиште заявку на сайті — менеджер підтвердить зручний час.',
                    'Call us or submit a form — a manager will confirm a convenient time.',
                    'Позвоните или оставьте заявку на сайте — менеджер подтвердит удобное время.'
                ),
            ],
            [
                'category_slug' => 'endolift',
                'question' => $this->t3(
                    'Що таке ендоліфт?',
                    'What is Endolift?',
                    'Что такое эндолифт?'
                ),
                'answer' => $this->t3(
                    'Ендоліфт — лазерна методика підтяжки шкіри. Детальний медичний опис надає клініка на консультації.',
                    'Endolift is a laser skin-tightening method. Detailed medical content is provided by the clinic during consultation.',
                    'Эндолифт — лазерная методика подтяжки кожи. Подробное медицинское описание предоставляет клиника на консультации.'
                ),
            ],
            [
                'category_slug' => 'general',
                'question' => $this->t3(
                    'Де подивитися актуальні ціни?',
                    'Where can I see current prices?',
                    'Где посмотреть актуальные цены?'
                ),
                'answer' => $this->t3(
                    'Актуальний прайс зібрано на сторінці «Ціни». Позиції без вартості уточнюються на консультації.',
                    'The current price list is on the Prices page. Items without a listed cost are confirmed during consultation.',
                    'Актуальный прайс собран на странице «Цены». Позиции без стоимости уточняются на консультации.'
                ),
            ],
            [
                'category_slug' => 'general',
                'question' => $this->t3(
                    'Якими мовами доступний сайт?',
                    'Which languages does the site support?',
                    'На каких языках доступен сайт?'
                ),
                'answer' => $this->t3(
                    'Українською, англійською та російською. Основна мова — українська.',
                    'Ukrainian, English and Russian. Ukrainian is the primary language.',
                    'На украинском, английском и русском. Основной язык — украинский.'
                ),
            ],
        ];

        foreach ($items as $index => $item) {
            FaqItem::query()->updateOrCreate(
                [
                    'category_slug' => $item['category_slug'],
                    'sort' => $index + 1,
                ],
                [
                    'question' => $item['question'],
                    'answer' => $item['answer'],
                    'is_active' => true,
                ]
            );
        }
    }

    private function seedDoctors(): void
    {
        $doctors = [
            [
                'slug' => 'plastic-surgeon',
                'name' => $this->t3('Пластичний хірург', 'Plastic surgeon', 'Пластический хирург'),
                'position' => $this->t3(
                    'Пластична хірургія обличчя та шиї',
                    'Face and neck plastic surgery',
                    'Пластическая хирургия лица и шеи'
                ),
                'bio' => $this->t3(
                    'Профіль лікаря буде оновлено клінікою: освіта, спеціалізація та досвід. Запис на консультацію — через форму або телефон.',
                    'Doctor profile will be updated by the clinic: education, specialization and experience. Book via the form or phone.',
                    'Профиль врача будет обновлен клиникой: образование, специализация и опыт. Запись — через форму или телефон.'
                ),
                'experience_years' => null,
                'sort' => 1,
                'services' => ['blepharoplasty-circular', 'blepharoplasty-upper', 'rhinoplasty-full', 'endolift-face'],
            ],
            [
                'slug' => 'ent-surgeon',
                'name' => $this->t3('ЛОР-хірург', 'ENT surgeon', 'ЛОР-хирург'),
                'position' => $this->t3('Отоларингологія та ЛОР-хірургія', 'Otolaryngology and ENT surgery', 'Отоларингология и ЛОР-хирургия'),
                'bio' => $this->t3(
                    'Профіль лікаря буде оновлено клінікою. Консультація ЛОРа доступна в каталозі послуг.',
                    'Doctor profile will be updated by the clinic. ENT consultation is available in the services catalog.',
                    'Профиль врача будет обновлен клиникой. Консультация ЛОРа доступна в каталоге услуг.'
                ),
                'experience_years' => null,
                'sort' => 2,
                'services' => ['lor-consultation', 'septoplasty', 'rhinoseptoplasty', 'laser-snoring'],
            ],
            [
                'slug' => 'cosmetologist',
                'name' => $this->t3('Лікар-косметолог', 'Cosmetologist', 'Врач-косметолог'),
                'position' => $this->t3('Інʼєкційна та апаратна косметологія', 'Injectable and device cosmetology', 'Инъекционная и аппаратная косметология'),
                'bio' => $this->t3(
                    'Профіль лікаря буде оновлено клінікою. Перелік процедур — у розділі «Косметологія».',
                    'Doctor profile will be updated by the clinic. Procedures are listed under Cosmetology.',
                    'Профиль врача будет обновлен клиникой. Список процедур — в разделе «Косметология».'
                ),
                'experience_years' => null,
                'sort' => 3,
                'services' => ['cosmetologist-consultation', 'botox', 'mesotherapy', 'biorevitalization'],
            ],
        ];

        foreach ($doctors as $data) {
            $serviceSlugs = $data['services'];
            unset($data['services']);

            $doctor = Doctor::query()->updateOrCreate(
                ['slug' => $data['slug']],
                [
                    ...$data,
                    'is_active' => true,
                ]
            );

            $ids = Service::query()->whereIn('slug', $serviceSlugs)->pluck('id');
            $doctor->services()->sync($ids);
        }
    }

    private function seedPosts(): void
    {
        $posts = [
            [
                'slug' => 'how-to-book-consultation',
                'title' => $this->t3(
                    'Як записатися на консультацію в Esla',
                    'How to book a consultation at Esla',
                    'Как записаться на консультацию в Esla'
                ),
                'excerpt' => $this->t3(
                    'Коротко про дзвінок, онлайн-заявку та що підготувати до першого візиту.',
                    'A short guide to calling, submitting a form, and preparing for your first visit.',
                    'Кратко о звонке, онлайн-заявке и подготовке к первому визиту.'
                ),
                'body' => $this->t3(
                    "1. Зателефонуйте за номером на сайті або залиште заявку у формі запису.\n2. Менеджер підтвердить зручний час.\n3. На консультації лікар відповість на питання щодо послуги та подальших кроків.\n\nМедичні рекомендації надаються лише на очному прийомі.",
                    "1. Call the number on the website or submit the booking form.\n2. A manager will confirm a convenient time.\n3. During the consultation the doctor answers questions about the service and next steps.\n\nMedical recommendations are provided only during an in-person visit.",
                    "1. Позвоните по номеру на сайте или оставьте заявку в форме записи.\n2. Менеджер подтвердит удобное время.\n3. На консультации врач ответит на вопросы по услуге и следующим шагам.\n\nМедицинские рекомендации предоставляются только на очном приеме."
                ),
            ],
            [
                'slug' => 'esla-service-directions',
                'title' => $this->t3(
                    'Напрямки клініки Esla',
                    'Esla clinic directions',
                    'Направления клиники Esla'
                ),
                'excerpt' => $this->t3(
                    'Огляд каталогу: ендоліфт, пластика, ЛОР, косметологія та чек-ап.',
                    'Overview of the catalog: Endolift, plastics, ENT, cosmetology and check-up.',
                    'Обзор каталога: эндолифт, пластика, ЛОР, косметология и чек-ап.'
                ),
                'body' => $this->t3(
                    "У каталозі послуг зібрані напрямки медичного центру Esla в Києві: отоларингологія, ЛОР-хірургія, пластика обличчя та шиї, ендоліфт, догляд за тілом, косметологія та лабораторний чек-ап.\n\nАктуальні ціни (де вони вже затверджені) — на сторінці прайсу. Позиції без вартості уточнюються індивідуально.",
                    "The services catalog covers Esla directions in Kyiv: otolaryngology, ENT surgery, face and neck plastics, Endolift, body care, cosmetology and lab check-up.\n\nCurrent prices (where approved) are on the price list page. Items without a listed cost are confirmed individually.",
                    "В каталоге услуг собраны направления медицинского центра Esla в Киеве: отоларингология, ЛОР-хирургия, пластика лица и шеи, эндолифт, уход за телом, косметология и лабораторный чек-ап.\n\nАктуальные цены (где уже утверждены) — на странице прайса. Позиции без стоимости уточняются индивидуально."
                ),
            ],
            [
                'slug' => 'prices-and-consultation',
                'title' => $this->t3(
                    'Ціни та консультація: що варто знати',
                    'Prices and consultation: what to know',
                    'Цены и консультация: что важно знать'
                ),
                'excerpt' => $this->t3(
                    'Чому частина позицій у прайсі «за запитом» і як уточнити вартість.',
                    'Why some price-list items are “on request” and how to confirm the cost.',
                    'Почему часть позиций в прайсе «по запросу» и как уточнить стоимость.'
                ),
                'body' => $this->t3(
                    "У прайсі вказані затверджені вартості з каталогу клініки. Якщо біля послуги немає суми — фінальна вартість залежить від обсягу втручання та планується на консультації.\n\nДзвінок або заявка — найшвидший спосіб отримати орієнтир по вашому запиту.",
                    "The price list shows approved clinic catalog costs. If a service has no amount, the final cost depends on the scope of treatment and is planned during consultation.\n\nA call or form request is the fastest way to get guidance for your case.",
                    "В прайсе указаны утвержденные стоимости из каталога клиники. Если рядом с услугой нет суммы — итоговая стоимость зависит от объема вмешательства и планируется на консультации.\n\nЗвонок или заявка — самый быстрый способ получить ориентир по вашему запросу."
                ),
            ],
        ];

        foreach ($posts as $index => $post) {
            Post::query()->updateOrCreate(
                ['slug' => $post['slug']],
                [
                    'title' => $post['title'],
                    'excerpt' => $post['excerpt'],
                    'body' => $post['body'],
                    'is_published' => true,
                    'published_at' => now()->subDays(count($posts) - $index),
                ]
            );
        }
    }

    private function seedReviews(): void
    {
        $reviews = [
            [
                'author_name' => 'Олена',
                'text' => $this->t3(
                    'Зручний запис і ввічлива комунікація. На консультації все пояснили спокійно, без тиску.',
                    'Convenient booking and polite communication. Everything was explained calmly at the consultation, without pressure.',
                    'Удобная запись и вежливая коммуникация. На консультации всё объяснили спокойно, без давления.'
                ),
                'source' => 'google',
                'rating' => 5,
                'sort' => 1,
            ],
            [
                'author_name' => 'Марина',
                'text' => $this->t3(
                    'Прийшли за консультацією щодо ЛОР-напрямку. Організація візиту на високому рівні.',
                    'We came for an ENT consultation. Visit organization was at a high level.',
                    'Пришли на консультацию по ЛОР-направлению. Организация визита на высоком уровне.'
                ),
                'source' => 'site',
                'rating' => 5,
                'sort' => 2,
            ],
            [
                'author_name' => 'Ірина',
                'text' => $this->t3(
                    'Дякую менеджеру за швидку відповідь у месенджері та допомогу з вибором часу.',
                    'Thanks to the manager for a quick messenger reply and help choosing a time slot.',
                    'Спасибо менеджеру за быстрый ответ в мессенджере и помощь с выбором времени.'
                ),
                'source' => 'site',
                'rating' => 5,
                'sort' => 3,
            ],
        ];

        foreach ($reviews as $review) {
            Review::query()->updateOrCreate(
                [
                    'author_name' => $review['author_name'],
                    'sort' => $review['sort'],
                ],
                [
                    'text' => $review['text'],
                    'source' => $review['source'],
                    'rating' => $review['rating'],
                    'is_published' => true,
                ]
            );
        }
    }

    private function seedPortfolio(): void
    {
        $cases = [
            [
                'slug' => 'blepharoplasty-case-01',
                'title' => $this->t3('Блефаропластика — клінічний кейс', 'Blepharoplasty — clinical case', 'Блефаропластика — клинический кейс'),
                'description' => $this->t3(
                    'Демонстраційний матеріал. Фінальні фото до/після публікуються лише за згодою пацієнта.',
                    'Demo material. Final before/after photos are published only with patient consent.',
                    'Демонстрационный материал. Финальные фото до/после публикуются только с согласия пациента.'
                ),
                'service' => 'blepharoplasty-circular',
                'before' => 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=800&h=1000&fit=crop&auto=format',
                'after' => 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800&h=1000&fit=crop&auto=format',
                'sort' => 1,
            ],
            [
                'slug' => 'rhinoplasty-case-01',
                'title' => $this->t3('Ринопластика — клінічний кейс', 'Rhinoplasty — clinical case', 'Ринопластика — клинический кейс'),
                'description' => $this->t3(
                    'Матеріали портфоліо публікуються лише за згодою пацієнта.',
                    'Portfolio materials are published only with patient consent.',
                    'Материалы портфолио публикуются только с согласия пациента.'
                ),
                'service' => 'rhinoplasty-full',
                'before' => 'https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=800&h=1000&fit=crop&auto=format',
                'after' => 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800&h=1000&fit=crop&auto=format',
                'sort' => 2,
            ],
            [
                'slug' => 'endolift-case-01',
                'title' => $this->t3('Ендоліфт — клінічний кейс', 'Endolift — clinical case', 'Эндолифт — клинический кейс'),
                'description' => $this->t3(
                    'Демонстраційний атмосферний кадр напрямку Endolift.',
                    'Demo atmospheric frame for the Endolift direction.',
                    'Демонстрационный атмосферный кадр направления Endolift.'
                ),
                'service' => 'endolift-face',
                'before' => 'https://images.unsplash.com/photo-1785861378703-1c991c4548ef?w=800&h=1000&fit=crop&auto=format',
                'after' => 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=800&h=1000&fit=crop&auto=format',
                'sort' => 3,
            ],
            [
                'slug' => 'body-care-case-01',
                'title' => $this->t3('Контур тіла — клінічний кейс', 'Body contour — clinical case', 'Контур тела — клинический кейс'),
                'description' => $this->t3(
                    'Демонстраційний матеріал напрямку body care.',
                    'Demo material for the body-care direction.',
                    'Демонстрационный материал направления body care.'
                ),
                'service' => 'body-complex-60',
                'before' => 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&h=1000&fit=crop&auto=format',
                'after' => 'https://images.unsplash.com/photo-1519823551278-64ac92714706?w=800&h=1000&fit=crop&auto=format',
                'sort' => 4,
            ],
            [
                'slug' => 'cosmetology-case-01',
                'title' => $this->t3('Косметологія — клінічний кейс', 'Cosmetology — clinical case', 'Косметология — клинический кейс'),
                'description' => $this->t3(
                    'Демонстраційний матеріал косметологічного напрямку.',
                    'Demo material for the cosmetology direction.',
                    'Демонстрационный материал косметологического направления.'
                ),
                'service' => 'botox',
                'before' => 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800&h=1000&fit=crop&auto=format',
                'after' => 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=800&h=1000&fit=crop&auto=format',
                'sort' => 5,
            ],
        ];

        $doctorId = Doctor::query()->where('slug', 'plastic-surgeon')->value('id');

        foreach ($cases as $case) {
            $serviceId = Service::query()->where('slug', $case['service'])->value('id');
            if (! $serviceId) {
                continue;
            }

            PortfolioCase::query()->updateOrCreate(
                ['slug' => $case['slug']],
                [
                    'title' => $case['title'],
                    'description' => $case['description'],
                    'service_id' => $serviceId,
                    'doctor_id' => $doctorId,
                    'before_path' => $case['before'],
                    'after_path' => $case['after'],
                    'sort' => $case['sort'],
                    'is_active' => true,
                ]
            );
        }
    }
}
