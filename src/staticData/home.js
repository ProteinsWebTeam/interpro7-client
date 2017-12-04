import { foundationPartial } from 'styles/foundation';

import ipro from 'styles/interpro-new.css';
// import ebiGlobalStyles from 'ebi-framework/css/ebi-global.scss';
// import fonts from 'EBI-Icon-fonts/fonts.css';
// import theme from 'styles/theme-interpro.css';
const f = foundationPartial(ipro);

export const memberDB = [
  {
    type: 'CATH',
    apiType: 'gene3d',
    to: {
      description: {
        main: { key: 'entry' },
        entry: { db: 'gene3d' },
      },
    },
    className: f('md-cg'),
    title: `CATH-Gene3D database describes protein families and domain architectures in
      complete genomes. Protein families are formed using a Markov clustering algorithm,
      followed by multi-linkage clustering according to sequence identity. Mapping of
      predicted structure and sequence domains is undertaken using hidden Markov models
      libraries representing CATH and Pfam domains. CATH-Gene3D is based at University
      College, London, UK.`,
    name: 'CATH-GENE3D',
    version: '3.5.0',
    counter: 2626,
    integrated: 1724,
    accession: 'G3DSA:[0-9]{1}\\.[0-9]{2,3}\\.[0-9]{1,4}\\.[0-9]{2,4}',
  },
  {
    type: 'CDD',
    apiType: 'cdd',
    to: {
      description: {
        main: { key: 'entry' },
        entry: { db: 'cdd' },
      },
    },
    className: f('md-cd'),
    title: `CDD is a protein annotation resource that consists of a collection of annotated
      multiple sequence alignment models for ancient domains and full-length proteins.
      These are available as position-specific score matrices (PSSMs) for fast
      identification of conserved domains in protein sequences via RPS-BLAST. CDD content
      includes NCBI-curated domain models, which use 3D-structure information to
      explicitly define domain boundaries and provide insights into
      sequence/structure/function relationships, as well as domain models imported from a
      number of external source databases.`,
    name: 'CDD',
    version: '3.14',
    counter: 11273,
    integrated: 1108,
    accession: '(?:c|s)d[0-9]{5}',
  },
  {
    type: 'HAMAP',
    apiType: 'hamap',
    to: {
      description: {
        main: { key: 'entry' },
        entry: { db: 'hamap' },
      },
    },
    className: f('md-ha'),
    title: `HAMAP stands for High-quality Automated and Manual Annotation of Proteins. HAMAP
      profiles are manually created by expert curators. They identify proteins that are
      part of well-conserved proteins families or subfamilies. HAMAP is based at the SIB
      Swiss Institute of Bioinformatics, Geneva, Switzerland.`,
    name: 'HAMAP',
    version: '201605.11',
    counter: 2087,
    integrated: 2081,
    accession: 'MF_[0-9]{5}(_(A|B){1})?',
  },
  {
    type: 'PANTHER',
    apiType: 'panther',
    to: {
      description: {
        main: { key: 'entry' },
        entry: { db: 'panther' },
      },
    },
    className: f('md-pa'),
    title: `PANTHER is a large collection of protein families that have been subdivided into
      functionally related subfamilies, using human expertise. These subfamilies model
      the divergence of specific functions within protein families, allowing more
      accurate association with function, as well as inference of amino acids important
      for functional specificity. Hidden Markov models (HMMs) are built for each family
      and subfamily for classifying additional protein sequences. PANTHER is based at at
      University of Southern California, CA, US.`,
    name: 'PANTHER',
    version: '10.0',
    counter: 95118,
    integrated: 5406,
    accession: 'PTHR[0-9]{5}(:SF[0-9]{1,3})?',
  },
  {
    type: 'PFAM',
    apiType: 'pfam',
    to: {
      description: {
        main: { key: 'entry' },
        entry: { db: 'pfam' },
      },
    },
    className: f('md-pf'),
    title: `Pfam is a large collection of multiple sequence alignments and hidden Markov
      models covering many common protein domains. Pfam is based at EMBL-EBI,
      Hinxton, UK.`,
    name: 'PFAM',
    version: '30.0',
    counter: 16306,
    integrated: 15716,
    accession: 'PF[0-9]{5}',
  },
  {
    type: 'PIRSF',
    apiType: 'pirsf',
    to: {
      description: {
        main: { key: 'entry' },
        entry: { db: 'pirsf' },
      },
    },
    className: f('md-pi'),
    title: `PIRSF protein classification system is a network with multiple levels of
      sequence diversity from superfamilies to subfamilies that reflects the
      evolutionary relationship of full-length proteins and domains. PIRSF is
      based at the Protein Information Resource, Georgetown University Medical
      Centre, Washington DC, US.`,
    name: 'PIRSF',
    version: '3.01',
    counter: 3285,
    integrated: 3223,
    accession: 'PIRSF[0-9]{6}',
  },
  {
    type: 'PRINTS',
    apiType: 'prints',
    to: {
      description: {
        main: { key: 'entry' },
        entry: { db: 'prints' },
      },
    },
    className: f('md-pri'),
    title: `PRINTS is a compendium of protein fingerprints. A fingerprint is a group
      of conserved motifs used to characterise a protein family or domain. PRINTS is
      based at the University of Manchester, UK.`,
    name: 'PRINTS',
    version: '42.0',
    counter: 2106,
    integrated: 1994,
    accession: 'PR[0-9]{5}',
  },
  {
    type: 'PRODOM',
    apiType: 'prodom',
    to: {
      description: {
        main: { key: 'entry' },
        entry: { db: 'prodom' },
      },
    },
    className: f('md-pro'),
    title: `ProDom protein domain database consists of an automatic compilation of homologous
      domains. Current versions of ProDom are built using a novel procedure based on
      recursive PSI-BLAST searches. ProDom is based at PRABI Villeurbanne, France.`,
    name: 'PRODOM',
    version: '2006.1',
    counter: 1894,
    integrated: 1128,
    accession: 'PD[A-Z0-9]{6}',
  },
  {
    type: 'PATTERNS',
    apiType: 'prosite',
    to: {
      description: {
        main: { key: 'entry' },
        entry: { db: 'prosite' },
      },
    },
    className: f('md-prpat'),
    title: `PROSITE is a database of protein families and domains. It consists of biologically
      significant sites, patterns and profiles that help to reliably identify to which
      known protein family a new sequence belongs. PROSITE is base at the Swiss Institute
      of Bioinformatics (SIB), Geneva, Switzerland.`,
    name: 'PROSITE patterns',
    version: '20.119',
    counter: 1309,
    integrated: 1290,
    accession: 'PS[0-9]{5}',
  },
  {
    type: 'PROFILES',
    apiType: 'profile',
    to: {
      description: {
        main: { key: 'entry' },
        entry: { db: 'profile' },
      },
    },
    className: f('md-prpro'),
    title: `PROSITE is a database of protein families and domains. It consists of biologically
      significant sites, patterns and profiles that help to reliably identify to which
      known protein family a new sequence belongs. PROSITE is base at the Swiss Institute
      of Bioinformatics (SIB), Geneva, Switzerland.`,
    name: 'PROSITE profiles',
    version: '20.119',
    counter: 1136,
    integrated: 1107,
    accession: 'PS[0-9]{5}',
  },
  {
    type: 'SFLD',
    apiType: 'sfld',
    to: {
      description: {
        main: { key: 'entry' },
        entry: { db: 'sfld' },
      },
    },
    className: f('md-sf'),
    title: `SFLD (Structure-Function Linkage Database) is a hierarchical classification of
      enzymes that relates specific sequence-structure features to specific chemical
      capabilities.`,
    name: 'SFLD',
    version: '1',
    counter: 480,
    integrated: 17,
    accession: 'sfld[gf]\\d{5}',
  },
  {
    type: 'SMART',
    apiType: 'smart',
    to: {
      description: {
        main: { key: 'entry' },
        entry: { db: 'smart' },
      },
    },
    className: f('md-sm'),
    title: `SMART (a Simple Modular Architecture Research Tool) allows the identification
      and annotation of genetically mobile domains and the analysis of domain
      architectures. SMART is based at at EMBL, Heidelberg, Germany.`,
    name: 'SMART',
    version: '7.1',
    counter: 1312,
    integrated: 1265,
    accession: 'SM[0-9]{5}',
  },
  {
    type: 'SUPERFAMILIES',
    apiType: 'ssf',
    to: {
      description: {
        main: { key: 'entry' },
        entry: { db: 'ssf' },
      },
    },
    className: f('md-su'),
    title: `SUPERFAMILY is a library of profile hidden Markov models that represent all
      proteins of known structure. The library is based on the SCOP classification of
      proteins: each model corresponds to a SCOP domain and aims to represent the entire
      SCOP superfamily that the domain belongs to. SUPERFAMILY is based at the University
      of Bristol, UK.`,
    name: 'SUPERFAMILY',
    version: '1.75',
    counter: 2019,
    integrated: 1413,
    accession: 'SSF[0-9]{5,6}',
  },
  {
    type: 'TIGRFAMS',
    apiType: 'tigrfams',
    to: {
      description: {
        main: { key: 'entry' },
        entry: { db: 'tigrfams' },
      },
    },
    className: f('md-ti'),
    title: `TIGRFAMs is a collection of protein families, featuring curated multiple sequence
      alignments, hidden Markov models (HMMs) and annotation, which provides a tool for
      identifying functionally related proteins based on sequence homology. TIGRFAMs is
      based at the J. Craig Venter Institute, Rockville, MD, US.`,
    name: 'TIGRFAMS',
    version: '15.0',
    counter: 4408,
    integrated: 4453,
    accession: 'TIGR[0-9]{5}',
  },
];

