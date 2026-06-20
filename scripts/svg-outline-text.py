#!/usr/bin/env python3
"""Generate SVG outline paths from text and a local font file.

This is a development helper for turning font-rendered text into inline SVG
geometry, similar to Illustrator's "Create Outlines". It is not imported by the
app and is not part of the Vite bundle.

Install the only required Python package locally when needed. Do not commit the
installed package or any generated cache:
  python -m pip install fonttools

Example:
  python scripts/svg-outline-text.py "载入秋色" ^
    --font "%LOCALAPPDATA%/Microsoft/Windows/Fonts/SourceHanSerif.ttc" ^
    --face-name "Source Han Serif SC" ^
    --weight Bold ^
    --font-size 120 ^
    --format vue
"""

from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")
    sys.stderr.reconfigure(encoding="utf-8")

try:
    from fontTools.varLib.instancer import instantiateVariableFont
    from fontTools.pens.svgPathPen import SVGPathPen
    from fontTools.pens.transformPen import TransformPen
    from fontTools.ttLib import TTCollection, TTFont
except ModuleNotFoundError:
    sys.exit(
        "Missing dependency: fonttools\n"
        "Install it locally with: python -m pip install fonttools\n"
        "Do not commit the installed dependency or generated caches."
    )


def decode_name(record) -> str:
    try:
        return record.toUnicode()
    except UnicodeDecodeError:
        return ""


def font_names(font: TTFont) -> set[str]:
    names = set()
    for record in font["name"].names:
        if record.nameID in (1, 2, 4, 16, 17):
            value = decode_name(record).strip()
            if value:
                names.add(value)
    return names


def numeric_weight(weight: str | None) -> float | None:
    if not weight:
        return None

    try:
        return float(weight)
    except ValueError:
        return None


def apply_variable_weight(font: TTFont, weight: str | None) -> TTFont:
    weight_value = numeric_weight(weight)

    if weight_value is None or "fvar" not in font:
        return font

    axes = {axis.axisTag: axis for axis in font["fvar"].axes}
    weight_axis = axes.get("wght")

    if not weight_axis:
        return font

    clamped_weight = min(max(weight_value, weight_axis.minValue), weight_axis.maxValue)
    return instantiateVariableFont(font, {"wght": clamped_weight}, inplace=False)


def load_font(
    font_path: Path,
    face_index: int | None,
    face_name: str | None,
    weight: str | None,
) -> TTFont:
    if font_path.suffix.lower() not in {".ttc", ".otc"}:
        return apply_variable_weight(TTFont(font_path), weight)

    collection = TTCollection(font_path)

    if face_name:
        for font in collection.fonts:
            names = font_names(font)
            if face_name not in names:
                continue

            if not weight or weight in names or f"{face_name} {weight}" in names:
                return apply_variable_weight(font, weight)

        available = sorted({name for font in collection.fonts for name in font_names(font)})
        weight_message = f" with weight {weight!r}" if weight else ""
        raise SystemExit(
            f"Face name not found: {face_name}{weight_message}\n"
            f"Available names include:\n  " + "\n  ".join(available[:80])
        )

    if face_index is None:
        raise SystemExit("TTC/OTC fonts require --face-index or --face-name")

    try:
        return apply_variable_weight(collection.fonts[face_index], weight)
    except IndexError as error:
        raise SystemExit(f"Face index out of range: {face_index}") from error


def glyph_outline(font: TTFont, character: str, x: float, baseline: float, scale: float) -> str:
    glyph_set = font.getGlyphSet()
    cmap = font.getBestCmap()
    glyph_name = cmap.get(ord(character))

    if glyph_name is None:
        raise SystemExit(f"Font does not contain character: {character!r}")

    pen = SVGPathPen(glyph_set)
    transform_pen = TransformPen(pen, (scale, 0, 0, -scale, x, baseline))
    glyph_set[glyph_name].draw(transform_pen)
    return pen.getCommands()


def generate_outlines(args: argparse.Namespace) -> tuple[list[dict[str, str]], float]:
    font = load_font(args.font, args.face_index, args.face_name, args.weight)
    cmap = font.getBestCmap()
    hmtx = font["hmtx"]
    scale = args.size / font["head"].unitsPerEm
    cursor = args.x
    outlines = []

    for index, character in enumerate(args.text):
        glyph_name = cmap.get(ord(character))
        if glyph_name is None:
            raise SystemExit(f"Font does not contain character: {character!r}")

        outlines.append(
            {
                "id": f"glyph-{index}",
                "char": character,
                "d": glyph_outline(font, character, cursor, args.baseline, scale),
            }
        )
        cursor += hmtx[glyph_name][0] * scale + args.gap

    return outlines, cursor


def print_vue(outlines: list[dict[str, str]], colors: list[str]) -> None:
    print("const glyphs = [")
    for index, outline in enumerate(outlines):
        color = colors[index % len(colors)]
        print("  {")
        print(f"    id: {json.dumps(outline['id'])},")
        print(f"    color: {color},")
        print(f"    d: {json.dumps(outline['d'], ensure_ascii=False)}")
        print("  }," if index < len(outlines) - 1 else "  }")
    print("];")


def print_svg(outlines: list[dict[str, str]], width: float, height: float) -> None:
    print(f'<svg viewBox="0 0 {width:.2f} {height:.2f}" xmlns="http://www.w3.org/2000/svg">')
    for outline in outlines:
        print(f'  <path d={json.dumps(outline["d"], ensure_ascii=False)} />')
    print("</svg>")


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("text", help="Text to convert into SVG outlines")
    parser.add_argument("--font", required=True, type=Path, help="Path to .ttf, .otf, .ttc, or .otc")
    parser.add_argument("--face-name", help="Face name inside a TTC/OTC, e.g. 'Source Han Serif SC'")
    parser.add_argument("--face-index", type=int, help="Face index inside a TTC/OTC")
    weight_group = parser.add_mutually_exclusive_group()
    weight_group.add_argument(
        "--weight",
        help="Face weight name inside a TTC/OTC, or numeric variable-font wght value, e.g. Bold, 700",
    )
    weight_group.add_argument("--bold", action="store_const", const="Bold", dest="weight")
    parser.add_argument(
        "--font-size",
        "--size",
        dest="size",
        type=float,
        default=120,
        help="Glyph size in SVG units",
    )
    parser.add_argument("--x", type=float, default=20, help="Initial x position")
    parser.add_argument("--baseline", type=float, default=116, help="SVG baseline y position")
    parser.add_argument("--gap", type=float, default=8, help="Extra gap between glyph advances")
    parser.add_argument("--height", type=float, default=140, help="SVG viewBox height for --format svg")
    parser.add_argument("--format", choices=("vue", "svg", "json"), default="vue")
    parser.add_argument(
        "--colors",
        default="colors[1],colors[9],colors[4],colors[6]",
        help="Comma-separated Vue expressions used by --format vue",
    )
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    outlines, width = generate_outlines(args)

    if args.format == "vue":
        print_vue(outlines, [color.strip() for color in args.colors.split(",") if color.strip()])
    elif args.format == "svg":
        print_svg(outlines, width + args.x, args.height)
    else:
        print(json.dumps(outlines, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
