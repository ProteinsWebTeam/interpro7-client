// @flow
import React, { PureComponent } from 'react';
import T from 'prop-types';
import { format } from 'url';
import { createSelector } from 'reselect';

import { foundationPartial } from 'styles/foundation';
import Link from 'components/generic/Link';
import AnimatedEntry from 'components/AnimatedEntry';

import loadData from 'higherOrder/loadData';
import { toPlural } from 'utils/pages';

import { speciesFeat } from 'staticData/home';

import ipro from 'styles/interpro-new.css';
import ebiGlobalStyles from 'ebi-framework/css/ebi-global.scss';
import fonts from 'EBI-Icon-fonts/fonts.css';
import theme from 'styles/theme-interpro.css';
import byX from '../styles.css';
import local from './styles.css';

const f = foundationPartial(ebiGlobalStyles, fonts, ipro, theme, byX, local);

const getCountString = (
  payload /*: ?Object */,
  loading /*: boolean */,
  taxId /*: number */,
  type /*: string */,
) => {
  if (loading || !payload) return `… ${toPlural(type)}`;
  const count = payload[taxId];
  if (!count) return `no ${type}`;
  if (count === 1) return `1 ${type}`;
  return `${count} ${toPlural(type)}`;
};

/*:: type Props = {
  data: {
    loading: boolean,
    payload: ?Object,
  },
  dataEntry: {
    loading: boolean,
    payload: ?Object,
  }
}; */

class BySpecies extends PureComponent /*:: <Props> */ {
  static propTypes = {
    data: T.shape({
      loading: T.bool.isRequired,
      payload: T.object,
    }).isRequired,
    dataEntry: T.shape({
      loading: T.bool.isRequired,
      payload: T.object,
    }).isRequired,
  };

  render() {
    const {
      data: { loading, payload },
      dataEntry: { loading: loadingE, payload: payloadE },
    } = this.props;
    return (
      <div className={f('species-list')}>
        <AnimatedEntry className={f('row')} element="div">
          {// TODO: Include number of entries
          // The result in the tab counts the number of proteins.
          // This comes from a /proteins?group_by=tax_id
          // A similar query but for entries needs to be supported in the API.
          // Once there an update of this component is required
          speciesFeat.map(e => (
            <div
              className={f(
                'column',
                'small-3',
                'medium-2',
                'large-4',
                'text-center',
              )}
              key={e.tax_id || 'unclassified'}
            >
              <Link
                to={{
                  description: {
                    main: { key: 'organism' },
                    organism: {
                      taxonomyDB: 'taxonomy',
                      taxonomyAccession: e.tax_id,
                    },
                  },
                }}
              >
                <span
                  style={{ color: e.color }}
                  className={f('small', 'icon', 'icon-species')}
                  data-icon={e.icon}
                />
                <h6>{e.title}</h6>
              </Link>
              <p>
                <Link
                  to={{
                    description: {
                      main: { key: 'organism' },
                      organism: {
                        taxonomyDB: 'taxonomy',
                        taxonomyAccession: e.tax_id,
                      },
                      entry: { db: 'InterPro' },
                    },
                  }}
                >
                  {getCountString(payloadE, loadingE, e.tax_id, 'entry')}
                </Link>
                <br />
                <Link
                  to={{
                    description: {
                      main: { key: 'organism' },
                      organism: {
                        taxonomyDB: 'taxonomy',
                        taxonomyAccession: e.tax_id,
                      },
                      protein: { db: 'UniProt' },
                    },
                  }}
                >
                  {getCountString(payload, loading, e.tax_id, 'protein')}
                </Link>
              </p>
            </div>
          ))}
        </AnimatedEntry>
        <Link
          to={{
            description: {
              main: { key: 'organism' },
              organism: { taxonomyDB: 'taxonomy' },
            },
          }}
          className={f('button')}
        >
          View all Organism
        </Link>
      </div>
    );
  }
}

const mapStateToUrl = endpoint =>
  createSelector(
    state => state.settings.api,
    ({ protocol, hostname, port, root }) =>
      format({
        protocol,
        hostname,
        port,
        pathname: `${root}/${endpoint}`,
        query: { group_by: 'tax_id' },
      }),
  );

export default loadData({
  getUrl: mapStateToUrl('entry'),
  propNamespace: 'Entry',
})(loadData(mapStateToUrl('protein'))(BySpecies));
