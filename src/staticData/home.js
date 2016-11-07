import {foundationPartial} from 'styles/foundation';

import ipro from 'styles/interpro-new.css';
import ebiGlobalStyles from 'styles/ebi-global.css';
import fonts from 'styles/ebi/fonts.css';
import theme from 'styles/theme-interpro.css';
const f = foundationPartial(ebiGlobalStyles, fonts, ipro, theme);

export const memberDB = [
  {
    type: 'CATH',
    to: 'entry/gene3d',
    className: f('md-cg'),
    title:
      `CATH-Gene3D database describes protein families and domain architectures in
      complete genomes. Protein families are formed using a Markov clustering algorithm,
      followed by multi-linkage clustering according to sequence identity. Mapping of
      predicted structure and sequence domains is undertaken using hidden Markov models
      libraries representing CATH and Pfam domains. CATH-Gene3D is based at University
      College, London, UK.`,
    name: 'CATH-GENE3D',
    version: '3.5.0',
    counter: 1345,
  }, {
    type: 'CDD',
    to: 'entry/cdd',
    className: f('md-cd'),
    title:
      `CDD is a protein annotation resource that consists of a collection of annotated
      multiple sequence alignment models for ancient domains and full-length proteins.
      These are available as position-specific score matrices (PSSMs) for fast
      identification of conserved domains in protein sequences via RPS-BLAST. CDD content
      includes NCBI-curated domain models, which use 3D-structure information to
      explicitly define domain boundaries and provide insights into
      sequence/structure/function relationships, as well as domain models imported from a
      number of external source databases.`,
    name: 'CDD',
    version: '3.14',
    counter: 2626,
  }, {
    type: 'HAMAP',
    to: 'entry/hamap',
    className: f('md-ha'),
    title:
      `HAMAP stands for High-quality Automated and Manual Annotation of Proteins. HAMAP
      profiles are manually created by expert curators. They identify proteins that are
      part of well-conserved proteins families or subfamilies. HAMAP is based at the SIB
      Swiss Institute of Bioinformatics, Geneva, Switzerland.`,
    name: 'HAMAP',
    version: '201605.11',
    counter: 2087,
  }, {
    type: 'PANTHER',
    to: 'entry/panther',
    className: f('md-pa'),
    title:
      `PANTHER is a large collection of protein families that have been subdivided into
      functionally related subfamilies, using human expertise. These subfamilies model
      the divergence of specific functions within protein families, allowing more
      accurate association with function, as well as inference of amino acids important
      for functional specificity. Hidden Markov models (HMMs) are built for each family
      and subfamily for classifying additional protein sequences. PANTHER is based at at
      University of Southern California, CA, US.`,
    name: 'PANTHER',
    version: '10.0',
    counter: 95118,
  }, {
    type: 'PFAM',
    to: 'entry/pfam',
    className: f('md-pf'),
    title:
      `Pfam is a large collection of multiple sequence alignments and hidden Markov
      models covering many common protein domains. Pfam is based at EMBL-EBI,
      Hinxton, UK.`,
    name: 'PFAM',
    version: '30.0',
    counter: 16306,
  }, {
    type: 'PIRSF',
    to: 'entry/pirsf',
    className: f('md-pi'),
    title:
      `PIRSF protein classification system is a network with multiple levels of
      sequence diversity from superfamilies to subfamilies that reflects the
      evolutionary relationship of full-length proteins and domains. PIRSF is
      based at the Protein Information Resource, Georgetown University Medical
      Centre, Washington DC, US.`,
    name: 'PIRSF',
    version: '3.01',
    counter: 3285,
  }, {
    type: 'PRINTS',
    to: 'entry/prints',
    className: f('md-pri'),
    title:
      `PRINTS is a compendium of protein fingerprints. A fingerprint is a group
      of conserved motifs used to characterise a protein family or domain. PRINTS is
      based at the University of Manchester, UK.`,
    name: 'PRINTS',
    version: '42.0',
    counter: 2106,
  }, {
    type: 'PRODOM',
    to: 'entry/prodom',
    className: f('md-pro'),
    title:
      `ProDom protein domain database consists of an automatic compilation of homologous
      domains. Current versions of ProDom are built using a novel procedure based on
      recursive PSI-BLAST searches. ProDom is based at PRABI Villeurbanne, France.`,
    name: 'PRODOM',
    version: '2006.1',
    counter: 1894,
  }, {
    type: 'PATTERNS',
    to: 'entry/prosite',
    className: f('md-prpat'),
    title:
      `PROSITE is a database of protein families and domains. It consists of biologically
      significant sites, patterns and profiles that help to reliably identify to which
      known protein family a new sequence belongs. PROSITE is base at the Swiss Institute
      of Bioinformatics (SIB), Geneva, Switzerland.`,
    name: 'PROSITE patterns',
    version: '20.119',
    counter: 1309,
  }, {
    type: 'PROFILES',
    to: 'entry/prosite',
    className: f('md-prpro'),
    title:
      `PROSITE is a database of protein families and domains. It consists of biologically
      significant sites, patterns and profiles that help to reliably identify to which
      known protein family a new sequence belongs. PROSITE is base at the Swiss Institute
      of Bioinformatics (SIB), Geneva, Switzerland.`,
    name: 'PROSITE profiles',
    version: '20.119',
    counter: 1136,
  }, {
    type: 'SFLD',
    to: 'entry/sfld',
    className: f('md-sf'),
    title:
      `SFLD (Structure-Function Linkage Database) is a hierarchical classification of
      enzymes that relates specific sequence-structure features to specific chemical
      capabilities.`,
    name: 'SFLD',
    version: '1',
    counter: 480,
  }, {
    type: 'SMART',
    to: 'entry/',
    className: f('md-sm'),
    title:
      `SMART (a Simple Modular Architecture Research Tool) allows the identification
      and annotation of genetically mobile domains and the analysis of domain
      architectures. SMART is based at at EMBL, Heidelberg, Germany.`,
    name: 'SMART',
    version: '7.1',
    counter: 1312,
  }, {
    type: 'SUPERFAMILIES',
    to: 'entry/ssf',
    className: f('md-su'),
    title:
      `SUPERFAMILY is a library of profile hidden Markov models that represent all
      proteins of known structure. The library is based on the SCOP classification of
      proteins: each model corresponds to a SCOP domain and aims to represent the entire
      SCOP superfamily that the domain belongs to. SUPERFAMILY is based at the University
      of Bristol, UK.`,
    name: 'SUPERFAMILY',
    version: '1.75',
    counter: 2019,
  }, {
    type: 'TIGRFAMS',
    to: 'entry/tigrfams',
    className: f('md-ti'),
    title:
      `TIGRFAMs is a collection of protein families, featuring curated multiple sequence
      alignments, hidden Markov models (HMMs) and annotation, which provides a tool for
      identifying functionally related proteins based on sequence homology. TIGRFAMs is
      based at the J. Craig Venter Institute, Rockville, MD, US.`,
    name: 'TIGRFAMS',
    version: '15.0',
    counter: 4408,
  }, {
    type: 'new',
    to: 'contact/',
    className: f('md-new'),
    title: 'Want to become a partner?',
    name: 'New partner?',
    counter: 'click to join us',
    version: '',
  },
];

