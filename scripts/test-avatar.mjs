/**
 * Prueba de comportamiento del avatar con Chrome headless (puppeteer-core).
 * Mueve el mouse a cada zona y mide el transform real de .avatarSlide, la
 * opacidad de cada retrato y que el marco quede estático.
 *
 * Uso: node scripts/test-avatar.mjs [url]
 */
import puppeteer from "puppeteer-core";

const URL = process.argv[2] ?? "http://127.0.0.1:3100";
const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const SETTLE_MS = 1000;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function parseTranslate(transform) {
  if (!transform || transform === "none") {
    return { x: 0, y: 0 };
  }

  const match = transform.match(/matrix\(([^)]+)\)/);

  if (!match) {
    return { x: 0, y: 0 };
  }

  const parts = match[1].split(",").map(Number);

  return { x: parts[4] ?? 0, y: parts[5] ?? 0 };
}

async function measure(page) {
  return page.evaluate(() => {
    const slide = document.querySelector(".avatarSlide");
    const tilt = document.querySelector(".avatarTilt");
    const images = [...document.querySelectorAll(".avatarImage")];

    return {
      slide: slide ? getComputedStyle(slide).transform : "missing",
      tilt: tilt ? getComputedStyle(tilt).transform : "missing",
      opacities: images.map((img) => ({
        src: img.getAttribute("src"),
        opacity: Number(getComputedStyle(img).opacity)
      }))
    };
  });
}

function visibleImage(opacities) {
  return opacities.slice().sort((a, b) => b.opacity - a.opacity)[0];
}

const results = [];

function record(name, pass, detail) {
  results.push({ name, pass, detail });
  console.log(`${pass ? "PASS" : "FAIL"}  ${name}  ${detail}`);
}

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: "new",
  args: ["--no-sandbox", "--window-size=1440,900"]
});

try {
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  const consoleLogs = [];

  page.on("console", (msg) => {
    if (["error", "warning"].includes(msg.type())) {
      consoleLogs.push(`[${msg.type()}] ${msg.text().slice(0, 300)}`);
    }
  });
  page.on("pageerror", (err) => {
    consoleLogs.push(`[pageerror] ${String(err).slice(0, 300)}`);
  });

  await page.goto(URL, { waitUntil: "networkidle0", timeout: 60000 });
  await page.waitForSelector(".avatarLook", { timeout: 15000 });
  await sleep(1500);

  console.log("== consola del navegador ==");

  if (consoleLogs.length === 0) {
    console.log("(sin errores)");
  } else {
    consoleLogs.slice(0, 10).forEach((line) => console.log(line));
  }

  console.log(
    "== primera imagen (style inline = Motion hidratado) =="
  );

  console.log(
    await page.evaluate(() => document.querySelector(".avatarImage")?.outerHTML.slice(0, 220))
  );
  console.log();

  const avatarHandle = await page.$(".avatarLook");

  if (!avatarHandle) {
    throw new Error("No se encontró .avatarLook en la página");
  }

  const avatar = await avatarHandle.boundingBox();
  const cx = avatar.x + avatar.width / 2;
  const cy = avatar.y + avatar.height / 2;

  async function moveAndSettle(x, y) {
    await page.mouse.move(x, y, { steps: 12 });
    await sleep(SETTLE_MS);
    return measure(page);
  }

  // 0) Estado inicial: marco estático y retrato central visible.
  let m = await measure(page);
  record(
    "marco estático",
    m.tilt === "none",
    `tilt=${m.tilt}`
  );
  record(
    "retrato inicial = center",
    visibleImage(m.opacities).src.includes("center"),
    `visible=${visibleImage(m.opacities).src}`
  );

  // 1) Mouse a la derecha: la foto debe ir a la IZQUIERDA (slideX<0)
  //    y el retrato visible debe ser el que mira a la derecha.
  m = await moveAndSettle(cx + 160, cy);
  const right = parseTranslate(m.slide);
  record(
    "mouse derecha → slideX negativo",
    right.x < -8,
    `translateX=${right.x.toFixed(1)}`
  );
  record(
    "mouse derecha → mirada right",
    visibleImage(m.opacities).src.includes("right"),
    `visible=${visibleImage(m.opacities).src}`
  );

  // 2) Mouse a la izquierda: slideX>0 y retrato left.
  m = await moveAndSettle(cx - 160, cy);
  const left = parseTranslate(m.slide);
  record(
    "mouse izquierda → slideX positivo",
    left.x > 8,
    `translateX=${left.x.toFixed(1)}`
  );
  record(
    "mouse izquierda → mirada left",
    visibleImage(m.opacities).src.includes("left"),
    `visible=${visibleImage(m.opacities).src}`
  );

  // 3) Mouse abajo sostenido: retrato down.
  m = await moveAndSettle(cx, cy + 150);
  record(
    "mouse abajo → mirada down",
    visibleImage(m.opacities).src.includes("down"),
    `visible=${visibleImage(m.opacities).src}`
  );

  // 4) Vuelta al centro: retrato center y slide ~0.
  m = await moveAndSettle(cx, cy);
  const back = parseTranslate(m.slide);
  record(
    "retorno al centro → mirada center",
    visibleImage(m.opacities).src.includes("center"),
    `visible=${visibleImage(m.opacities).src}`
  );
  record(
    "retorno al centro → slide ~0",
    Math.abs(back.x) < 6 && Math.abs(back.y) < 6,
    `x=${back.x.toFixed(1)} y=${back.y.toFixed(1)}`
  );

  // 5) Radio de respuesta: a 130px ya debe moverse visiblemente.
  m = await moveAndSettle(cx + 130, cy);
  const near = parseTranslate(m.slide);
  record(
    "respuesta a 130px",
    Math.abs(near.x) > 8,
    `translateX=${near.x.toFixed(1)}`
  );

  // 6) El marco nunca se transforma (solo el retrato interno se mueve).
  m = await measure(page);
  record("marco sigue estático tras movimientos", m.tilt === "none", `tilt=${m.tilt}`);
} finally {
  await browser.close();
}

const failed = results.filter((r) => !r.pass);

console.log(`\n${results.length - failed.length}/${results.length} pruebas pasaron`);

if (failed.length > 0) {
  process.exit(1);
}
