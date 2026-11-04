// ─────────────────────────────────────────────────────────────
// Everything personal lives in this one file.
// Edit the values below; you never need to touch the components.
// ─────────────────────────────────────────────────────────────

export const site = {
  name: 'Sai Vijwal Nulakajodu',
  // Shown in the browser tab and in search results.
  description:
    'Neuroscience MSc student at the University of Helsinki working on how neural circuits learn, coordinate and adapt.',

  // One sentence under your name on the home page.
  intro:
    'Neuroscience MSc student at the University of Helsinki, asking why neurons learn differently in a living brain than in a dish.',

  // The words that rotate in the hero line "Currently thinking about …".
  thinkingAbout: [
    'sharp-wave ripples',
    'plasticity after injury',
    'embodied cultures',
    'emergence',
    'hippocampal–neocortical dialogue',
  ],

  // Leave a value as '' to hide that link everywhere on the site.
  links: {
    email: 'saivijwal@gmail.com',
    linkedin: 'https://www.linkedin.com/in/sai-vijwal-nulakajodu',
    github: 'https://github.com/Vij-17',
    orcid: '',
    scholar: '',
  },

  // Put your CV in /public as cv.pdf, then change this to '/cv.pdf'. While it is '', the download button is hidden.
  cvPdf: '',

  location: 'Helsinki, Finland',
};

// Education and research path, newest first. Shown as the timeline.
export const path = [
  {
    when: '2026 – 2028',
    title: 'MSc, Master’s Programme in Neuroscience (MNeuro)',
    where: 'University of Helsinki',
    detail:
      'Systems, cellular and computational neuroscience; preparing for thesis work in a systems neuroscience lab.',
    current: true,
  },
  {
    when: 'Jan – Apr 2026',
    title: 'Honours thesis: sharp-wave ripples in the primate hippocampus',
    where: 'GITAM University, supervised by Dr Niranjan A. Kambi',
    detail:
      'Built a reproducible MATLAB and Brainstorm workflow to preprocess Plexon recordings and detect sharp-wave ripples in local field potentials.',
  },
  {
    when: '– 2026',
    title: 'BSc (Honours) Biotechnology, minor in Bioinformatics',
    where: 'GITAM University, India',
    detail: 'Molecular biology foundations with a computational minor.',
  },
];

export const nav = [
  { href: '/research', label: 'Research' },
  { href: '/projects', label: 'Projects' },
  { href: '/writing', label: 'Writing' },
  { href: '/cv', label: 'CV' },
];
