import React, { PureComponent } from 'react';
import T from 'prop-types';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { format } from 'url';

import EntryMenuLink from './EntryMenuLink';
import Loading from 'components/SimpleCommonComponents/Loading';
import config from 'config';
import { entities, singleEntity } from 'menuConfig';
import loadData from 'higherOrder/loadData';
import descriptionToPath from 'utils/processDescription/descriptionToPath';

import { foundationPartial } from 'styles/foundation';

import styles from './style.css';

const f = foundationPartial(styles);

/*:: type Props = {
  mainType: ?string,
  mainDB: ?string,
  mainAccession: ?string,
  data: {
    loading: boolean,
    payload?: ?Object,
  },
  children: ?any,
  className: ?string,
}; */

export class EntryMenuWithoutData extends PureComponent /*:: <Props> */ {
  static propTypes = {
    mainType: T.string,
    mainDB: T.string,
    mainAccession: T.string,
    proteomeDB: T.string,
    proteomeAccession: T.string,
    isSignature: T.bool.isRequired,
    data: T.shape({
      loading: T.bool.isRequired,
      payload: T.any,
    }).isRequired,
    children: T.any,
    className: T.string,
  };

  render() {
    const {
      mainType,
      mainDB,
      mainAccession,
      proteomeDB,
      proteomeAccession,
      data,
      isSignature,
      children,
      data: { loading, payload },
      className,
    } = this.props;
    let tabs = entities;
    if (
      (mainAccession || proteomeAccession) &&
      mainType &&
      config.pages[mainType]
    ) {
      tabs = [singleEntity.get('overview')];
      for (const subPage of config.pages[mainType].subPages) {
        if (
          !(
            subPage === 'proteome' &&
            proteomeDB === 'proteome' &&
            mainDB === null
          )
        )
          tabs.push(singleEntity.get(subPage));
      }
      tabs = tabs.filter(Boolean);
    }
    if (loading || !payload.metadata) {
      return <Loading />;
    }
    return (
      <ul className={f('tabs', className, { sign: isSignature })}>
        {children}
        {tabs.map(e => (
          <EntryMenuLink
            key={e.name}
            metadata={payload.metadata}
            to={e.to}
            exact={e.exact}
            activeClass={e.activeClass}
            name={e.name}
            data={data}
            counter={e.counter}
            isFirstLevel={!mainAccession}
            isSignature={isSignature}
          />
        ))}
      </ul>
    );
  }
}

const mapStateToProps = createSelector(
  state => state.customLocation.description.main.key,
  state =>
    state.customLocation.description.main.key &&
    state.customLocation.description[state.customLocation.description.main.key]
      .db,
  state =>
    state.customLocation.description[state.customLocation.description.main.key]
      .accession,
  state =>
    state.customLocation.description.main.key === 'organism'
      ? state.customLocation.description.organism.proteomeDB
      : null,
  state =>
    state.customLocation.description.main.key === 'organism'
      ? state.customLocation.description.organism.proteomeAccession
      : null,
  (mainType, mainDB, mainAccession, proteomeDB, proteomeAccession) => ({
    mainType,
    mainDB,
    mainAccession,
    proteomeDB,
    proteomeAccession,
    isSignature: !!(
      mainType === 'entry' &&
      mainDB !== 'InterPro' &&
      mainAccession
    ),
  }),
);

const mapStateToUrl = createSelector(
  state => state.settings.api,
  state => state.customLocation.description.main.key,
  state =>
    state.customLocation.description.main.key &&
    state.customLocation.description[state.customLocation.description.main.key]
      .db,
  state =>
    state.customLocation.description[state.customLocation.description.main.key]
      .accession,
  state =>
    state.customLocation.description.main.key === 'organism'
      ? state.customLocation.description.organism.proteomeDB
      : null,
  state =>
    state.customLocation.description.main.key === 'organism'
      ? state.customLocation.description.organism.proteomeAccession
      : null,
  (
    { protocol, hostname, port, root },
    mainType,
    db,
    accession,
    proteomeDB,
    proteomeAccession,
  ) => {
    if (!accession && !proteomeAccession) return;
    return format({
      protocol,
      hostname,
      port,
      pathname:
        root +
        descriptionToPath({
          main: { key: mainType },
          [mainType]: {
            db,
            accession,
            proteomeDB: proteomeAccession ? proteomeDB : null,
            proteomeAccession,
          },
        }),
    });
  },
);

export default loadData(mapStateToUrl)(
  connect(mapStateToProps)(EntryMenuWithoutData),
);
