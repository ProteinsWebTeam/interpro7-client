// @flow

export const memberDBAccessions = [
  'G3DSA:[0-9]{1}\\.[0-9]{2,3}\\.[0-9]{1,4}\\.[0-9]{2,4}',
  '(?:c|s)d[0-9]{5}',
  'MF_[0-9]{5}(_(A|B){1})?',
  'PTHR[0-9]{5}(:SF[0-9]{1,3})?',
  'PF[0-9]{5}',
  'PIRSF[0-9]{6}',
  'PR[0-9]{5}',
  'PD[A-Z0-9]{6}',
  'PS[0-9]{5}',
  'PS[0-9]{5}',
  'sfld[gf]\\d{5}',
  'SM[0-9]{5}',
  'SSF[0-9]{5,6}',
  'TIGR[0-9]{5}',
];

export const speciesFeat = [
  {
    title: 'Rice',
    kingdom: 'Eukaryota',
    description: 'Oryza sativa subsp. japonica',
    icon: '6',
    color: '#5cb85c',
    tax_id: '39947',
  },
  {
    title: 'Mouse-ear cress',
    kingdom: 'Eukaryota',
    description: 'Arabidopsis thaliana',
    icon: 'B',
    color: '#5cb85c',
    tax_id: '3702',
  },
  {
    title: 'Human',
    kingdom: 'Eukaryota',
    description: 'Homo sapiens',
    icon: 'H',
    color: '#d9534f',
    tax_id: '9606',
  },
  {
    title: 'Zebrafish',
    kingdom: 'Eukaryota',
    description: 'Danio rerio',
    icon: 'Z',
    color: '#d9534f',
    tax_id: '7955',
  },
  {
    title: 'Mouse',
    kingdom: 'Eukaryota',
    description: 'Mus musculus',
    icon: 'M',
    color: '#d9534f',
    tax_id: '10090',
  },
  {
    title: 'Fruit fly',
    kingdom: 'Eukaryota',
    description: 'Drosophila melanogaster',
    icon: 'F',
    color: '#d9534f',
    tax_id: '7227',
  },
  {
    title: 'Caenorhabditis elegans',
    kingdom: 'Eukaryota',
    description: 'Caenorhabditis elegans',
    icon: 'W',
    color: '#d9534f',
    tax_id: '6239',
  },
  {
    title: 'Baker’s yeast',
    kingdom: 'Eukaryota',
    description: 'Saccharomyces cerevisiae (strain ATCC 204508 / S288c)',
    icon: 'Y',
    color: '#5bc0de',
    tax_id: '559292',
  },
  {
    title: 'Fission yeast',
    kingdom: 'Eukaryota',
    description: 'Schizosaccharomyces pombe (strain 972 / ATCC 24843)',
    icon: 'Y',
    color: '#5bc0de',
    tax_id: '284812',
  },
  {
    title: 'Escherichia coli',
    kingdom: 'Bacteria',
    description: 'Escherichia coli O127:H6 (strain E2348/69 / EPEC)',
    icon: 'L',
    color: '#5bc0de',
    tax_id: '83333',
  },
  {
    title: 'Halobacterium salinarum',
    kingdom: 'Archea',
    description: 'Escherichia virus T4',
    icon: 'v',
    color: '#5bc0de',
    tax_id: '2242',
  },
  {
    title: 'Enterobacteria phage T4',
    kingdom: 'Virus',
    description: 'Escherichia virus T4',
    icon: 'v',
    color: '#5bc0de',
    tax_id: '10665',
  },
];