export const entryType = [{
  title: 'This icon represent a domain type of InterPro entry',
  type: 'Domain',
  description:
    `Domains are distinct functional, structural or sequence units
                       that may exist in a variety of biological contexts. A match to
                       an InterPro entry of this type indicates the presence of a
                       domain.`,
  counter: 2025,
}, {
  title: 'This icon represent a Family type of InterPro entry',
  type: 'Family',
  description:
    `A protein family is a group of proteins that share a common
                      evolutionary origin reflected by their related functions,
                      similarities in sequence, or similar primary, secondary or tertiary
                      structure. A match to an InterPro entry of this type indicates
                      membership of a protein family.`,
  counter: 1843,
}, {
  title: 'This icon represent a repeat type of InterPro entry',
  type: 'Repeat',
  description:
    `It identifies a short sequence that is typically repeated within
                      a protein.`,
  counter: 755,
}, {
  title: 'This icon represent a Clan type of InterPro entry',
  type: 'Clans',
  description: 'Clans are a collection of families',
  counter: 184,
}, {
  title: 'This icon represent an unintegrated type of InterPro entry',
  type: 'Unintegrated',
  description:
    `Signatures that doesn't belong to any type are what we call
                      unintegrated`,
  counter: 12143,
}, {
  title: 'This icon represent a site type of InterPro entry',
  type: 'Site',
  description:
    `A short sequence that contains one or more conserved residues.
                      The type of sites covered by InterPro are active sites, binding
                      sites, post-translational modification sites and conserved sites`,
  counter: 1843,
}];

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