export const speciesFeat = [
  {
    title: 'Rice',
    kingdom: 'Eukaryota',
    description: 'Oryza sativa subsp. japonica',
    counterD: 40797,
    counterS: 37386,
    coverage: 54,
    icon: '6',
    color: '#5cb85c',
    tax_id: 39947,
  },
  {
    title: 'Mouse-ear cress',
    kingdom: 'Eukaryota',
    description: 'Arabidopsis thaliana',
    counterD: 31462,
    counterS: 43096,
    coverage: 79,
    icon: 'B',
    color: '#5cb85c',
    tax_id: 3702,
  },
  {
    title: 'Human',
    kingdom: 'Eukaryota',
    description: 'Homo sapiens',
    counterD: 70214,
    counterS: 93748,
    coverage: 70,
    icon: 'H',
    color: '#d9534f',
    tax_id: 9606,
  },
  {
    title: 'Zebrafish',
    kingdom: 'Eukaryota',
    description: 'Danio rerio',
    counterD: 87864,
    counterS: 43095,
    coverage: 87,
    icon: 'Z',
    color: '#d9534f',
    tax_id: 7955,
  },
  {
    title: 'Mouse',
    kingdom: 'Eukaryota',
    description: 'Mus musculus',
    counterD: 82766,
    counterS: 50690,
    coverage: 80,
    icon: 'M',
    color: '#d9534f',
    tax_id: 10090,
  },
  {
    title: 'Fruit fly',
    kingdom: 'Eukaryota',
    description: 'Drosophila melanogaster',
    counterD: 39537,
    counterS: 21945,
    coverage: 80,
    icon: 'F',
    color: '#d9534f',
    tax_id: 7227,
  },
  {
    title: 'Caenorhabditis elegans',
    kingdom: 'Eukaryota',
    description: 'Caenorhabditis elegans',
    counterD: 32011,
    counterS: 26563,
    coverage: 67,
    icon: 'W',
    color: '#d9534f',
    tax_id: 6239,
  },
  {
    title: 'Baker’s yeast',
    kingdom: 'Eukaryota',
    description: 'Saccharomyces cerevisiae (strain ATCC 204508 / S288c)',
    counterD: 7750,
    counterS: 6718,
    coverage: 74,
    icon: 'Y',
    color: '#5bc0de',
    tax_id: 559292,
  },
  {
    title: 'Fission yeast',
    kingdom: 'Eukaryota',
    description: 'Schizosaccharomyces pombe (strain 972 / ATCC 24843)',
    counterD: 7276,
    counterS: 5121,
    coverage: 87,
    icon: 'Y',
    color: '#5bc0de',
    tax_id: 284812,
  },
  {
    title: 'Escherichia coli',
    kingdom: 'Bacteria',
    description: 'Escherichia coli O127:H6 (strain E2348/69 / EPEC)',
    counterD: 6072,
    counterS: 4306,
    coverage: 73,
    icon: 'L',
    color: '#5bc0de',
    tax_id: 83333,
  },
  {
    title: 'Caulobacter phage phiCbK',
    kingdom: 'Virus',
    description: 'Caulobacter phage phiCbK',
    counterD: 53,
    counterS: 318,
    coverage: 13,
    icon: 'v',
    color: '#5bc0de',
    tax_id: 1204537,
  },
  {
    title: 'Unclassified',
    kingdom: 'Unclassified',
    description: 'Sequences that matches no species',
    counterD: 276,
    counterS: 121,
    coverage: 50,
    icon: '?',
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
    title: 'This icon represent a domain type of InterPro entry',
    type: 'Domain',
    description: `Domains are distinct functional, structural or sequence units
                       that may exist in a variety of biological contexts. A match to
                       an InterPro entry of this type indicates the presence of a
                       domain.`,
    counter: 2025,
  },
  {
    title: 'This icon represent a Family type of InterPro entry',
    type: 'Family',
    description: `A protein family is a group of proteins that share a common
                      evolutionary origin reflected by their related functions,
                      similarities in sequence, or similar primary, secondary or tertiary
                      structure. A match to an InterPro entry of this type indicates
                      membership of a protein family.`,
    counter: 1843,
  },
  {
    title: 'This icon represent a repeat type of InterPro entry',
    type: 'Repeat',
    description: `It identifies a short sequence that is typically repeated within
                      a protein.`,
    counter: 755,
  },
  {
    title: 'This icon represent a Clan type of InterPro entry',
    type: 'Clans',
    description: 'Clans are a collection of families',
    counter: 184,
  },
  {
    title: 'This icon represent an unintegrated type of InterPro entry',
    type: 'Unintegrated',
    description: `Signatures that doesn't belong to any type are what we call
                      unintegrated`,
    counter: 12143,
  },
  {
    title: 'This icon represent a site type of InterPro entry',
    type: 'Site',
    description: `A short sequence that contains one or more conserved residues.
                      The type of sites covered by InterPro are active sites, binding
                      sites, post-translational modification sites and conserved sites`,
    counter: 1843,
  },
];

