import React from 'react';

import { NOT_MEMBER_DBS } from 'menuConfig';
import Link from 'components/generic/Link';

import {
  AlphafoldLink,
  PTMLink,
  BFVDLink,
} from 'components/ExtLink/patternLinkWrapper';
import Tooltip from 'components/SimpleCommonComponents/Tooltip';

import { FunFamLink } from 'subPages/Subfamilies';

import { ExtendedFeature } from '../../utils';

import cssBinder from 'styles/cssBinder';

import style from '../../../ProteinViewer/style.css';

const css = cssBinder(style);

type PropsEL = {
  entry: ExtendedFeature;
  isPrinting: boolean;
  databases?: DBsInfo;
};

const EXCEPTIONAL_TYPES = [
  'intrinsically_disordered_regions',
  'residue',
  'sequence_conservation',
  'chain',
  'secondary_structure',
  'variation',
  'ptm',
];
const EXCEPTIONAL_PREFIXES = ['G3D:', 'REPEAT:', 'DISPROT:', 'TED:'];
const WITH_TOP_PADDING = ['REPEAT:', 'TED:'];

export const isStandaloneLabel = (entry: ExtendedFeature): boolean => {
  return WITH_TOP_PADDING.some((prefix) => entry.accession.startsWith(prefix));
};

export const isAnExceptionalLabel = (entry: ExtendedFeature): boolean => {
  return (
    // Exceptional types coming from InterPro (e.g PTMs), should not result in an ExceptionalLabel.
    (EXCEPTIONAL_TYPES.includes(entry.type || '') &&
      entry.source_database !== 'interpro') ||
    NOT_MEMBER_DBS.has(entry.source_database || '') ||
    EXCEPTIONAL_PREFIXES.some((prefix) => entry.accession.startsWith(prefix))
  );
};

const ExceptionalLabels = ({ entry, isPrinting, databases }: PropsEL) => {
  const label = (entry.locations?.[0]?.fragments?.[0]?.seq_feature ||
    entry.name ||
    entry.accession) as string;

  if (
    entry.source_database === 'mobidblt' ||
    entry.source_database === 'mobidb-lite'
  ) {
    const comesFromIPscan =
      entry.protein?.includes('iprscan') ||
      entry.protein?.includes('imported_file');

    return (
      <>
        {isPrinting ? (
          <span>{entry.accession}</span>
        ) : comesFromIPscan ? (
          <b> {entry.accession.replace('Mobidblt-', 'MobiDB-lite: ')} </b>
        ) : (
          <Link target="_blank" href={`https://mobidb.org/${entry.protein}`}>
            {entry.accession.replace('Mobidblt-', 'MobiDB-lite: ')}
          </Link>
        )}
        {entry.children &&
          entry.children.map((d) => (
            <div className={css('centered-label')} key={`main_${d.accession}`}>
              {d.accession.replace('Mobidblt-', '')}
            </div>
          ))}
      </>
    );
  }

  if (
    entry.source_database?.toLowerCase() === 'funfam' ||
    entry.source_database?.toLowerCase() === 'cath-funfam'
  ) {
    return isPrinting ? (
      <span>{label}</span>
    ) : (
      <FunFamLink accession={entry.accession}>{label}</FunFamLink>
    );
  }
  if (entry.source_database === 'pfam-n') {
    return isPrinting ? (
      <span>Pfam-N: {entry.accession}</span>
    ) : (
      <Link
        to={{
          description: {
            main: { key: 'entry' },
            entry: { db: 'pfam', accession: entry.accession },
          },
        }}
      >
        Pfam-N: {label}
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

  if (entry.source_database === 'bfvd') {
    return isPrinting ? (
      <span>pLDDT</span>
    ) : (
      <BFVDLink id={entry.protein || ''} className={css('ext')}>
        pLDDT
      </BFVDLink>
    );
  }

  if (entry.source_database === 'ptm') {
    return isPrinting ? (
      <span>UniProt</span>
    ) : (
      <PTMLink id={entry.accession || ''} className={css('ext')}>
        {entry.name}
      </PTMLink>
    );
  }

  if (entry.source_database === 'elm')
    return isPrinting ? (
      <span>{label}</span>
    ) : (
      <Link href={`http://elm.eu.org/${entry.accession}`}>{label}</Link>
    );
  if (entry.source_database === 'proteinsAPI')
    return isPrinting ? (
      <span>{label}</span>
    ) : (
      <Link
        className={css('ext')}
        href={`https://www.uniprot.org/uniprotkb/${entry.protein}/variant-viewer`}
        target="_blank"
      >
        Go to UniProt
      </Link>
    );

  if (entry.type === 'residue') {
    const processedAccession = entry.accession.replace('residue:', '');
    const descriptionString = entry.locations?.[0].description;

    return isPrinting ? (
      <span>Residue: {processedAccession}</span>
    ) : (
      <>
        {entry.source_database !== 'pirsr' && (
          <Link
            to={{
              description: {
                main: { key: 'entry' },
                entry: {
                  db: entry.source_database,
                  accession: processedAccession,
                },
              },
            }}
          >
            {processedAccession}
          </Link>
        )}

        <div
          className={css(
            processedAccession === 'PIRSR_GROUP' ? 'pirsr-label' : '',
          )}
        >
          {descriptionString}
        </div>
      </>
    );
  }

  if (
    NOT_MEMBER_DBS.has(entry.source_database || '') ||
    entry.type === 'chain' ||
    entry.type === 'secondary_structure'
  )
    return (
      <>
        <span style={{ textTransform: 'capitalize' }}>
          {(entry.source_database || '').replace('_', ' ')}:
        </span>{' '}
        {label}
      </>
    );
  if (entry.type === 'sequence_conservation') {
    return (
      <Tooltip title={'Score calculated using Phmmer and HMM profile'}>
        <div className={css('sequence-conservation-label')}>
          {databases?.[entry.accession]?.name || entry.accession} conservation
        </div>
      </Tooltip>
    );
  }

  if (entry.accession && entry.accession.startsWith('REPEAT:')) {
    return isPrinting ? (
      <span>RepeatsDB</span>
    ) : (
      <Link
        href={`https://repeatsdb.org/annotations/source/AlphaFoldDB/structure/${
          entry.accession.split(':')[1]
        }/chain/A`}
        target="_blank"
        className={css('ext')}
      >
        RepeatsDB
      </Link>
    );
  }
  if (entry.accession && entry.accession.startsWith('DISPROT:')) {
    return isPrinting ? (
      <span>DisProt consensus</span>
    ) : (
      <Link
        href={`https://disprot.org/${entry.protein}`}
        target="_blank"
        className={css('ext')}
      >
        DisProt consensus
      </Link>
    );
  }
  if (entry.accession && entry.accession.startsWith('TED:')) {
    return isPrinting ? (
      <span>TED domains</span>
    ) : (
      <Link
        href={`https://ted.cathdb.info/uniprot/${entry.protein}`}
        target="_blank"
        className={css('ext')}
      >
        TED domains
      </Link>
    );
  }
  return null;
};

export default ExceptionalLabels;
