import React, { PureComponent } from 'react';
import T from 'prop-types';

import {
  dataPropType,
  metadataPropType,
} from 'higherOrder/loadData/dataPropTypes';

import Link from 'components/generic/Link';
// $FlowFixMe
import Tooltip from 'components/SimpleCommonComponents/Tooltip';
import HighlightedText from 'components/SimpleCommonComponents/HighlightedText';
import NumberComponent from 'components/NumberComponent';

import { SpeciesIcon } from 'pages/Taxonomy';
import MemberSymbol from 'components/Entry/MemberSymbol';

import { toPlural } from 'utils/pages';

import { foundationPartial } from 'styles/foundation';

import ebiGlobalStyles from 'ebi-framework/css/ebi-global.css';
import pageStyle from 'pages/style.css';
import styles from 'styles/blocks.css';
import fonts from 'EBI-Icon-fonts/fonts.css';

const f = foundationPartial(ebiGlobalStyles, pageStyle, styles, fonts);

/*:: type SummaryCounterProteomeProps = {
  entryDB: string,
  metadata: Object,
  counters: Object
};*/
class SummaryCounterProteome extends PureComponent /*:: <SummaryCounterProteomeProps> */ {
  static propTypes = {
    entryDB: T.string,
    metadata: metadataPropType.isRequired,
    counters: T.object.isRequired,
  };

  render() {
    const { entryDB, metadata, counters } = this.props;

    const { entries, proteins, structures } = counters;

    const name = metadata.name.name || metadata.name;

    return (
      <div className={f('card-block', 'card-counter', 'label-off')}>
        <Tooltip
          title={`${entries} ${entryDB || ''} ${toPlural(
            'entry',
            entries,
          )} matching ${name}`}
          className={f('count-entries')}
          style={{ display: 'flex' }}
        >
          <Link
            to={{
              description: {
                main: { key: 'proteome' },
                proteome: {
                  db: 'uniprot',
                  accession: metadata.accession.toString(),
                },
                entry: { isFilter: true, db: entryDB && 'all' },
              },
            }}
            disabled={!entries}
          >
            <div className={f('icon-wrapper')}>
              <MemberSymbol type={entryDB || 'all'} className={f('md-small')} />
              {entries !== 0 && (
                <div className={f('icon-over-anim', 'mod-img-pos')} />
              )}
            </div>
            <NumberComponent abbr>{entries}</NumberComponent>
            <span className={f('label-number')}>
              {toPlural('entry', entries)}
            </span>
          </Link>
        </Tooltip>

        <Tooltip
          title={`${proteins}  ${toPlural(
            'protein',
            proteins,
          )} matching ${name}`}
          className={f('count-proteins')}
          style={{ display: 'flex' }}
        >
          <Link
            to={{
              description: {
                main: { key: 'proteome' },
                proteome: {
                  db: 'uniprot',
                  accession: metadata.accession.toString(),
                },
                protein: { isFilter: true, db: 'UniProt' },
              },
            }}
            disabled={!proteins}
          >
            <div
              className={f('icon', 'icon-conceptual', 'icon-wrapper')}
              data-icon="&#x50;"
            >
              {proteins !== 0 && <div className={f('icon-over-anim')} />}
            </div>
            <NumberComponent abbr>{proteins}</NumberComponent>
            <span className={f('label-number')}>
              {' '}
              {toPlural('protein', proteins)}
            </span>
          </Link>
        </Tooltip>

        <Tooltip
          title={`${structures} ${toPlural(
            'structure',
            structures,
          )} matching ${name}`}
          className={f('count-structures')}
          style={{ display: 'flex' }}
        >
          <Link
            to={{
              description: {
                main: { key: 'proteome' },
                proteome: {
                  db: 'uniprot',
                  accession: `${metadata.accession}`,
                },
                structure: { isFilter: true, db: 'PDB' },
              },
            }}
            disabled={!structures}
          >
            <div
              className={f('icon', 'icon-conceptual', 'icon-wrapper')}
              data-icon="&#x73;"
            >
              {structures !== 0 && <div className={f('icon-over-anim')} />}
            </div>
            <NumberComponent abbr>{structures}</NumberComponent>{' '}
            <span className={f('label-number')}>structures</span>
          </Link>
        </Tooltip>
      </div>
    );
  }
}

const ProteomeCard = (
  {
    data,
    search,
    entryDB,
  } /*: {data: Object, search: string, entryDB: string} */,
) => (
  <>
    <div className={f('card-header')}>
      <div className={f('card-image')}>
        {data.metadata && data.metadata.lineage && (
          <SpeciesIcon lineage={data.metadata.lineage} />
        )}
      </div>
      <div className={f('card-title')}>
        <h6>
          <Link
            to={{
              description: {
                main: { key: 'proteome' },
                proteome: {
                  db: data.metadata.source_database,
                  accession: `${data.metadata.accession}`,
                },
              },
            }}
          >
            <HighlightedText
              text={data.metadata.name.name || data.metadata.name}
              textToHighlight={search}
            />
          </Link>
        </h6>
      </div>
    </div>

    <SummaryCounterProteome
      entryDB={entryDB}
      metadata={data.metadata}
      counters={data.metadata.counters || data.extra_fields.counters}
    />

    <div className={f('card-footer')}>
      <div>
        <HighlightedText
          text={data.metadata.accession || ''}
          textToHighlight={search}
        />
      </div>
    </div>
  </>
);

ProteomeCard.propTypes = {
  data: dataPropType,
  search: T.string,
  entryDB: T.string,
};

export default ProteomeCard;
