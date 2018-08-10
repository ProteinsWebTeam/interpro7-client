// @flow
import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';

import { Consortium } from '.';

const renderer = new ShallowRenderer();

describe('<Consortium />', () => {
  test('should render without data', () => {
    renderer.render(<Consortium data={{ loading: true }} />);
    expect(renderer.getRenderOutput()).toMatchSnapshot();

    renderer.render(<Consortium data={{ loading: false, payload: null }} />);
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });

  test('should render with data', () => {
    const data = {
      loading: false,
      payload: {
        databases: {
          uniprot: {
            description: null,
            name: 'UniProt',
            type: 'protein',
            releaseDate: '2018-05-23T00:00:00Z',
            canonical: 'uniprot',
            version: '2018_05',
          },
          sfld: {
            description:
              'SFLD (Structure-Function Linkage Database) is a hierarchical classification of enzymes that relates specific sequence-structure features to specific chemical capabilities.',
            name: 'SFLD',
            type: 'entry',
            releaseDate: '2017-07-13T00:00:00Z',
            canonical: 'sfld',
            version: '3',
          },
          msdsite: {
            description: null,
            name: 'MSDsite',
            type: 'other',
            releaseDate: null,
            canonical: 'msdsite',
            version: null,
          },
          cazy: {
            description: null,
            name: 'CAZy',
            type: 'other',
            releaseDate: null,
            canonical: 'cazy',
            version: null,
          },
          panther: {
            description:
              'PANTHER is a large collection of protein families that have been subdivided into functionally related subfamilies, using human expertise. These subfamilies model the divergence of specific functions within protein families, allowing more accurate association with function, as well as inference of amino acids important for functional specificity. Hidden Markov models (HMMs) are built for each family and subfamily for classifying additional protein sequences. PANTHER is based at at University of Southern California, CA, US.',
            name: 'PANTHER',
            type: 'entry',
            releaseDate: '2017-05-08T00:00:00Z',
            canonical: 'panther',
            version: '12.0',
          },
          cog: {
            description: null,
            name: 'COG',
            type: 'other',
            releaseDate: null,
            canonical: 'cog',
            version: null,
          },
          profile: {
            description: null,
            name: 'PROSITE profiles',
            type: 'entry',
            releaseDate: '2018-02-28T00:00:00Z',
            canonical: 'profile',
            version: '2018_02',
          },
          pfam: {
            description:
              'PFAM is a large collection of multiple sequence alignments and hidden Markov models covering many common protein domains. Pfam is based at EMBL-EBI, Hinxton, UK.',
            name: 'Pfam',
            type: 'entry',
            releaseDate: '2017-03-08T00:00:00Z',
            canonical: 'pfam',
            version: '31.0',
          },
          smart: {
            description:
              'SMART (a Simple Modular Architecture Research Tool) allows the identification and annotation of genetically mobile domains and the analysis of domain architectures. SMART is based at at EMBL, Heidelberg, Germany.',
            name: 'SMART',
            type: 'entry',
            releaseDate: '2016-02-05T00:00:00Z',
            canonical: 'smart',
            version: '7.1',
          },
          tigrfams: {
            description:
              'TIGRFAMs is a collection of protein families, featuring curated multiple sequence alignments, hidden Markov models (HMMs) and annotation, which provides a tool for identifying functionally related proteins based on sequence homology. TIGRFAMs is based at the J. Craig Venter Institute, Rockville, MD, US.',
            name: 'TIGRFAMs',
            type: 'entry',
            releaseDate: '2014-09-16T00:00:00Z',
            canonical: 'tigrfams',
            version: '15.0',
          },
          kegg: {
            description: null,
            name: 'KEGG',
            type: 'other',
            releaseDate: null,
            canonical: 'kegg',
            version: null,
          },
          prints: {
            description:
              'PRINTS is a compendium of protein fingerprints. A fingerprint is a group of conserved motifs used to characterise a protein family or domain. PRINTS is based at the University of Manchester, UK.',
            name: 'PRINTS',
            type: 'entry',
            releaseDate: '2012-06-14T00:00:00Z',
            canonical: 'prints',
            version: '42.0',
          },
          pfamclan: {
            description: null,
            name: 'PfamClan',
            type: 'other',
            releaseDate: null,
            canonical: 'pfamclan',
            version: null,
          },
          ec: {
            description: null,
            name: 'ENZYME',
            type: 'other',
            releaseDate: null,
            canonical: 'ec',
            version: null,
          },
          dbd: {
            description: null,
            name: 'DBD',
            type: 'other',
            releaseDate: null,
            canonical: 'dbd',
            version: null,
          },
          reviewed: {
            description: null,
            name: 'UniProt/Swiss-Prot',
            type: 'protein',
            releaseDate: '2018-05-23T00:00:00Z',
            canonical: 'reviewed',
            version: '2018_05',
          },
          ssf: {
            description:
              'SUPERFAMILY is a library of profile hidden Markov models that represent all proteins of known structure. The library is based on the SCOP classification of proteins: each model corresponds to a SCOP domain and aims to represent the entire SCOP superfamily that the domain belongs to. SUPERFAMILY is based at the University of Bristol, UK.',
            name: 'SUPERFAMILY',
            type: 'entry',
            releaseDate: '2010-11-08T00:00:00Z',
            canonical: 'ssf',
            version: '1.75',
          },
          reactome: {
            description: null,
            name: 'Reactome',
            type: 'other',
            releaseDate: null,
            canonical: 'reactome',
            version: null,
          },
          modbase: {
            description: null,
            name: 'MODBASE',
            type: 'other',
            releaseDate: null,
            canonical: 'modbase',
            version: null,
          },
          cath: {
            description: null,
            name: 'CATH',
            type: 'other',
            releaseDate: null,
            canonical: 'cath',
            version: null,
          },
          prosite: {
            description:
              'PROSITE is a database of protein families and domains. It consists of biologically significant sites, patterns and profiles that help to reliably identify to which known protein family a new sequence belongs. PROSITE is base at the Swiss Institute of Bioinformatics (SIB), Geneva, Switzerland.',
            name: 'PROSITE patterns',
            type: 'entry',
            releaseDate: '2018-02-28T00:00:00Z',
            canonical: 'prosite',
            version: '2018_02',
          },
          cdd: {
            description:
              'CDD is a protein annotation resource that consists of a collection of annotated multiple sequence alignment models for ancient domains and full-length proteins. These are available as position-specific score matrices (PSSMs) for fast identification of conserved domains in protein sequences via RPS-BLAST. CDD content includes NCBI-curated domain models, which use 3D-structure information to explicitly define domain boundaries and provide insights into sequence/structure/function relationships, as well as domain models imported from a number of external source databases.',
            name: 'CDD',
            type: 'entry',
            releaseDate: '2017-03-28T00:00:00Z',
            canonical: 'cdd',
            version: '3.16',
          },
          prodom: {
            description:
              'PRODOM protein domain database consists of an automatic compilation of homologous domains. Current versions of ProDom are built using a novel procedure based on recursive PSI-BLAST searches. ProDom is based at PRABI Villeurbanne, France.',
            name: 'ProDom',
            type: 'entry',
            releaseDate: '2009-04-23T12:05:33Z',
            canonical: 'prodom',
            version: '2006.1',
          },
          unreviewed: {
            description: null,
            name: 'UniProt/TrEMBL',
            type: 'protein',
            releaseDate: '2018-05-23T00:00:00Z',
            canonical: 'unreviewed',
            version: '2018_05',
          },
          come: {
            description: null,
            name: 'COMe',
            type: 'other',
            releaseDate: null,
            canonical: 'come',
            version: null,
          },
          go: {
            description: null,
            name: 'GO Classification',
            type: 'other',
            releaseDate: '2007-03-27T00:00:00Z',
            canonical: 'go',
            version: 'N/A',
          },
          priam: {
            description: null,
            name: 'PRIAM',
            type: 'other',
            releaseDate: null,
            canonical: 'priam',
            version: null,
          },
          pdb: {
            description: null,
            name: 'PDB',
            type: 'other',
            releaseDate: null,
            canonical: 'pdb',
            version: null,
          },
          adan: {
            description: null,
            name: 'ADAN',
            type: 'other',
            releaseDate: null,
            canonical: 'adan',
            version: null,
          },
          pirsf: {
            description:
              'PIRSF protein classification system is a network with multiple levels of sequence diversity from superfamilies to subfamilies that reflects the evolutionary relationship of full-length proteins and domains. PIRSF is based at the Protein Information Resource, Georgetown University Medical Centre, Washington DC, US.',
            name: 'PIRSF',
            type: 'entry',
            releaseDate: '2014-04-07T00:00:00Z',
            canonical: 'pirsf',
            version: '3.02',
          },
          cathgene3d: {
            description:
              'CATH-Gene3D database describes protein families and domain architectures in complete genomes. Protein families are formed using a Markov clustering algorithm, followed by multi-linkage clustering according to sequence identity. Mapping of predicted structure and sequence domains is undertaken using hidden Markov models libraries representing CATH and Pfam domains. CATH-Gene3D is based at University College, London, UK.',
            name: 'CATH-Gene3D',
            type: 'entry',
            releaseDate: '2017-09-04T00:00:00Z',
            canonical: 'cathgene3d',
            version: '4.2.0',
          },
          omim: {
            description: null,
            name: 'OMIM',
            type: 'other',
            releaseDate: null,
            canonical: 'omim',
            version: null,
          },
          smodel: {
            description: null,
            name: 'SWISS-MODEL',
            type: 'other',
            releaseDate: null,
            canonical: 'smodel',
            version: null,
          },
          merops: {
            description: null,
            name: 'MEROPS',
            type: 'other',
            releaseDate: '2010-12-14T16:45:38Z',
            canonical: 'merops',
            version: '9.3',
          },
          interpro: {
            description:
              'InterPro provides functional analysis of proteins by classifying them into families and predicting domains and important sites. We combine protein signatures from a number of member databases into a single searchable resource, capitalising on their individual strengths to produce a powerful integrated database and diagnostic tool. To classify proteins in this way, InterPro uses predictive models, known as signatures, provided by several different databases (referred to as member databases) that make up the InterPro consortium.',
            name: 'InterPro',
            type: 'entry',
            releaseDate: '2018-04-26T00:00:00Z',
            canonical: 'interpro',
            version: '68.0',
          },
          blocks: {
            description: null,
            name: 'Blocks',
            type: 'other',
            releaseDate: null,
            canonical: 'blocks',
            version: null,
          },
          iuphar: {
            description: null,
            name: 'IUPHAR receptor code',
            type: 'other',
            releaseDate: null,
            canonical: 'iuphar',
            version: null,
          },
          metacyc: {
            description: null,
            name: 'MetaCyc',
            type: 'other',
            releaseDate: null,
            canonical: 'metacyc',
            version: null,
          },
          prositedoc: {
            description: null,
            name: 'PROSITE doc',
            type: 'other',
            releaseDate: null,
            canonical: 'prositedoc',
            version: null,
          },
          pandit: {
            description: null,
            name: 'PANDIT',
            type: 'other',
            releaseDate: null,
            canonical: 'pandit',
            version: null,
          },
          scop: {
            description: null,
            name: 'SCOP',
            type: 'other',
            releaseDate: null,
            canonical: 'scop',
            version: null,
          },
          mobidblt: {
            description:
              'MobiDB offers a centralized resource for annotations of intrinsic protein disorder. The database features three levels of annotation: manually curated, indirect and predicted. The different sources present a clear tradeoff between quality and coverage. By combining them all into a consensus annotation, MobiDB aims at giving the best possible picture of the “disorder landscape” of a given protein of interest.',
            name: 'MobiDB Lite',
            type: 'entry',
            releaseDate: '2016-05-02T00:00:00Z',
            canonical: 'mobidblt',
            version: '1.0',
          },
          hamap: {
            description:
              'HAMAP stands for High-quality Automated and Manual Annotation of Proteins. HAMAP profiles are manually created by expert curators. They identify proteins that are part of well-conserved proteins families or subfamilies. HAMAP is based at the SIB Swiss Institute of Bioinformatics, Geneva, Switzerland.',
            name: 'HAMAP',
            type: 'entry',
            releaseDate: '2018-03-28T00:00:00Z',
            canonical: 'hamap',
            version: '2018_03',
          },
          unipathway: {
            description: null,
            name: 'UniPathway',
            type: 'other',
            releaseDate: null,
            canonical: 'unipathway',
            version: null,
          },
        },
      },
    };

    renderer.render(<Consortium data={data} />);
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
});
