import React, { useState, useEffect } from 'react';
import {
  StructureElement,
  StructureProperties,
} from 'molstar/lib/mol-model/structure';

import cssBinder from 'styles/cssBinder';

import style from '../style.css';
import { PluginContext } from 'molstar/lib/mol-plugin/context';
const css = cssBinder(style);

const MAX_ACCESSION_LENGTH = 20;

/**
 * Function hook for 3D model labels
 * returns information on residue highlighted on 3D structure
 * @param {Object} props - react props
 * @returns {Object} react element
 */

type Props = {
  viewer: PluginContext | null;
  accession: string;
};

type LabelData = {
  accession: string;
  residue: string;
  chain: string;
  location: number;
  seq_location: number;
  seq_chain: string;
};
const Labels = (props: Props) => {
  const [labelData, setLabelData] = useState<LabelData>();

  useEffect(() => {
    if (props.viewer) {
      props.viewer.behaviors.interaction.hover.subscribe((arg) => {
        const loci = arg.current.loci;
        if (loci.kind === 'element-loci' && loci.elements.length === 1) {
          const stats = StructureElement.Stats.ofLoci(loci);
          const { residueCount } = stats;
          if (residueCount > 0) {
            const location = stats.firstResidueLoc;
            const data: LabelData = {
              accession: location.unit.model.entryId,
              residue: StructureProperties.atom.label_comp_id(location),
              location: StructureProperties.residue.auth_seq_id(location),
              chain: StructureProperties.chain.auth_asym_id(location),
              seq_location: StructureProperties.residue.label_seq_id(location),
              seq_chain: StructureProperties.chain.label_asym_id(location),
            };
            if (data.accession.length > MAX_ACCESSION_LENGTH) {
              data.accession = props.accession;
            }
            if (
              labelData === undefined ||
              data.location !== labelData.location
            ) {
              setLabelData(data);
            }
          }
        } else {
          setLabelData(undefined);
        }
      });
    }
  }, [props.viewer]);

  if (labelData && labelData.location !== undefined) {
    return (
      <div className={css('structure-label')}>
        <small>{labelData.accession} </small>
        Chain: <b>{labelData.chain} </b>
        Residue: <b>{labelData.residue} </b>
        {labelData.location}
      </div>
    );
  }
  return <div className={css('structure-label')} />;
};

export default Labels;
