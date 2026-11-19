# -*- coding: utf-8 -*-
"""Smoke-test CRM booking chain ending with POST /post/entries."""
from __future__ import annotations

import json
import urllib.error
import urllib.parse
import urllib.request

BASE = "https://1cloud.in.ua/EslaSSE/hs/SiteServiceEntry"
UA = "Mozilla/5.0 (compatible; ESLA-CRM-Test/1.0)"


def req(method: str, path: str, params: dict | None = None, body: dict | None = None):
    url = BASE + path
    if params:
        url += "?" + urllib.parse.urlencode(params)
    data = None
    headers = {"Accept": "application/json", "User-Agent": UA}
    if body is not None:
        data = json.dumps(body, ensure_ascii=False).encode("utf-8")
        headers["Content-Type"] = "application/json; charset=utf-8"
    print(f"{method} {url}")
    request = urllib.request.Request(url, data=data, headers=headers, method=method)
    try:
        with urllib.request.urlopen(request, timeout=45) as resp:
            raw = resp.read()
            print(f"  -> HTTP {resp.status}, {len(raw)} bytes")
            if not raw:
                return None
            return json.loads(raw.decode("utf-8"))
    except urllib.error.HTTPError as e:
        err = e.read().decode("utf-8", errors="replace")
        print(f"  -> HTTP {e.code}")
        print(err[:2000])
        raise


def main() -> None:
    groups = req("GET", "/groups")
    g = groups[0]
    print("group:", g)

    services = req("GET", "/onlyservices", {"group_id": g["group_id"]})
    s = services[0]
    print("service:", {k: s.get(k) for k in ("service_id", "service_name", "duration", "price")})

    resources = req("GET", "/resources", {"service_id": s["service_id"]})
    r = resources[0]
    print("resource:", {k: r.get(k) for k in ("resource_id", "resource_name")})

    dates = req("GET", "/dates", {"resource_id": r["resource_id"], "service_id": s["service_id"]})
    date = dates[0] if isinstance(dates[0], str) else dates[0]["date"]
    print("date:", date)

    slots = req(
        "GET",
        "/timeslots",
        {"date": date, "resource_id": r["resource_id"], "service_id": s["service_id"]},
    )
    print("slots raw:", json.dumps(slots, ensure_ascii=False)[:1000])

    # Normalize slot + department from various CRM shapes
    time_slot = None
    department_id = None
    if isinstance(slots, dict):
        time_list = slots.get("time_slots") or slots.get("timeslots") or slots.get("times") or []
        deps = slots.get("departments") or []
        if deps:
            department_id = deps[0].get("department_id") or deps[0].get("id")
            if not time_list and deps[0].get("time_slots"):
                time_list = deps[0]["time_slots"]
        if time_list:
            first = time_list[0]
            time_slot = first if isinstance(first, str) else (first.get("time_slot") or first.get("time") or first.get("start"))
    elif isinstance(slots, list) and slots:
        first = slots[0]
        time_slot = first if isinstance(first, str) else (first.get("time_slot") or first.get("time"))
        department_id = None if isinstance(first, str) else first.get("department_id")

    if not time_slot:
        raise SystemExit("No time slot found to test booking")
    if not department_id:
        department_id = r.get("department_id") or g.get("group_id")

    payload = {
        "department_id": department_id,
        "resource_id": r["resource_id"],
        "service_id": s["service_id"],
        "time_slot": time_slot,
        "patient": {
            "lastname": "Тестов",
            "firstname": "Тест",
            "patronymic": "Тестович",
            "birth_date": "1990-01-15",
            "gender": "male",
            "phone": "+380991370582",
        },
    }
    print("POST payload:", json.dumps(payload, ensure_ascii=False, indent=2))
    result = req("POST", "/post/entries", body=payload)
    print("POST /post/entries result:", json.dumps(result, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
