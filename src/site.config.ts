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
    'Neuroscience MSc student at the University of Helsinki, asking why and how neurons learn differently in a living brain than in a dish.',

  // The words that rotate in the hero line "Currently thinking about …".
  thinkingAbout: [
    'sharp-wave ripples',
    'plasticity',
    'perception',
    'emergence',
    'hippocampal–neocortical dialogue',
    'brain organoids',
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
  cvPdf: '/cv.pdf',

  location: 'Helsinki, Finland',

  // Writing (blog + reading list) is switched off for now.
  // To bring it back: set this to true AND rename src/pages/_writing to src/pages/writing.
  showWriting: false,
};

// Education and research path, newest first. Shown as the timeline.
export const path = [
  {
    when: 'Sept 2026 – expected 2028',
    title: 'MSc, Master’s Programme in Neuroscience',
    where: 'University of Helsinki, Finland',
    detail:
      'Systems, cellular and computational neuroscience; preparing for thesis work in a systems neuroscience lab.',
    current: true,
  },
  {
    when: 'Jan – Apr 2026',
    title: 'Honours research thesis: detection of sharp-wave ripples and their role in primate memory',
    where: 'Department of Life Sciences, GITAM University, supervised by Dr Niranjan A. Kambi',
    detail:
      'Analysed hippocampal LFPs from a non-human primate performing a context-dependent associative memory task, using a MATLAB and Brainstorm pipeline to detect sharp-wave ripples and align them to task events.',
  },
  {
    when: '2022 – Apr 2026',
    title: 'BSc (Honours with Research) in Biotechnology, Minor in Bioinformatics',
    where: 'GITAM (Deemed to be University), Visakhapatnam, India',
    detail: 'Molecular biology foundations with a computational minor.',
  },
];

export const nav = [
  { href: '/research', label: 'Research' },
  { href: '/projects', label: 'Projects' },
  ...(site.showWriting ? [{ href: '/writing', label: 'Writing' }] : []),
  { href: '/cv', label: 'CV' },
];
