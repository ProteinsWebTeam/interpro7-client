// @flow
import React, { PureComponent } from 'react';
import { sleep } from 'timing-functions';

import Link from 'components/generic/Link';

import getNewPartsFromOldURL from 'utils/interpro6-url-pattern';

import config from 'config';

import { foundationPartial } from 'styles/foundation';

import styles from './styles.css';
import ebiGlobalStyles from 'ebi-framework/css/ebi-global.css';

const f = foundationPartial(ebiGlobalStyles, styles);

const A_LITTLE_WHILE = 4000;
const BASE_URL_FOR_IP6 = '/interpro/legacy';

class NotFound extends PureComponent /*:: <{}> */ {
  async componentDidMount() {
    // check if the current URL is actually matching
    // a URL pattern from the previous website
    const newUrlParts = getNewPartsFromOldURL(window.location.pathname);
    if (!newUrlParts) return;
    // wait a bit before redirecting
    await sleep(A_LITTLE_WHILE);
    // Just to give time to the user to realise that something is wrong
    // (because they might be coming from a bookmark)
    window.location.replace(
      `${config.root.website.pathname}/${newUrlParts.join('/')}/`,
    );
  }

  render() {
    const newUrlParts = getNewPartsFromOldURL(window.location.pathname);
    return (
      <section className={f('error-msg')}>
        <div className={f('row')}>
          <div className={f('small-12', 'columns', 'small-centered')}>
            <h3>404: Page Not Found</h3>
            <h1 className={f('oversized')}>No search results found</h1>
            <h5 className={f('lead')}>
              We are sorry, no data associated with your request could be found
              in InterPro.
            </h5>
            {newUrlParts && (
              <div className={f('timer')}>
                <div>
                  Searching for a corresponding page. You will be redirected to
                  it soon.
                </div>
              </div>
            )}
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
                <Link to={{ description: { other: ['help', 'tutorial'] } }}>
                  InterPro tutorials &amp; training material
                </Link>
              </li>
              <li>
                <Link to={{ description: { other: ['help', 'faqs'] } }}>
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
            </ul>
          </div>
        </div>
      </section>
    );
  }
}

export default NotFound;
