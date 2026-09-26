// Official supplied PNGs remain unchanged. Bounds remove only export whitespace
// in the rendered layout, with clear space around the complete artwork.
export const programLogos = {
  bigbookbag: {
    src: "/programs/operation-bigbookbag.png",
    width: 2400,
    height: 2400,
    bounds: [302, 921, 1796, 557],
  },
  wellness: {
    src: "/programs/womens-wellness.png",
    width: 1800,
    height: 1800,
    bounds: [116, 706, 1582, 388],
  },
  swim: {
    src: "/programs/swim-1922.png",
    width: 3000,
    height: 2100,
    bounds: [235, 340, 2467, 1576],
  },
  cradle: {
    src: "/programs/project-cradle-care.png",
    width: 747,
    height: 338,
    bounds: [25, 47, 675, 240],
  },
  youth: {
    src: "/programs/youth-symposium.png",
    width: 1800,
    height: 1800,
    bounds: [249, 511, 1302, 778],
  },
} as const;

export type ProgramLogoName = keyof typeof programLogos;
