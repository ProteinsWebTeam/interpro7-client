// @flow
import React, { PureComponent } from 'react';
import { sleep } from 'timing-functions/src';

import Link from 'components/generic/Link';

import getNewPartsFromOldURL from 'utils/interpro6-url-pattern';

import config from 'config';

import { foundationPartial } from 'styles/foundation';

import styles from './styles.css';
import ebiGlobalStyles from 'ebi-framework/css/ebi-global.css';

const f = foundationPartial(ebiGlobalStyles, styles);

const TWO_SECONDS = 2000;
const BASE_URL_FOR_IP6 = 'https://www.ebi.ac.uk/interpro';

class NotFound extends PureComponent /*:: <{}> */ {
  async componentDidMount() {
    // check if the current URL is actually matching
    // a URL pattern from the previous website
    const newUrlParts = getNewPartsFromOldURL(window.location.pathname);
    if (!newUrlParts) return;
    // If not coming from previous IP6, await a bit before redirecting
    if (!document.referrer.startsWith(BASE_URL_FOR_IP6)) {
      await sleep(TWO_SECONDS);
      // Just to give time to the user to realise that something is wrong
      // (because they might be coming from a bookmark)
    }
    window.location.replace(
      `${config.root.website.pathname}/${newUrlParts.join('/')}/`,
    );
  }

  render() {
    return (
      <section className={f('error-msg')}>
        <div className={f('row')}>
          <div className={f('small-12', 'columns', 'small-centered')}>
            <h5>404: Page Not Found</h5>
            <h1 className={f('oversized')}>Keep searching…</h1>
            <h5 className={f('lead')}>
              We are sorry, the page you were trying to access doesn’t exist.
            </h5>
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