export const GoList = [
  {
    title: 'Catalytic activity',
    accession: 'GO:0003824',
    category: 'Molecular function',
    description: 'Description from GO website',
    counterD: '-',
    counterS: 386,
    color: '#5cb85c',
  },
  {
    title: 'DNA binding',
    accession: 'GO:0003677',
    category: 'Molecular function',
    description: 'Description from GO website',
    counterD: '-',
    counterS: 450,
    color: '#5cb85c',
  },
  {
    title: 'Metabolic process',
    accession: 'GO:0008152',
    category: 'Biological process',
    description: 'Description from GO website',
    counterD: '-',
    counterS: 386,
    color: '#5bc0de',
  },
  {
    title: 'Oxidation-reduction process',
    accession: 'GO:0055114',
    category: 'Molecular function',
    description: 'Description from GO website',
    counterD: '-',
    counterS: 386,
    color: '#5cb85c',
  },
  {
    title: 'Outer membrane',
    accession: 'GO:0019867',
    description: 'Description from GO website',
    counterD: '-',
    counterS: 386,
    category: 'Cellular components',
    color: '#d9534f',
  },
  {
    title: 'ATP binding',
    accession: 'GO:0005524',
    description: 'Description from GO website',
    counterD: '-',
    counterS: 42,
    category: 'Molecular function',
    color: '#5cb85c',
  },
  {
    title: 'Oxidoreductase activity',
    accession: 'GO:0016491',
    description: 'Description from GO website',
    counterD: '-',
    counterS: 93,
    category: 'Molecular function',
    color: '#5cb85c',
  },
  {
    title: 'Transport',
    accession: 'GO:0006810',
    description: 'Description from GO website',
    counterD: '-',
    counterS: 10,
    category: 'Biological process',
    color: '#5bc0de',
  },
  {
    title: 'DNA replication',
    accession: 'GO:0006260',
    description: 'Description from GO website',
    counterD: '-',
    counterS: 564,
    category: 'Molecular function',
    color: '#5cb85c',
  },
  {
    title: 'Integral component of membrane',
    accession: 'GO:0016021',
    description: 'Description from GO website',
    counterD: '-',
    counterS: 36,
    category: 'Molecular function',
    color: '#5cb85c',
  },
  {
    title: 'Cofactor bindind',
    accession: 'GO:0048037',
    description: 'Description from GO website',
    counterD: '-',
    counterS: 36,
    category: 'Molecular function',
    color: '#5cb85c',
  },
  {
    title: 'DNA polymerase complex',
    accession: 'GO:0042575',
    description: 'Description from GO website',
    counterD: '-',
    counterS: 36,
    category: 'Cellular components',
    color: '#d9534f',
  },
  {
    title: 'Cell projection assembly',
    accession: 'GO:0030031',
    description: 'Description from GO website',
    counterD: '-',
    counterS: 36,
    category: 'Biological process',
    color: '#5bc0de',
  },
  {
    title: 'Cellular component organization',
    accession: 'GO:0016043',
    description: 'Description from GO website',
    counterD: '-',
    counterS: 36,
    category: 'Biological process',
    color: '#5bc0de',
  },
  {
    title: 'Cell growth',
    accession: 'GO:0016049',
    description: 'Description from GO website',
    counterD: '-',
    counterS: 36,
    category: 'Biological process',
    color: '#5bc0de',
  },
];

export const entryType = [
  {
    type: 'Domain',
    description: `
      Domains are distinct functional, structural or sequence units that may
      exist in a variety of biological contexts. A match to an InterPro entry of
      this type indicates the presence of a domain.
    `,
  },
  {
    type: 'Family',
    description: `
      A protein family is a group of proteins that share a common evolutionary
      origin reflected by their related functions, similarities in sequence, or
      similar primary, secondary or tertiary structure. A match to an InterPro
      entry of this type indicates membership of a protein family.
    `,
  },
  {
    type: 'Homologous Superfamily',
    description:
      'A homologous superfamily is a group of proteins that share a common evolutionary origin, reflected by similarity in their structure. Since superfamily members often display very low similarity at the sequence level, this type of InterPro entry is usually based on a collection of underlying hidden Markov models, rather than a single signature.',
  },
  {
    type: 'Repeat',
    description: `
      A short sequence that is typically repeated within a
      protein.
    `,
  },
  {
    type: 'Conserved Site',
    description: `
      A short sequence that contains one or more conserved residues
    `,
  },
  {
    type: 'Active Site',
    description: `
      A short sequence that contains one or more conserved residues, which allow the protein to bind to a ligand.
    `,
  },
  {
    type: 'Binding Site',
    description: `
      A short sequence that contains one or more conserved residues, which form a protein interaction site.
    `,
  },
  {
    type: 'PTM',
    description: `
      A short sequence that contains one or more conserved residues.
      Post-translational modification site.
    `,
  },
];
