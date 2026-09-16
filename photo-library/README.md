# photo-library

Source photography and media that no page currently references.

These files used to sit in `images/`, which is published wholesale: the site's
`site/public/images` junction points at it, so every file there is copied into
`dist/` and shipped whether or not a page uses it. That added tens of
megabytes to every deploy for images nobody requests.

Nothing is deleted. Moving a file back into `images/` republishes it, and the
full history is intact (`git log --follow`).

Also here: the pre-optimisation originals that were deliberately kept —
`sgrho video.mp4` (the 30 MB source for `images/sgrho-hero.mp4`) and
`Lambda Psi.jpg` (the 3276px source for `images/lambda-psi-1200.jpg`).
