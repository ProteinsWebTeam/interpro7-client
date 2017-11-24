// @flow
import React, { PureComponent } from 'react';

import { OldLink } from 'components/generic/Link';

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
              <OldLink newTo={{ description: {} }}>homepage</OldLink>
              {'. If you continue to get this page, contact us using the '}
              <OldLink
                target="_blank"
                href="http://www.ebi.ac.uk/support/interpro-general-query"
              >
                EMBL-EBI feedback form
              </OldLink>
            </p>
            <br />
            <h3>Or try one of these:</h3>
            <ul>
              <li>
                <OldLink newTo={{ description: { other: 'release_notes' } }}>
                  What’s new in InterPro?
                </OldLink>
              </li>
              <li>
                <OldLink newTo={{ description: { other: 'help' } }}>
                  InterPro Training and tutorial material
                </OldLink>
              </li>
              <li>
                <OldLink newTo={{ description: { other: 'help' } }}>
                  InterPro FAQs
                </OldLink>
              </li>
              <li>
                <OldLink newTo={{ description: { other: 'help' } }}>
                  InterPro Documentation
                </OldLink>
              </li>
              <li>
                <OldLink newTo={{ description: { other: 'help' } }}>
                  InterPro Help/support
                </OldLink>
              </li>
            </ul>
          </div>
        </div>
      </section>
    );
  }
}

export default NotFound;
