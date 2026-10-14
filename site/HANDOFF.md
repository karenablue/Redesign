# SGRho national website handoff

The Astro site in `site/` builds as static HTML. The repository root also
contains the `images/` source library and an older Figma export. Keep the full
repository together when transferring the source. The published artifact is
`site/dist/`, which includes the images needed by the site.

## Build and review

Use Node.js 22.12 or newer. From `site/`:

```sh
npm ci
npm run check
npm run build
npx playwright test --project=desktop --project=mobile
npm run lint
npm run format:check
```

`npm run build` links `site/public/images` to the repository root's `images/`
folder before building. Do not transfer `site/` alone as the editable source.
Open the built site through `npm run preview`, not by opening an HTML file from
disk. Review the public pages at phone, tablet, and desktop widths.

## Account and deployment setup

1. Create the GitHub repository and Cloudflare Pages project in accounts owned
   by Sigma Gamma Rho. Give the designated HQ staff and Karena the access they
   need. Keep the domain and DNS under HQ ownership.
2. Put this **full repository** in the GitHub repository. In Cloudflare Pages,
   use `site` as the root directory, `npm ci && npm run build` as the build
   command, and `dist` as the output directory. Confirm that the build can read
   the sibling `images/` directory.
3. Confirm the production domain in `astro.config.mjs` and
   `public/admin/config.yml`. Verify the custom domain, redirects, security
   headers, sitemap, canonical URLs, and the contact and portal links on the
   deployed preview before changing production DNS.
4. Keep the previous production deployment available for rollback until HQ
   accepts the new site.

## Content editor

The `/admin/` page uses Sveltia CMS to edit Markdown in `src/content/`. It
cannot save until the GitHub repository and editor authentication are set up.
Set `backend.repo` in `public/admin/config.yml` to HQ's `OWNER/REPO`, confirm
the branch, and configure a GitHub OAuth flow under HQ-controlled accounts.
Pin the Sveltia script in `public/admin/index.html` to a tested exact version
before launch.

Have an HQ editor sign in, change a test event, save it, see the GitHub commit
and Cloudflare build complete, check the published page, and restore the event.
Repeat for a news item and a leadership entry. This proves that staff can
maintain the content without a developer.

## HQ approval before publication

- Legal counsel: approve the Terms of Use, which currently displays a draft
  notice.
- HQ: approve the Accessibility Statement and its stated five-business-day
  reply target, which currently displays a draft notice.
- HQ and counsel: confirm the membership integrity wording on Become a Member
  and the definitions on Membership Accountability.
- HQ: review `src/data/chapter-directory.md` and `chapter-review.json`,
  including chapters without locations and records omitted from the locator.
- HQ: confirm leadership names, event dates, partner relationships, contact
  routes, and the organization figures immediately before launch.

Keep draft notices visible on review builds. Remove them only after the
corresponding text is approved. Record the approver and date in the handoff
record so future editors know which wording is official.

## Launch verification

- Re-run the build, browser suite, lint, and formatting check on the exact
  commit that will be deployed.
- Review the deployed site on a phone and a desktop, including the homepage,
  membership pathway, chapter locator, programs, contact page, and editor.
- Confirm that an HQ editor can publish and restore an item.
- Transfer the repository, Cloudflare, domain, CMS authentication, image
  sources, and this guide to HQ-controlled accounts. Provide an owner for
  future content updates and a rollback contact.
