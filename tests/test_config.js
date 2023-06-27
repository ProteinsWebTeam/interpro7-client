export default {
  two_minutes: 120000,
  five_minutes: 300000,
  fast_timeout: 100,
  general: {
    interpro: 'interpro',
    entryType: [
      'cathgene3d',
      'cdd',
      'hamap',
      'panther',
      'pfam',
      'pirsf',
      'prints',
      'profile',
      'prosite',
      'sfld',
      'smart',
      'ssf',
      'tigrfams',
      'ncbifam',
      'antifam',
    ],
    entryTypes: [
      'domain',
      'family',
      'homologous_superfamily',
      'repeat',
      'conserved_site',
      'active_site',
      'binding_site',
      'ptm',
    ],
  },
  /* eslint-disable no-magic-numbers */
  homepage: {
    species: [
      559292, 6239, 10665, 83333, 284812, 7227, 2242, 9606, 10090, 3702, 39947,
      7955,
    ],
  },
  /* eslint-enable */
  browse: {
    browseTypes: [
      'entry',
      'protein',
      'structure',
      'taxonomy',
      'proteome',
      'set',
    ],
  },
};
