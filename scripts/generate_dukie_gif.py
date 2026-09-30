from __future__ import annotations

import math
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont


ROOT = Path(__file__).resolve().parents[1]
OUT_DIR = ROOT / "public" / "animations"
OUT_GIF = OUT_DIR / "dukie-timeline.gif"
OUT_POSTER = OUT_DIR / "dukie-timeline-poster.png"

W, H = 720, 420
FRAMES = 72
DURATION_MS = 50


def font(size: int, bold: bool = False) -> ImageFont.FreeTypeFont | ImageFont.ImageFont:
    candidates = [
        "C:/Windows/Fonts/arialbd.ttf" if bold else "C:/Windows/Fonts/arial.ttf",
        "C:/Windows/Fonts/segoeuib.ttf" if bold else "C:/Windows/Fonts/segoeui.ttf",
    ]
    for candidate in candidates:
        try:
            return ImageFont.truetype(candidate, size)
        except OSError:
            pass
    return ImageFont.load_default()


TITLE_FONT = font(30, True)
BODY_FONT = font(24, True)
TAG_FONT = font(15, True)


def rounded(draw: ImageDraw.ImageDraw, box, radius, fill, outline=None, width=1):
    draw.rounded_rectangle(box, radius=radius, fill=fill, outline=outline, width=width)


def ellipse(draw: ImageDraw.ImageDraw, box, fill, outline=None, width=1):
    draw.ellipse(box, fill=fill, outline=outline, width=width)


def draw_sparkle(draw: ImageDraw.ImageDraw, x: float, y: float, scale: float, color):
    points = [
        (x, y - 9 * scale),
        (x + 3 * scale, y - 3 * scale),
        (x + 9 * scale, y),
        (x + 3 * scale, y + 3 * scale),
        (x, y + 9 * scale),
        (x - 3 * scale, y + 3 * scale),
        (x - 9 * scale, y),
        (x - 3 * scale, y - 3 * scale),
    ]
    draw.polygon(points, fill=color)


def draw_duck(frame: Image.Image, t: float):
    draw = ImageDraw.Draw(frame)
    walk = math.sin(t * math.tau)
    bob = math.sin(t * math.tau * 2) * 5
    x = 118 + math.sin(t * math.tau) * 8
    y = 254 + bob

    # soft shadow
    ellipse(draw, (x - 4, y + 90, x + 170, y + 110), (219, 39, 119, 45))

    # feet behind/body
    left_foot_x = x + 48 + walk * 14
    right_foot_x = x + 100 - walk * 14
    rounded(draw, (left_foot_x - 28, y + 89, left_foot_x + 28, y + 101), 8, (251, 177, 61))
    rounded(draw, (right_foot_x - 28, y + 89, right_foot_x + 28, y + 101), 8, (251, 177, 61))
    draw.line((x + 61, y + 72, left_foot_x, y + 91), fill=(251, 177, 61), width=5)
    draw.line((x + 111, y + 72, right_foot_x, y + 91), fill=(251, 177, 61), width=5)

    # body and belly
    ellipse(draw, (x + 38, y + 24, x + 160, y + 96), (244, 114, 182), (190, 24, 93), 3)
    ellipse(draw, (x + 74, y + 42, x + 150, y + 95), (249, 168, 212))

    # wing
    wing_angle = math.sin(t * math.tau * 2) * 10
    wing = [
        (x + 96, y + 48),
        (x + 146, y + 56 + wing_angle * 0.4),
        (x + 116, y + 79),
        (x + 83, y + 70),
    ]
    draw.polygon(wing, fill=(219, 39, 119), outline=(190, 24, 93))

    # head
    ellipse(draw, (x + 7, y + 3, x + 82, y + 72), (249, 168, 212), (190, 24, 93), 3)
    # beak
    draw.polygon([(x + 4, y + 36), (x - 34, y + 47), (x + 3, y + 56)], fill=(251, 177, 61), outline=(217, 119, 6))

    # eye and wink
    if 0.72 < t < 0.84:
        draw.arc((x + 48, y + 27, x + 66, y + 39), 0, 180, fill=(15, 23, 42), width=3)
    else:
        ellipse(draw, (x + 54, y + 28, x + 65, y + 39), (15, 23, 42))
        ellipse(draw, (x + 58, y + 30, x + 62, y + 34), (255, 255, 255))
    ellipse(draw, (x + 34, y + 45, x + 48, y + 57), (244, 114, 182, 180))

    # bow
    bow_y = y - 3 + math.sin(t * math.tau * 2) * 2
    draw.polygon([(x + 35, bow_y + 10), (x + 9, bow_y - 1), (x + 12, bow_y + 21)], fill=(236, 72, 153), outline=(190, 24, 93))
    draw.polygon([(x + 43, bow_y + 10), (x + 69, bow_y - 1), (x + 66, bow_y + 21)], fill=(236, 72, 153), outline=(190, 24, 93))
    ellipse(draw, (x + 33, bow_y + 5, x + 46, bow_y + 18), (251, 207, 232), (190, 24, 93), 2)

    # name tag
    tag_box = (x + 83, y + 78, x + 148, y + 102)
    rounded(draw, tag_box, 10, (255, 255, 255), (236, 72, 153), 2)
    draw.text((x + 96, y + 81), "Dukie", font=TAG_FONT, fill=(219, 39, 119))

    # tiny motion lines
    for i in range(3):
        offset = (i * 18 + t * 26) % 54
        draw.arc((x - 62 - offset, y + 50 + i * 9, x - 28 - offset, y + 63 + i * 9), 200, 340, fill=(244, 114, 182, 130), width=3)


