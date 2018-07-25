// @flow
import React, { PureComponent } from 'react';
import T from 'prop-types';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import config from 'config';

import { locationStateSelector } from 'reducers/custom-location/state';

import Link from 'components/generic/Link';

import { foundationPartial } from 'styles/foundation';

import styles from './styles.css';
import ebiGlobalStyles from 'ebi-framework/css/ebi-global.css';

const f = foundationPartial(ebiGlobalStyles, styles);

export class NotFound extends PureComponent /*:: <{ errorURL?: string }> */ {
  static propTypes = {
    errorURL: T.string,
  };

  render() {
    const { errorURL } = this.props;
    return (
      <section className={f('error-msg')}>
        <div className={f('row')}>
          <div className={f('small-12', 'columns', 'small-centered')}>
            <h5>404: Page Not Found</h5>
            <h1 className={f('oversized')}>Keep searching…</h1>
            <h5 className={f('lead')}>
              We are sorry, the page you were trying to access doesn’t exist.
            </h5>
            {errorURL ? (
              <p>
                You were trying to access{' '}
                <code>
                  {`${config.root.website.pathname}/${errorURL}`.replace(
                    /\/+/g,
                    '/',
                  )}
                </code>
              </p>
            ) : null}
            <br />
            <p>
              {'Double check the URL or go back to the '}
              <Link to={{ description: {} }}>homepage</Link>
              {'. If you continue to get this page, contact us using the '}
              <Link
                target="_blank"
                href="http://www.ebi.ac.uk/support/interpro"
                withReferrer
              >
                EMBL-EBI feedback form
              </Link>
            </p>
            <br />
            <h3>Or try one of these:</h3>
            <ul>
              <li>
                <Link to={{ description: { other: ['release_notes'] } }}>
                  What’s new in InterPro?
                </Link>
              </li>
              <li>
                <Link to={{ description: { other: ['help', 'training'] } }}>
                  InterPro Training and tutorial material
                </Link>
              </li>
              <li>
                <Link to={{ description: { other: ['help', 'faq'] } }}>
                  InterPro FAQs
                </Link>
              </li>
              <li>
                <Link
                  to={{ description: { other: ['help', 'documentation'] } }}
                >
                  InterPro Documentation
                </Link>
              </li>
              <li>
                <Link to={{ description: { other: ['help', 'support'] } }}>
                  InterPro Help/Support
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </section>
    );
  }
}

const mapStateToProps = createSelector(locationStateSelector, state => ({
  errorURL: state.errorURL,
}));

export default connect(mapStateToProps)(NotFound);
