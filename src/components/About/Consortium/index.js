// @flow
import React, { PureComponent } from 'react';
import T from 'prop-types';

import MemberSymbol from 'components/Entry/MemberSymbol';
import Link from 'components/generic/Link';

import loadable from 'higherOrder/loadable';
import loadData from 'higherOrder/loadData';
import { getUrlForMeta } from 'higherOrder/loadData/defaults';

import { schemaProcessDataForDB } from 'schema_org/processors';

import { foundationPartial } from 'styles/foundation';

import local from './style.css';
import entry from 'components/Entry/Literature/style.css';

const f = foundationPartial(local, entry);

const SchemaOrgData = loadable({
  loader: () => import(/* webpackChunkName: "schemaOrg" */ 'schema_org'),
  loading: () => null,
});

const memberDBs = [
  {
    type: 'cathgene3d',
    title: 'CATH-Gene3D',
    description: `database describes protein
                  families and domain architectures in complete genomes. Protein
                  families are formed using a Markov clustering algorithm,
                  followed by multi-linkage clustering according to sequence
                  identity. Mapping of predicted structure and sequence domains
                  is undertaken using hidden Markov models libraries
                  representing CATH and Pfam domains. CATH-Gene3D is based at
                  University College, London, UK.`,
  },
  {
    type: 'cdd',
    title: 'CDD',
    description: `is a protein annotation resource that
                  consists of a collection of annotated multiple sequence
                  alignment models for ancient domains and full-length proteins.
                  These are available as position-specific score matrices
                  (PSSMs) for fast identification of conserved domains in
                  protein sequences via RPS-BLAST. CDD content includes
                  NCBI-curated domain models, which use 3D-structure information
                  to explicitly define domain boundaries and provide insights
                  into sequence/structure/function relationships, as well as
                  domain models imported from a number of external source
                  databases.`,
  },
  {
    type: 'mobidblt',
    title: 'MobiDB',
    description: `-offers a centralized resource for
                  annotations of intrinsic protein disorder. The database
                  features three levels of annotation: manually curated,
                  indirect and predicted. The different sources present a clear
                  tradeoff between quality and coverage. By combining them all
                  into a consensus annotation, MobiDB aims at giving the best
                  possible picture of the &ldquo;disorder landscape&rdquo; of a
                  given protein of interest.`,
  },
  {
    type: 'hamap',
    title: 'HAMAP',
    description: `stands for High-quality Automated and
                  Manual Annotation of Proteins. HAMAP profiles are manually
                  created by expert curators. They identify proteins that are
                  part of well-conserved proteins families or subfamilies. HAMAP
                  is based at the SIB Swiss Institute of Bioinformatics, Geneva,
                  Switzerland.`,
  },
  {
    type: 'panther',
    title: 'PANTHER',
    description: `is a large collection of protein
                  families that have been subdivided into functionally related
                  subfamilies, using human expertise. These subfamilies model
                  the divergence of specific functions within protein families,
                  allowing more accurate association with function, as well as
                  inference of amino acids important for functional specificity.
                  Hidden Markov models (HMMs) are built for each family and
                  subfamily for classifying additional protein sequences.
                  PANTHER is based at at University of Southern California, CA,
                  US.`,
  },
  {
    type: 'pirsf',
    title: 'PIRSF',
    description: `protein classification system is a
                  network with multiple levels of sequence diversity from
                  superfamilies to subfamilies that reflects the evolutionary
                  relationship of full-length proteins and domains. PIRSF is
                  based at the Protein Information Resource, Georgetown
                  University Medical Centre, Washington DC, US.`,
  },
  {
    type: 'prints',
    title: 'PRINTS',
    description: `is a compendium of protein
                  fingerprints. A fingerprint is a group of conserved motifs
                  used to characterise a protein family or domain. PRINTS is
                  based at the University of Manchester, UK.`,
  },
  {
    type: 'prodom',
    title: 'PRODOM',
    description: `protein domain database consists of an
                  automatic compilation of homologous domains. Current versions
                  of ProDom are built using a novel procedure based on recursive
                  PSI-BLAST searches. ProDom is based at PRABI Villeurbanne,
                  France.`,
  },
  {
    type: 'prosite',
    title: 'PROSITE',
    description: `is a database of protein families and
                  domains. It consists of biologically significant sites,
                  patterns and profiles that help to reliably identify to which
                  known protein family a new sequence belongs. PROSITE is base
                  at the Swiss Institute of Bioinformatics (SIB), Geneva,
                  Switzerland.`,
  },
  {
    type: 'sfld',
    title: 'SFLD',
    description: `(Structure-Function Linkage Database) is
                  a hierarchical classification of enzymes that relates specific
                  sequence-structure features to specific chemical capabilities.`,
  },
  {
    type: 'smart',
    title: 'SMART',
    description: `(a Simple Modular Architecture Research
                  Tool) allows the identification and annotation of genetically
                  mobile domains and the analysis of domain architectures. SMART
                  is based at at EMBL, Heidelberg, Germany.`,
  },
  {
    type: 'ssf',
    title: 'SUPERFAMILY',
    description: `is a library of profile hidden
                  Markov models that represent all proteins of known structure.
                  The library is based on the SCOP classification of proteins:
                  each model corresponds to a SCOP domain and aims to represent
                  the entire SCOP superfamily that the domain belongs to.
                  SUPERFAMILY is based at the University of Bristol, UK.`,
  },
  {
    type: 'tigrfams',
    title: 'TIGRFAMs',
    description: `is a collection of protein families,
                  featuring curated multiple sequence alignments, hidden Markov
                  models (HMMs) and annotation, which provides a tool for
                  identifying functionally related proteins based on sequence
                  homology. TIGRFAMs is based at the J. Craig Venter Institute,
                  Rockville, MD, US.`,
  },
];

/*:: type Props = {
  data: {
    payload?: {
      databases: {},
    }
  },
}; */

export const Consortium = class extends PureComponent /*:: <Props> */ {
  static displayName = 'Consortium';

  static propTypes = {
    data: T.shape({
      payload: T.shape({
        databases: T.object,
      }),
    }).isRequired,
  };

  render() {
    const { payload } = this.props.data;
    const databases = payload && payload.databases;
    return (
      <section>
        <h4>The InterPro Consortium</h4>
        <p>The following databases make up the InterPro Consortium:</p>

        <ul className={f('list')}>
          {memberDBs.map(db => (
            <li key={db.type}>
              <Link
                to={{
                  description: {
                    main: { key: 'entry' },
                    entry: { db: db.type },
                  },
                }}
              >
                <MemberSymbol type={db.type} className={f('md-small')} />
              </Link>
              <strong>{db.title}</strong> {db.description}
              {databases &&
                databases[db.type.toUpperCase()] && (
                  <SchemaOrgData
                    data={{
                      name: db.type,
                      version: databases[db.type.toUpperCase()].version,
                      releaseDate: databases[db.type.toUpperCase()].releaseDate,
                      location: window.location,
                    }}
                    processData={schemaProcessDataForDB}
                  />
                )}
            </li>
          ))}
        </ul>
      </section>
    );
  }
};

export default loadData(getUrlForMeta)(Consortium);
