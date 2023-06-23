import React from 'react';

import { NOT_MEMBER_DBS } from 'menuConfig';
import Link from 'components/generic/Link';
import {
  Genome3dLink,
  AlphafoldLink,
} from 'components/ExtLink/patternLinkWrapper';
import Tooltip from 'components/SimpleCommonComponents/Tooltip';

import { FunFamLink } from 'subPages/Subfamilies';

import { ExtendedFeature } from '../..';

import cssBinder from 'styles/cssBinder';

import style from '../../../ProteinViewer/style.css';

const css = cssBinder(style);

type PropsEL = {
  entry: ExtendedFeature;
  isPrinting: boolean;
  databases?: DBsInfo;
};

const EXCEPTIONAL_TYPES = [
  'residue',
  'sequence_conservation',
  'chain',
  'secondary_structure',
];
const EXCEPTIONAL_PREFIXES = ['G3D:', 'REPEAT:'];

export const isAnExceptionalLabel = (entry: ExtendedFeature): boolean => {
  return (
    EXCEPTIONAL_TYPES.includes(entry.type || '') ||
    NOT_MEMBER_DBS.has(entry.source_database || '') ||
    EXCEPTIONAL_PREFIXES.some((prefix) => entry.accession.startsWith(prefix))
  );
};

const ExceptionalLabels = ({ entry, isPrinting, databases }: PropsEL) => {
  if (entry.source_database === 'mobidblt')
    return isPrinting ? (
      <span>{entry.accession}</span>
    ) : (
      <Link href={`https://mobidb.org/${entry.protein}`}>
        {entry.accession}
      </Link>
    );
  if (entry.source_database === 'funfam') {
    return isPrinting ? (
      <span>{entry.accession}</span>
    ) : (
      <FunFamLink accession={entry.accession}>{entry.accession}</FunFamLink>
    );
  }
  if (entry.source_database === 'pfam-n') {
    return isPrinting ? (
      <span>N: {entry.accession}</span>
    ) : (
      <Link
        to={{
          description: {
            main: { key: 'entry' },
            entry: { db: 'pfam', accession: entry.accession },
          },
        }}
      >
        N: {entry.accession}
      </Link>
    );
  }
  if (entry.source_database === 'alphafold') {
    return isPrinting ? (
      <span>pLDDT</span>
    ) : (
      <AlphafoldLink id={entry.protein || ''} className={css('ext')}>
        pLDDT
      </AlphafoldLink>
    );
  }
  if (entry.source_database === 'elm')
    return isPrinting ? (
      <span>{entry.accession}</span>
    ) : (
      <Link href={`http://elm.eu.org/${entry.accession}`}>
        {entry.accession}
      </Link>
    );
  if (entry.type === 'residue')
    return <span>{entry.locations?.[0]?.description || ''}</span>;
  if (
    NOT_MEMBER_DBS.has(entry.source_database || '') ||
    entry.type === 'chain' ||
    entry.type === 'secondary_structure'
  )
    return <>{entry.accession}</>;
  if (entry.type === 'sequence_conservation') {
    return (
      <Tooltip title={'Score calculated using Phmmer and HMM profile'}>
        <div className={css('sequence-conservation-label')}>
          {databases?.[entry.accession]?.name || entry.accession} conservation
        </div>
      </Tooltip>
    );
  }
  if (entry.accession && entry.accession.startsWith('G3D:')) {
    return isPrinting ? (
      <span>
        Genome3D: [{entry.type}] {entry.source_database}{' '}
      </span>
    ) : (
      <Genome3dLink id={entry.protein || ''}>
        Genome3D: [{entry.type}] {entry.source_database}
      </Genome3dLink>
    );
  }
  if (entry.accession && entry.accession.startsWith('REPEAT:')) {
    return isPrinting ? (
      <span>RepeatsDB: [{entry.type}]</span>
    ) : (
      <Link
        href={`https://repeatsdb.bio.unipd.it/protein/${entry.protein}`}
        target="_blank"
      >
        RepeatsDB: [{entry.type}]
      </Link>
    );
  }
  return null;
};

export default ExceptionalLabels;
