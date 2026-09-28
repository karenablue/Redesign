/**
 * Makes the right-sized WebP copies the page openings (PageHero) use, from
 * the originals in public/images. Run by hand after adding or swapping a
 * hero photo:  node scripts/optimize-heroes.mjs
 *
 * PageHero shows its photo across the right ~60% of a 1440px band at most,
 * so 1200px wide is enough for a sharp picture. Each image also gets a
 * 640px copy (name-640.webp) that phones load instead, through srcset, to
 * stay inside the slow-phone budget. Smaller originals are not enlarged.
 * The portrait grids at the end build one image from several archival portraits.
 */
import sharp from "sharp";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const src = (f) => join(root, "public", "images", f);
const out = (f) => join(root, "public", "optimized", f);

const HEROES = {
  "hero-charter.webp": "sgr-alpha-charter.jpeg",
  "hero-ug-sorors.webp": "ug sorors 5.jpg",
  "hero-alumnae-sorors.webp": "alumnae sorors 3.jfif",
  "hero-beta-psi-sigma.webp": "Beta Psi Sigma.jpg",
  "hero-philos.webp": "Boule Philos.jpg",
  "hero-swim-1922.webp": "swim-1922-2-768x432.jpg",
  "hero-youth-symposium.webp": "youth-symposium-2-768x432.jpg",
  "hero-bigbookbag.webp": "operation-bigbookbag-2.jpg",
  "hero-capitol-hill.webp": "Congressional Day on the Hill 2.jpg",
  "hero-capitol-steps.webp": "Congressional Day on the Hill.jpg",
  "hero-lambda-psi.webp": "lambda-psi-1200.jpg",
  "hero-photoshoot.webp": "SGRho Photoshoot.jfif",
  "hero-alumnae-professional.webp": "alumnae sorors 2.jfif",
  "hero-grand-basileus.webp": "international-grand-basileus-marica-harris-704x1024.jpg",
  // The 2026 International Board on stage at the 61st Boulé (sgrho1922.org).
  "hero-board-boule.webp": "live-2026/International-Board-of-Directors-2026-1.webp",
  // Frames from HQ's own 61st Boulé recap films (boule-2026/SOURCES.md).
  "home-boule-plenary.webp": "boule-2026/plenary-crowd.jpg",
  "home-bigbookbag-boule.webp": "boule-2026/bigbookbag-impact-day.jpg",
  "hero-boule-marquee.webp": "boule-2026/marquee.jpg",
  "hero-boule-gathering.webp": "boule-2026/waterfront-gathering.jpg",
  // Closing-band (CtaBand) photographs, one per page, from the same films.
  "cta-procession.webp": "boule-2026/sash-procession.jpg",
  "cta-cultured-pearls.webp": "boule-2026/cultured-pearls.jpg",
  "cta-impact-packing.webp": "boule-2026/impact-day-packing.jpg",
  "cta-welcome.webp": "boule-2026/registration-welcome.jpg",
  "cta-sorors-photo.webp": "boule-2026/sorors-photo.jpg",
  "cta-choir.webp": "boule-2026/choir.jpg",
  "cta-waterfront.webp": "boule-2026/waterfront-rhoer.jpg",
  "cta-undergraduates.webp": "boule-2026/undergraduates.jpg",
  "cta-reception.webp": "boule-2026/reception-dance.jpg",
  "cta-impact-partner.webp": "boule-2026/impact-day-partner.jpg",
  "cta-plenary-dance.webp": "boule-2026/plenary-dance.jpg",
};

// Writes the full-size and phone-size copies of one image.
async function save(name, input) {
  for (const [file, width, quality] of [
    [name, 1200, 72],
    [name.replace(/\.webp$/, "-640.webp"), 640, 56],
  ]) {
    const info = await sharp(input)
      .resize({ width, withoutEnlargement: true })
      .webp({ quality })
      .toFile(out(file));
    console.log(`${file}  ${info.width}x${info.height}  ${Math.round(info.size / 1024)}KB`);
  }
}

for (const [name, file] of Object.entries(HEROES)) {
  await save(name, await sharp(src(file)).rotate().toBuffer());
}

// Portrait grids: several portraits in rows as one image shaped like the
// photo area (about 2:1 to 3:2), so none is cropped away. Greyscale for the
// archival pages; `{ colour: true }` for present-day leadership and staff.
async function portraits(name, files, cols, { colour = false } = {}) {
  const W = 240;
  const H = 300;
  const rows = Math.ceil(files.length / cols);
  const tiles = await Promise.all(
    files.map((f) =>
      (colour ? sharp(src(f)).rotate() : sharp(src(f)).rotate().grayscale())
        .resize(W, H, { fit: "cover", position: "top" })
        .toBuffer()
    )
  );
  const grid = await sharp({
    create: { width: W * cols, height: H * rows, channels: 3, background: "#081633" },
  })
    .composite(
      tiles.map((input, i) => {
        const row = Math.floor(i / cols);
        // A short last row is centred.
        const inRow = row === rows - 1 ? files.length - row * cols : cols;
        const offset = ((cols - inRow) * W) / 2;
        return { input, left: Math.round(offset + (i % cols) * W), top: row * H };
      })
    )
    .png()
    .toBuffer();
  await save(name, grid);
}