export const latests = [
  {
    accession: 'IPR033983',
    type: 'Domain',
    name: 'Thiazole synthase ThiG',
    counter: 8192,
    contributing: [
      {
        accession: 'PF05690',
        source_database: 'pfam',
      },
    ],
  },
  {
    accession: 'IPR033985',
    type: 'Domain',
    name: 'SusD-like, N-terminal',
    counter: 22916,
    contributing: [
      {
        accession: 'PF14322',
        source_database: 'pfam',
      },
    ],
  },
  {
    accession: 'IPR033986',
    type: 'Site',
    name: 'Clusterin, conserved site',
    counter: 145,
    contributing: [
      {
        accession: 'PS00492',
        source_database: 'patterns',
      },
    ],
  },
  {
    accession: 'IPR033987',
    type: 'Domain',
    name: 'Aggrecan/versican, C-type lectin-like domain',
    counter: 249,
    contributing: [
      {
        accession: 'cd03588',
        source_database: 'CDD',
      },
    ],
  },
  {
    accession: 'IPR033988',
    type: 'Domain',
    name: 'CEL-1-like C-type lectin-like domain',
    counter: 75,
    contributing: [
      {
        accession: 'cd03589',
        source_database: 'CDD',
      },
    ],
  },
  {
    accession: 'IPR033989',
    type: 'Domain',
    name: 'CD209-like, C-type lectin-like domain',
    counter: 1586,
    contributing: [
      {
        accession: 'cd03590',
        source_database: 'CDD',
      },
    ],
  },
  {
    accession: 'IPR034004',
    type: 'Domain',
    name: 'Pol I subunit A12, C-terminal zinc ribbon',
    counter: 977,
    contributing: [
      {
        accession: 'cd10507',
        source_database: 'CDD',
      },
    ],
  },
  {
    accession: 'IPR034005',
    type: 'Family',
    name: 'Peptidyl-dipeptidase DCP',
    counter: 8245,
    contributing: [
      {
        accession: 'cd06456',
        source_database: 'CDD',
      },
    ],
  },
];