def draw_frame(i: int) -> Image.Image:
    t = i / FRAMES
    img = Image.new("RGBA", (W, H), (255, 255, 255, 0))
    draw = ImageDraw.Draw(img)

    # background
    for yy in range(H):
        mix = yy / H
        r = int(255 * (1 - mix) + 252 * mix)
        g = int(247 * (1 - mix) + 231 * mix)
        b = int(252 * (1 - mix) + 243 * mix)
        draw.line((0, yy, W, yy), fill=(r, g, b, 255))
    for sx, sy, sc in [(610, 80, 1.0), (640, 270, 0.7), (60, 96, 0.7), (520, 330, 0.55)]:
        pulse = 0.75 + 0.25 * math.sin(t * math.tau * 2 + sx)
        draw_sparkle(draw, sx, sy, sc * pulse, (236, 72, 153, 145))

    # speech bubble
    rounded(draw, (260, 70, 664, 250), 28, (255, 255, 255, 245), (236, 72, 153, 210), 4)
    draw.polygon([(292, 236), (232, 284), (314, 247)], fill=(255, 255, 255, 245), outline=(236, 72, 153, 210))
    draw.text((292, 94), "Hey, there!", font=TITLE_FONT, fill=(190, 24, 93))
    draw.text((292, 136), "Let me take through", font=BODY_FONT, fill=(51, 65, 85))
    draw.text((292, 171), "my mommy's timeline.", font=BODY_FONT, fill=(51, 65, 85))

    # timeline trail
    draw.line((108, 60, 108, 356), fill=(236, 72, 153, 120), width=5)
    for k, year in enumerate(["2023", "2024", "2025", "2026"]):
        cy = 92 + k * 72
        ellipse(draw, (93, cy - 15, 123, cy + 15), (255, 255, 255), (236, 72, 153), 3)
        draw.text((45, cy - 10), year, font=TAG_FONT, fill=(190, 24, 93))

    draw_duck(img, t)
    return img.convert("P", palette=Image.Palette.ADAPTIVE, colors=128)


def main() -> None:
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    frames = [draw_frame(i) for i in range(FRAMES)]
    frames[0].save(
        OUT_GIF,
        save_all=True,
        append_images=frames[1:],
        duration=DURATION_MS,
        loop=0,
        optimize=True,
        disposal=2,
    )
    frames[0].convert("RGBA").save(OUT_POSTER)
    print(OUT_GIF)
    print(OUT_POSTER)


if __name__ == "__main__":
    main()
