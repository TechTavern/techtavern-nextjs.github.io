#!/usr/bin/env bash
# Emit a frequency table of every tag currently used across content/articles/*.mdx.
# Run from the repo root. Output groups raw variants by kebab-normalized form so you
# can see when the same concept appears under multiple casings.
set -euo pipefail

ARTICLES_DIR="${1:-content/articles}"

if [ ! -d "$ARTICLES_DIR" ]; then
  echo "error: directory not found: $ARTICLES_DIR" >&2
  echo "run this from the repo root, or pass the articles dir as arg 1" >&2
  exit 1
fi

python3 - "$ARTICLES_DIR" <<'PY'
import os
import re
import sys
from collections import Counter, defaultdict

articles_dir = sys.argv[1]


def kebab(tag: str) -> str:
    """Normalize a tag to lowercase-kebab-case for grouping. Idempotent."""
    s = tag.strip().lower()
    s = re.sub(r"[^a-z0-9]+", "-", s)
    s = re.sub(r"-+", "-", s).strip("-")
    return s


def parse_frontmatter_tags(text: str) -> list[str]:
    """Pull tags out of a YAML frontmatter block. Handles both list and inline-array forms."""
    m = re.match(r"^---\s*\n(.*?)\n---\s*\n", text, re.DOTALL)
    if not m:
        return []
    fm = m.group(1)
    tags: list[str] = []

    # Inline form: tags: ["a", "b"] or tags: [a, b, c]
    inline = re.search(r"^tags\s*:\s*\[(.*?)\]\s*$", fm, re.MULTILINE)
    if inline:
        parts = inline.group(1).split(",")
        for p in parts:
            t = p.strip().strip('"').strip("'")
            if t:
                tags.append(t)
        return tags

    # Block list form:
    #   tags:
    #     - foo
    #     - "bar baz"
    block = re.search(r"^tags\s*:\s*\n((?:[ \t]+-[^\n]*\n?)+)", fm, re.MULTILINE)
    if block:
        for line in block.group(1).splitlines():
            mm = re.match(r"\s*-\s*(.+?)\s*$", line)
            if mm:
                t = mm.group(1).strip().strip('"').strip("'")
                if t:
                    tags.append(t)
    return tags


raw_counter: Counter[str] = Counter()
variants_by_kebab: dict[str, set[str]] = defaultdict(set)

for name in sorted(os.listdir(articles_dir)):
    if not name.endswith(".mdx"):
        continue
    path = os.path.join(articles_dir, name)
    with open(path, "r", encoding="utf-8") as f:
        text = f.read()
    for tag in parse_frontmatter_tags(text):
        raw_counter[tag] += 1
        variants_by_kebab[kebab(tag)].add(tag)

kebab_counts = Counter()
for kebab_form, variants in variants_by_kebab.items():
    kebab_counts[kebab_form] = sum(raw_counter[v] for v in variants)

print(f"# Tag catalog — {sum(raw_counter.values())} tag uses across articles in {articles_dir}\n")
print("## By kebab-normalized form (canonical, sorted by frequency)\n")
for kebab_form, total in kebab_counts.most_common():
    variants = sorted(variants_by_kebab[kebab_form])
    breakdown = ", ".join(f'"{v}" x{raw_counter[v]}' for v in variants)
    print(f"  {total:>3}  {kebab_form}    [{breakdown}]")

inconsistent = [k for k, v in variants_by_kebab.items() if len(v) > 1]
if inconsistent:
    print("\n## Tags with multiple casing variants (consider canonicalizing in old articles)\n")
    for k in sorted(inconsistent):
        variants = sorted(variants_by_kebab[k])
        print(f"  {k}  =>  {variants}")
PY
