import csv, json, os

HERE = os.path.dirname(os.path.abspath(__file__))

def to_num(v):
    v = (v or "").strip().replace("%", "")
    if v == "":
        return None
    n = float(v)
    return int(n) if n == int(n) else n

rows = []
with open(os.path.join(HERE, "products.csv"), newline="", encoding="utf-8-sig") as f:
    for r in csv.DictReader(f):
        name = (r.get("name") or "").strip()
        if not name:
            continue
        aliases = [a.strip() for a in (r.get("aliases") or "").split(";") if a.strip()]
        rows.append({
            "name": name,
            "aliases": aliases,
            "category": (r.get("category") or "").strip(),
            "applicable": (r.get("applicable") or "").strip(),
            "gst_rate": to_num(r.get("gst_rate")),
            "hsn": (r.get("hsn") or "").strip() or None,
            "source_label": (r.get("source_label") or "").strip(),
            "source_url": (r.get("source_url") or "").strip(),
            "notification": (r.get("notification") or "").strip(),
            "last_verified": (r.get("last_verified") or "").strip() or None,
            "verified": (r.get("verified") or "").strip().lower() in ("yes", "y", "true", "1"),
        })

with open(os.path.join(HERE, "data.js"), "w", encoding="utf-8") as f:
    f.write("window.GST_DATA = " + json.dumps(rows, indent=2, ensure_ascii=False) + ";\n")

print("data.js rebuilt with", len(rows), "products")
