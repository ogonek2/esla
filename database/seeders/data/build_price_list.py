# -*- coding: utf-8 -*-
"""Build price_list.json from the ESLA Excel price file."""
from __future__ import annotations

import json
import os
import re
from pathlib import Path

import openpyxl

SRC = Path(r"c:\Users\ytlem\Downloads\Telegram Desktop\ПРАЙС ЕСЛА (3).xlsx")
OUT = Path(__file__).with_name("price_list.json")

UK_MAP = {
    "а": "a", "б": "b", "в": "v", "г": "h", "ґ": "g", "д": "d", "е": "e", "є": "ye",
    "ж": "zh", "з": "z", "и": "y", "і": "i", "ї": "yi", "й": "y", "к": "k", "л": "l",
    "м": "m", "н": "n", "о": "o", "п": "p", "р": "r", "с": "s", "т": "t", "у": "u",
    "ф": "f", "х": "kh", "ц": "ts", "ч": "ch", "ш": "sh", "щ": "shch", "ь": "",
    "ю": "yu", "я": "ya",
}


def slugify(text: str) -> str:
    s = "".join(UK_MAP.get(ch.lower(), ch.lower() if ch.isascii() else "") for ch in text)
    s = re.sub(r"[^a-z0-9]+", "-", s.lower())
    s = re.sub(r"-+", "-", s).strip("-")
    return (s[:80] or "service")


SHEET_META = {
    "Консультації": (
        "consultations",
        "Консультації",
        "Consultations",
        "Консультации",
        "Первинні консультації спеціалістів клініки",
    ),
    "Діагностика": (
        "diagnostics",
        "Діагностика",
        "Diagnostics",
        "Диагностика",
        "Дерматоскопія, біопсія та місцева анестезія",
    ),
    "ЕНДОЛІФТ": (
        "endolift",
        "Ендоліфт",
        "Endolift",
        "Эндолифт",
        "Лазерна підтяжка шкіри та розщеплення жиру",
    ),
    "Масаж": (
        "body-care",
        "Масаж та догляд за тілом",
        "Massage and body care",
        "Массаж и уход за телом",
        "Апаратний і ручний масаж, обгортання",
    ),
    "Косметологія інєкції": (
        "injection-cosmetology",
        "Інʼєкційна косметологія",
        "Injectable cosmetology",
        "Инъекционная космеология",
        "Ботокс, мезотерапія, філери, екзосоми",
    ),
    "Косметологія ": (
        "cosmetology",
        "Базова та апаратна косметологія",
        "Basic and hardware cosmetology",
        "Базовая и аппаратная космеология",
        "Доглядові процедури та апаратна косметологія",
    ),
    "Пластична хірургія": (
        "face-neck-plastics",
        "Пластика обличчя та шиї",
        "Face and neck plastics",
        "Пластика лица и шеи",
        "Естетична корекція та омолодження (вартість «під ключ»)",
    ),
    "ЛОР хірургія": (
        "lor-surgery",
        "ЛОР-хірургія",
        "ENT surgery",
        "ЛОР-хирургия",
        "Оперативне лікування за принципом «під ключ»",
    ),
    "Дерматохірургія": (
        "dermatosurgery",
        "Дерматохірургія",
        "Dermatosurgery",
        "Дерматохирургия",
        "Видалення новоутворень та біопсія",
    ),
}