// The seven Founders.
await portraits(
  "hero-founders.webp",
  [
    "our-founders-mary-lou-allison.jpg",
    "our-founders-dorothy-hanley-whiteside.jpg",
    "our-founders-vivian-irene-white.jpg",
    "our-founders-nannie-mae-gahn-johnson-300x300.jpg",
    "our-founders-hattie-mae-redford-300x300.jpg",
    "our-founders-bessie-mae-downey-rhoades-300x300.jpg",
    "our-founders-cubena-mcclure-300x300.jpg",
  ],
  4
);
// The seven Founders side by side, as the texture inside the homepage's
// photo-filled 1922: narrow greyscale crops, so every face falls in view.
{
  const founders = [
    "our-founders-mary-lou-allison.jpg",
    "our-founders-dorothy-hanley-whiteside.jpg",
    "our-founders-vivian-irene-white.jpg",
    "our-founders-nannie-mae-gahn-johnson-300x300.jpg",
    "our-founders-hattie-mae-redford-300x300.jpg",
    "our-founders-bessie-mae-downey-rhoades-300x300.jpg",
    "our-founders-cubena-mcclure-300x300.jpg",
  ];
  const [w, h] = [300, 630];
  const tiles = await Promise.all(
    founders.map((f) =>
      sharp(src(f)).rotate().resize({ width: w, height: h, fit: "cover", position: "attention" })
        .greyscale().normalise().toBuffer()
    )
  );
  const strip = await sharp({ create: { width: w * founders.length, height: h, channels: 3, background: "#777" } })
    .composite(tiles.map((input, i) => ({ input, left: i * w, top: 0 })))
    .png()
    .toBuffer();
  await sharp(strip).webp({ quality: 70 }).toFile(out("founders-strip.webp"));
  await sharp(strip).resize({ width: 1050 }).webp({ quality: 66 }).toFile(out("founders-strip-1050.webp"));
  console.log("founders-strip.webp  2100x630, founders-strip-1050.webp  1050x315");
}
// Notable Sigmas of the early century (credited on the Notable Sigmas page).
await portraits(
  "hero-notable.webp",
  [
    "notable/hattie-mcdaniel.jpg",
    "notable/alice-allison-dunnigan.jpg",
    "notable/eva-jessye.jpg",
    "notable/era-bell-thompson.jpg",
    "notable/louise-beavers.jpg",
    "notable/lucille-baldwin-brown.jpg",
  ],
  3
);
// The first eight Grand Basilei, in order of service.
await portraits(
  "hero-past-basilei.webp",
  [
    "our-founders-mary-lou-allison.jpg",
    "past-grand-basilei-edith-marlone-ward.jpg",
    "past-grand-basilei-fannie-o-bannon.jpg",
    "past-grand-basilei-edith-roache-walker-300x300.jpg",
    "past-grand-basilei-bertha-black-rhoda-300x300.jpg",
    "past-grand-basilei-ethel-ross-smith-300x300.jpg",
    "past-grand-basilei-sallie-edwards-johnson-300x300.jpg",
    "past-grand-basilei-edna-douglas-300x300.jpg",
  ],
  4
);
// The five Syntaktes (Regional Directors): Central, Northeastern,
// Southeastern, Southwestern, Western.
await portraits(
  "hero-regional.webp",
  [
    "regional-leadership-central-syntaktes.jpg",
    "regional-leadership-northeastern-syntaktes-300x300.jpg",
    "regional-leadership-southeastern-syntaktes-300x300.jpg",
    "regional-leadership-southwestern-syntaktes-300x300.jpg",
    "regional-leadership-western-syntaktes-300x300.jpg",
  ],
  3,
  { colour: true }
);
// International Corporate Headquarters: the Executive Director and the team.
await portraits(
  "hero-ichq.webp",
  [
    "ichq/karen-w-headshot-2024.jpg",
    "ichq/amy-headshot-2024.webp",
    "ichq/gwen-headshot-2024.jpg",
    "ichq/asha-headshot-2024.jpg",
    "ichq/karya-headshot-2024.jpg",
    "ichq/nicole-headshot-2024.jpg",
    "ichq/juneann-headshot-2024.jpg",
    "ichq/joshua-headshot-2025.jpg",
  ],
  4,
  { colour: true }
);

// The homepage cover and its then-and-now pairs. The cover runs full width,
// so it gets a 1920px copy for large screens and a 900px copy for phones.
async function wide(name, file, widths, { grey = false } = {}) {
  for (const [suffix, width, quality] of widths) {
    // trim: scanned archival prints carry a white border.
    let p = sharp(src(file)).rotate();
    if (grey) p = sharp(await p.trim({ background: "#ffffff", threshold: 40 }).toBuffer());
    p = p.resize({ width, withoutEnlargement: true });
    if (grey) p = p.grayscale();
    const info = await p.webp({ quality }).toFile(out(name.replace(/\.webp$/, `${suffix}.webp`)));
    console.log(`${name.replace(/\.webp$/, `${suffix}.webp`)}  ${info.width}x${info.height}  ${Math.round(info.size / 1024)}KB`);
  }
}
await wide("home-cover.webp", "Beta Alpha.jpg", [["", 1920, 66], ["-900", 900, 62], ["-640", 640, 56]]);
await wide("home-join.webp", "live-2026/sigma-gamma-rho-join.webp", [["", 1600, 68]]);
await wide("home-butler.webp", "College Avenue Campus.jpg", [["", 800, 72]], { grey: true });
await wide("home-charter.webp", "sgr-alpha-charter.jpeg", [["", 768, 72]], { grey: true });
await wide("home-boule-stage.webp", "live-2026/International-Board-of-Directors-2026-2.webp", [["", 960, 72]]);

// Full-width page covers (PageHero `cover`): the original width, plus a
// 640px phone copy.
await wide("cover-ug-sorors.webp", "ug sorors 5.jpg", [["", 1440, 68], ["-640", 640, 58]]);
await wide("cover-beta-psi-sigma.webp", "Beta Psi Sigma.jpg", [["", 1365, 68], ["-640", 640, 58]]);
