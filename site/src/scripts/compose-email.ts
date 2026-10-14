/**
 * Turns a <form data-compose> into a pre-filled email, so inquiry forms work
 * on a static site with no server.
 *
 *   <form data-compose action="mailto:help@sgrho1922.org"
 *         data-subject="Media Inquiry" data-subject-field="mf-outlet">
 *
 * Every field with a `data-label` becomes a "Label: value" line in the body
 * (checkbox groups join their checked values); a field marked
 * `data-body` is appended last as free text. `data-subject-field` names a
 * field whose value is added to the subject. Without JavaScript the form
 * still posts to its mailto: action as text/plain.
 */
export function wireComposeForms(root: ParentNode = document) {
  root.querySelectorAll<HTMLFormElement>("form[data-compose]").forEach((form) => {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!form.reportValidity()) return;

      const lines: string[] = [];
      const seen = new Set<string>();
      form
        .querySelectorAll<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>(
          "[data-label]"
        )
        .forEach((el) => {
          const label = el.dataset.label!;
          if (seen.has(label)) return;
          seen.add(label);
          let value: string;
          if (el instanceof HTMLInputElement && el.type === "checkbox") {
            value = [
              ...form.querySelectorAll<HTMLInputElement>(`input[data-label="${label}"]:checked`),
            ]
              .map((c) => c.value)
              .join(", ");
          } else {
            value = el.value.trim();
          }
          lines.push(`${label}: ${value || "Not specified"}`);
        });
      const body = form.querySelector<HTMLTextAreaElement>("[data-body]")?.value.trim();
      if (body) lines.push("", body);

      const extra = form.dataset.subjectField
        ? (form
            .querySelector<HTMLInputElement | HTMLSelectElement>(`#${form.dataset.subjectField}`)
            ?.value.trim() ?? "")
        : "";
      const subject = [form.dataset.subject ?? "Inquiry", extra].filter(Boolean).join(": ");
      const to = form.getAttribute("action")!.replace(/^mailto:/, "");
      location.href = `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join("\n"))}`;
    });
  });
}