KNOWN_SLUGS = {
    "Консультація ЛОРа": "lor-consultation",
    "Консультація дерматохірурга/дерматолога із дерматоскопією": "dermatosurgeon-consultation",
    "Консультація дерматохірурга": "dermatosurgeon-consultation",
    "Консультація онкодерматолога": "oncodermatologist-consultation",
    "Консультація дитячого дерматолога": "pediatric-dermatologist-consultation",
    "Дерматоскопія новоутворень (до 3х елементів)": "dermatoscopy-up-to-3",
    "Дерматоскопія новоутворень (від 3 до 10)": "dermatoscopy-3-to-10",
    "Дерматоскопія новоутворень (понад 10)": "dermatoscopy-over-10",
    "Панч біопсія шкіри": "punch-biopsy",
    "Інфільтраційна місцева анестезія": "infiltration-anesthesia",
    "Масаж обличчя, 30хв": "face-massage-30",
    "Курс 10 масажів обличчя по 30хв": "face-massage-course-10x30",
    "Кріодеструкція 1-5 елементів": "cryodestruction-1-5",
    "Кріодеструкція 5-10 елементів": "cryodestruction-5-10",
    "Кріодеструкція понад 10 елементів": "cryodestruction-over-10",
    "додатково оплачується ПГД (до 3зразків)": "histology-pgd",
    "загальна анестезія додатково 1 год": "plastic-general-anesthesia",
    "Додатково оплачується ПГД (до 3 зразків)": "histology-pgd",
    "Консультація пластичного хірурга": "plastic-surgeon-consultation",
    "Комплексне ведення з приводу зниження маси тіла, 5 консультацій суміжних спеціальністів, план обстеження, лікування, повний супровід напротязі 3х міс": "weight-management-program",
    "Консультація трихолога із трихоскопією": "trichologist-consultation",
    "Консультація косметолога/підбір догляду": "cosmetologist-consultation",
    "Консультація реабілітолога": "rehabilitologist-consultation",
    "Ендоліфт обличчя, 1 одноразова насадка": "endolift-face",
    "Ендоліфт друге підборіддя, 1 однорзова насадка": "endolift-double-chin",
    "Ендоліфт шия, 1 дноразова насадка": "endolift-neck",
    "Ендоліфт обличчя+ шия повністю, 2 дноразові насадки": "endolift-face-neck",
    "Ендоліфт, бедра (\"вушка\"), 1 одноразова насадка": "endolift-thighs",
    "Ендоліфт коліна, 1 одноразова насадка": "endolift-knees",
    "Ендоліфт живіт, 1 одноразова насадка": "endolift-abdomen",
    "Ендоліфт живіт + бока, 2 одноразові насадки": "endolift-abdomen-sides",
    "Ендоліфт сідниці (+ \"вушка\"), 2 одноразові насадки": "endolift-buttocks",
    "Ендоліфт ноги повністю (під загальною анестезією), 2 одноразові насадки": "endolift-legs-full",
    "Ендоліфт живіт+ ноги (під загальною анестезією), 3одноразові насадки": "endolift-abdomen-legs",
    "Ендоліфт руки, 1 одноразова насадка": "endolift-arms",
    "Ендоліфт спина, 2 дноразові насадки": "endolift-back",
    "Ендоліфт \"Крила\", 1 одноразова насадка": "endolift-wings",
    "Ендоліфт спина + \"крила\" (під загальною анестезією), 3 одноразові насадки": "endolift-back-wings",
    "Ліпосакція додатково": "endolift-liposuction-extra",
    "Загальна анестезія, 1 год (додатково, де не включено)": "general-anesthesia-1h",
    "Кожна додаткова насадка": "endolift-extra-fiber",
    "Комплекс 60хв ендосфера/вібросфера/веллашейп (ноги, сідниці, живіт)": "body-complex-60",
    "Комплекс 90хв ендосфера/вібросфера/веллашейп (все тіло)": "body-complex-90",
    "Ендосфера обличчя 40хв (+ трапеція та шия)": "endosphere-face-40",
    "Курс 5 масажів по 40хв": "massage-course-5x40",
    "Курс 5 масажів по 60хв": "massage-course-5x60",
    "Курс 5 масажів по 90хв": "massage-course-5x90",
    "Обгортання (зволожуюче, розслабляюче, антицелюлітне (Arosha|DMK)": "body-wrap",
    "Курс 5 обгортань": "body-wrap-course-5",
    "Загальний класичний/лікувальний/ спортивний масаж (ручний)": "classic-massage",
    "Ботокс, 1 ОД, Fortox (GB)": "botox-unit",
    "Ботокс лоб (міжбрівка, лоб, “гусячі лапки”, ніс)": "botox-forehead",
    "Ботокс Full face (міжбрівка, лоб, “гусячі лапки”, н/третина, шия) Fortox (GB)": "botox-full-face",
    "Ботокс лікування гіпергідрозу (долоні/пахви/стопи), за 1 зону, Fortox (GB)": "botox-hyperhidrosis",
    "Мезотерапія, TwAc eyes 1ml": "mesotherapy-twac-eyes",
    "Мезотерапія, Hair loss, Іспанія": "mesotherapy-hair-loss",
    "Мезотерапія Jalupro PLUS 2ml": "mesotherapy-jalupro",
    "Біоревіталізація TwAc 2,0 3ml": "biorevitalization-twac",
    "Збільшення губ Phillex 1,1ml": "lip-augmentation",
    "Контурна пластика обличчя (підборіддя, скули) Phillex 1,1ml": "face-contour-phillex",
    "Колагеностимулятори (гідрооксиапатит кальцію, Radisse)": "collagen-stimulators",
    "Полімолочна кислота, Juvelook 8ml": "juvelook",
    "Gana V, 15ml": "gana-v",
    "Gana X, 15ml": "gana-x",
    "Тріада PB Serum, 5ml (один флакон)": "pb-serum-triad",
    "Плазмотерапія, 1 пробірка": "plasma-therapy",
    "Екзосоми, курс при алопеції (3 процедури), Good Cells, Україна": "exosomes-alopecia-course",
    "Екзосоми, для відновлення шкіри, курс 3 процедури, Good Cells, Україна": "exosomes-skin-course",
    "Екзосоми після хімічного пілінгу": "exosomes-after-peel",
    "Пілінг (азелаїновий, саліциловий, молочний, мигдальний); 40 хв.": "peel-classic",
    "Пілінг PRX-33/APPEX,  1 флакон; 40 хв.": "peel-prx",
    "Ферментотерапія,  DMK; 90хв.": "enzyme-therapy-dmk",
    "Лікування акне ( глибоке очищення за допомогою космецевтики DMK); 90 хв.": "acne-treatment-dmk",
    "Ультразвукова чистка обличчя; 60 хв.": "ultrasonic-facial",
    "Масаж обличчя за допомогою мікротоків; 30 хв.": "microcurrent-face",
    "Неабляційний фракційний лазер LightScan обличчя; 1 процедура; 30 хв.": "lightscan-face",
    "Неабляційний фракційний лазер LightScan шия+декольте; 1 процедура; 50 хв.": "lightscan-neck-decollete",
    "Неабляційний фракційний лазер LightScan обличчя + шия + декольте;1 процедура; 60 хв.": "lightscan-face-neck-decollete",
    "Неабляційний фракційний лазер LightScan  спина; 1 процедура; 60 хв.": "lightscan-back",
    "Неабляційний фракційний лазер LightScan зона бікіні; 1 процедура; 60 хв.": "lightscan-bikini",
    "Неабляційний фракційний лазер LightScan маленькі ділянки, до 10 см; 10 хв.": "lightscan-small",
    "Блефаропластика кругова": "blepharoplasty-circular",
    "Блефаропластика верхня (під м/а)": "blepharoplasty-upper",
    "Блефаропластика нижня, в т.ч транскон’юктивальна": "blepharoplasty-lower",
    "Скроневий ліфтинг, броуліфтинг": "temporal-brow-lift",
    "Нижня третина обличчя": "lower-third-lift",
    "Кругова підтяжка обличчя": "facelift-circular",
    "Підтяжка обличчя та шиї": "face-neck-lift",
    "Ліпоредукція підборіддя під м/а": "chin-liporeduction",
    "Отопластика (під м/а)": "otoplasty",
    "Ліпофілінг обличчя (під м/а)": "face-lipofilling",
    "Видалення комків Біша": "bisha-removal",
    "Хейлопластика": "cheiloplasty",
    "Пластика мочки вуха (під м/а)": "earlobe-plasty",
    "Висічення рубців до 5см (під м/а)": "scar-excision-5cm",
    "Висічення рубця до 10 см": "scar-excision-10cm",
    "Ліпоредукція холки": "hump-liporeduction",
    "Септопластика": "septoplasty",
    "Ринопластика часткова": "rhinoplasty-partial",
    "Ринопластика повна": "rhinoplasty-full",
    "Риносептопластика": "rhinoseptoplasty",
    "Ринопластика із забором власного хряща": "rhinoplasty-cartilage",
    "Лазерне лікування храпу": "laser-snoring",
    "Видалення папіломи/бородавки (1шт)": "papilloma-1",
    "Видалення папіломи/бородавки (5-10шт)": "papilloma-5-10",
    "Видалення папіломи/бородавки (10-20шт)": "papilloma-10-20",
    "Видалення контангіозного молюска (до 10шт)": "molluscum-10",
    "Видалення контангіозного молюска (10-20шт)": "molluscum-10-20",
    "Біопсія 1кат складності": "biopsy-1",
    "Біопсія 2 кат складності (обличчя)": "biopsy-2",
    "Біопсія 3 кат складності (інтимні ділянки)": "biopsy-3",
    "Видалення доброякісних новоутворень шкіри  1кат": "benign-removal-1",
    "Видалення доброякісних новоутворень шкіри (обличчя)2кат": "benign-removal-2",
    "Видалення доброякісних новоутворень шкіри (інтимні ділянки) 3кат": "benign-removal-3",
}

