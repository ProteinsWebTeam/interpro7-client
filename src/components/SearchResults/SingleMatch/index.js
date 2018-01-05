import React, { PureComponent } from 'react';
import T from 'prop-types';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { sleep } from 'timing-functions/src';

import Tooltip from 'components/SimpleCommonComponents/Tooltip';

import Link from 'components/generic/Link';
import Redirect from 'components/generic/Redirect';

import { changeSettings } from 'actions/creators';

import { foundationPartial } from 'styles/foundation';

import ebiGlobalStyles from 'ebi-framework/css/ebi-global.scss';
import ipro from 'styles/interpro-new.css';
import styles from './style.css';

const f = foundationPartial(ebiGlobalStyles, ipro, styles);

const INTERPRO_ACCESSION_PADDING = 6;
const TOGGLE_DURATION = 500;

class _SingleMatchWrapper extends PureComponent {
  static propTypes = {
    to: T.object.isRequired,
    children: T.any.isRequired,
    autoRedirect: T.bool.isRequired,
    changeSettings: T.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      triggerRedirect: props.autoRedirect,
    };
  }

  _handleChange = async event => {
    this.props.changeSettings(event);
    await sleep(TOGGLE_DURATION);
    this.setState({ triggerRedirect: true });
  };

  render() {
    const { autoRedirect, to, children } = this.props;
    const LinkOrRedirect = this.state.triggerRedirect ? Redirect : Link;
    return (
      <div className={f('callout', 'info', 'flex')}>
        <div>
          <h5>Found an exact match</h5>
          <LinkOrRedirect to={to}>{children}</LinkOrRedirect>
        </div>
        <Tooltip
          interactive
          useContext
          html={
            <React.Fragment>
              <span>
                This will take you to the corresponding page if there is an
                exact match.
              </span>
              <br />
              <span>
                {'This can be changed back in the '}
                <Link
                  className={f('link-in-tooltip')}
                  to={{ description: { other: ['settings'] } }}
                >
                  Settings
                </Link>
                {' page'}
              </span>
            </React.Fragment>
          }
        >
          <form className={f('flex', 'settings')} data-category="navigation">
            <span>auto redirect</span>
            <div className={f('switch', 'tiny')}>
              <input
                onChange={this._handleChange}
                type="checkbox"
                checked={autoRedirect}
                className={f('switch-input')}
                name="autoRedirect"
                id="autoRedirect-input"
              />
              <label
                className={f('switch-paddle')}
                htmlFor="autoRedirect-input"
              >
                <span className={f('show-for-sr')}>Automatic redirect:</span>
                <span className={f('switch-active')} aria-hidden="true">
                  On
                </span>
                <span className={f('switch-inactive')} aria-hidden="true">
                  Off
                </span>
              </label>
            </div>
          </form>
        </Tooltip>
      </div>
    );
  }
}

const mapStateToProps = createSelector(
  state => state.settings.navigation.autoRedirect,
  autoRedirect => ({ autoRedirect }),
);

const SingleMatchWrapper = connect(mapStateToProps, { changeSettings })(
  _SingleMatchWrapper,
);

class SingleMatch extends PureComponent {
  static propTypes = {
    payload: T.object.isRequired,
    searchValue: T.string.isRequired,
  };

  render() {
    const { searchValue, payload } = this.props;
    const searchRE = new RegExp(
      `^${searchValue}|IPR${searchValue.padStart(
        INTERPRO_ACCESSION_PADDING,
        '0',
      )}`,
      'i',
    );
    for (const accession of payload.entries.map(entry => entry.id)) {
      if (searchRE.test(accession)) {
        return (
          <SingleMatchWrapper
            to={{
              description: {
                main: { key: 'entry' },
                entry: { db: 'InterPro', accession },
              },
            }}
          >
            Entry: {accession}
          </SingleMatchWrapper>
        );
      }
    }
    for (const accession of payload.entries[0].fields.PDB) {
      if (searchRE.test(accession)) {
        return (
          <SingleMatchWrapper
            to={{
              description: {
                main: { key: 'structure' },
                structure: { db: 'PDB', accession },
              },
            }}
          >
            Structure: {accession}
          </SingleMatchWrapper>
        );
      }
    }
    for (const accession of payload.entries[0].fields.UNIPROT) {
      if (searchRE.test(accession)) {
        return (
          <SingleMatchWrapper
            to={{
              description: {
                main: { key: 'protein' },
                protein: { db: 'UniProt', accession },
              },
            }}
          >
            Protein: {accession}
          </SingleMatchWrapper>
        );
      }
    }
    return null;
  }
}

export default SingleMatch;
