// @flow
import React, { PureComponent } from 'react';

import Link from 'components/generic/Link';

import { foundationPartial } from 'styles/foundation';

import styles from './styles.css';

const f = foundationPartial(styles);

class NotFound extends PureComponent /*:: <{}> */ {
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
                href="http://www.ebi.ac.uk/support/interpro-general-query"
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

export default NotFound;