SKIP_HEADERS = {
    "№",
    "Послуга",
    "ЕНДОЛІФТ",
    "Ін’єкції краси",
    "ЕКЗОСОМИ",
    "Видалення новоутворень",
    "Доглядові процедури",
    "Апаратна косметологія",
}


def is_header(text: str) -> bool:
    t = text.strip()
    if t in SKIP_HEADERS:
        return True
    low = t.lower()
    if "вартість" in low:
        return True
    if t.startswith("Пластика обличчя") or t.startswith("ЛОР-хірургія") or t.startswith("Апаратний масаж"):
        return True
    return False


def parse_sheet(ws, cat_slug: str, used: set[str]) -> list[dict]:
    services: list[dict] = []
    for row in ws.iter_rows(values_only=True):
        nums: list[float] = []
        texts: list[str] = []
        for c in row:
            if c is None:
                continue
            if isinstance(c, (int, float)) and not isinstance(c, bool):
                nums.append(float(c))
                continue
            s = str(c).strip()
            if not s:
                continue
            if re.match(r"^\d+\.?$", s):
                continue
            if s.startswith("*"):
                s = s.lstrip("*").strip()
                if not s:
                    continue
            if is_header(s):
                continue
            texts.append(s)
        if not texts:
            continue
        money = [n for n in nums if n >= 100]
        if not money:
            continue
        name = texts[0]
        # Fix apostrophe variants for lookup
        slug = KNOWN_SLUGS.get(name)
        if not slug:
            for k, v in KNOWN_SLUGS.items():
                if k.replace("’", "'").replace("“", '"').replace("”", '"') == name.replace("’", "'").replace("“", '"').replace("”", '"'):
                    slug = v
                    break
        if not slug:
            slug = slugify(name)
        base = slug
        i = 2
        while slug in used:
            slug = f"{base}-{i}"
            i += 1
        used.add(slug)

        featured = False
        if cat_slug == "endolift":
            low = name.lower()
            if low.startswith("ендоліфт") and "додатков" not in low and "анестезія" not in low and not low.startswith("кожна"):
                featured = True

        name = {
            "загальна анестезія додатково 1 год": "Загальна анестезія додатково, 1 год",
            "додатково оплачується ПГД (до 3зразків)": "ПГД (до 3 зразків)",
        }.get(name, name)
        item = {"slug": slug, "name": name, "price": int(money[-1]), "featured": featured}
        # Duplicate biorevitalization rows — keep both with unique slugs already handled
        services.append(item)
    return services


