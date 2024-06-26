import React from 'react';

import InterProHierarchy from 'components/Entry/InterProHierarchy';
import OverlappingEntries from '../OverlappingEntries';

import cssBinder from 'styles/cssBinder';

import ipro from 'styles/interpro-vf.css';
import fonts from 'EBI-Icon-fonts/fonts.css';
import { getTooltipContentFormMetadata, MiniBadgeAI } from '../../BadgeAI';

const css = cssBinder(ipro, fonts);

type HierarchyProps = {
  hierarchy?: InterProHierarchyType;
  type: string;
  accession: string;
};

const Hierarchy = ({ hierarchy, type, accession }: HierarchyProps) =>
  hierarchy?.children?.length ? (
    <tr>
      <td className={css('first-letter-cap')}>
        {type.replace('_', ' ').toLowerCase()} relationships
      </td>
      <td>
        <InterProHierarchy accession={accession} hierarchy={hierarchy} />
      </td>
    </tr>
  ) : null;

const InterProSubtitle = ({
  metadata,
  hasLLM = false,
}: {
  metadata: EntryMetadata;
  hasLLM?: boolean;
}) => {
  return (
    <table className={css('vf-table', 'left-headers')}>
      <tbody>
        {metadata?.accession !== metadata?.name?.short && (
          <tr>
            <td>Short name</td>
            <td>
              <i className={css('shortname')}>{metadata.name.short}</i>{' '}
              {hasLLM && (
                <MiniBadgeAI
                  tooltipText={getTooltipContentFormMetadata(metadata)}
                />
              )}
            </td>
          </tr>
        )}
        <OverlappingEntries metadata={metadata} />
        <Hierarchy
          hierarchy={metadata.hierarchy}
          accession={metadata.accession}
          type={metadata.type}
        />
      </tbody>
    </table>
  );
};

export default InterProSubtitle;
