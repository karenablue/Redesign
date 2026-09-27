/**
 * Site motion, kept deliberately small (see the "Motion" block in
 * global.css for the visual side).
 *
 * Scroll reveals: an element marked `data-reveal` rises and fades in the
 * first time it scrolls into view; `data-reveal-stagger` does the same for
 * its children, one after another. Only elements that start BELOW the first
 * screen are ever hidden, so nothing a visitor sees on arrival flickers, and
 * the page's largest paint is never delayed. Without JavaScript, or with
 * reduced motion requested, everything simply shows.
 *
 * Count-ups: an element marked `data-count` whose text is a figure such as
 * "100,000+" or "$7,450,200" counts up from zero when it scrolls into view.
 * Screen readers are given the final figure straight away.
 */
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function setUpReveals() {
  const targets = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
  if (!targets.length || !("IntersectionObserver" in window)) return;

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add("is-revealed");
        observer.unobserve(entry.target);
      }
    },
    { rootMargin: "0px 0px -10% 0px" }
  );

  for (const el of targets) {
    if (el.getBoundingClientRect().top < window.innerHeight) continue;
    if (el.hasAttribute("data-reveal-stagger")) {
      Array.from(el.children).forEach((child, i) =>
        (child as HTMLElement).style.setProperty("--reveal-i", String(Math.min(i, 8)))
      );
    }
    el.classList.add("reveal-pending");
    observer.observe(el);
  }
}

function setUpCounts() {
  const counters = Array.from(document.querySelectorAll<HTMLElement>("[data-count]"));
  if (!counters.length || !("IntersectionObserver" in window)) return;

  const run = (el: HTMLElement) => {
    const text = el.textContent?.trim() ?? "";
    const match = text.match(/^(\D*)([\d,]+)(\D*)$/);
    if (!match) return;
    const [, before, digits, after] = match;
    const target = Number(digits.replace(/,/g, ""));
    if (!Number.isFinite(target) || target < 10) return;

    // The final figure for screen readers; the moving one is hidden from them.
    const spoken = document.createElement("span");
    spoken.className = "visually-hidden";
    spoken.textContent = text;
    const shown = document.createElement("span");
    shown.setAttribute("aria-hidden", "true");
    el.replaceChildren(spoken, shown);

    const duration = 1400;
    const start = performance.now();
    const format = (n: number) => `${before}${n.toLocaleString("en-US")}${after}`;
    const frame = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      shown.textContent = format(Math.round(target * eased));
      if (t < 1) requestAnimationFrame(frame);
      else shown.textContent = format(target);
    };
    shown.textContent = format(0);
    requestAnimationFrame(frame);
  };

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        observer.unobserve(entry.target);
        run(entry.target as HTMLElement);
      }
    },
    { threshold: 0.6 }
  );
  // Like the reveals, only figures that start below the first screen count
  // up; one already on screen would flash its final value first.
  for (const el of counters) {
    if (el.getBoundingClientRect().top < window.innerHeight) continue;
    observer.observe(el);
  }
}

if (!reduceMotion) {
  setUpReveals();
  setUpCounts();
}