def main() -> None:
    wb = openpyxl.load_workbook(SRC, data_only=True)
    used: set[str] = set()
    catalog = []
    for sheet, meta in SHEET_META.items():
        if sheet not in wb.sheetnames:
            print("missing sheet", sheet)
            continue
        cat_slug, uk, en, ru, desc = meta
        services = parse_sheet(wb[sheet], cat_slug, used)
        # second biorevitalization duplicate name — ensure unique display distinction
        seen_names: dict[str, int] = {}
        for s in services:
            n = s["name"]
            seen_names[n] = seen_names.get(n, 0) + 1
            if seen_names[n] > 1 and n.startswith("Біоревіталізація"):
                s["slug"] = "biorevitalization-twac-2"
                s["name"] = f"{n} (варіант 2)"
        catalog.append(
            {
                "slug": cat_slug,
                "name": {"uk": uk, "en": en, "ru": ru},
                "description": {
                    "uk": desc,
                    "en": desc,
                    "ru": desc,
                },
                "featured": cat_slug == "endolift",
                "services": services,
            }
        )
        print(cat_slug, len(services))

    OUT.write_text(json.dumps(catalog, ensure_ascii=False, indent=2), encoding="utf-8")
    print("wrote", OUT, "categories", len(catalog), "services", sum(len(c["services"]) for c in catalog))


if __name__ == "__main__":
    main()
