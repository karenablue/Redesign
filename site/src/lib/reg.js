/**
 * Render a string with any ® set as a small raised mark.
 *
 * Registered marks (FY2027 brand register) carry ® at their first prominent
 * use on a page. At display sizes a full-size ® is heavy, so headings, labels
 * and buttons use this; running body copy can keep the plain character.
 * Escapes the text first, so the result is safe for `set:html`.
 */
export function reg(text = "") {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/\u00ae/g, '<sup class="reg">&reg;</sup>');
}
