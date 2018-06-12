import React, { PureComponent } from 'react';

import Link from 'components/generic/Link';

import { foundationPartial } from 'styles/foundation';

import ipro from 'styles/interpro-new.css';
import ebiGlobalStyles from 'ebi-framework/css/ebi-global.css';
import fonts from 'EBI-Icon-fonts/fonts.css';
import local from './style.css';

const f = foundationPartial(ebiGlobalStyles, fonts, ipro, local);

class Release_notes extends PureComponent /*:: <{}> */ {
  render() {
    return (
      <div className={f('row')}>
        <div className={f('columns')}>
          <section>
            <h3>Release notes</h3>

            <h4>Member database information</h4>
            <table className={f('classic')}>
              <thead>
                {' '}
                <tr>
                  <th>Signature database</th>
                  <th>Version</th>
                  <th>Signatures*</th>
                  <th>Integrated signatures**</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>InterProScan 5.29-68.0</td>
                  <td>
                    Download and install the latest version of InterProScan
                    (64-bit Linux)
                  </td>
                  <td>v68.0</td>
                  <td>interproscan-5.29-68.0-64-bit.tar.gz</td>
                </tr>
              </tbody>
            </table>

            <p className={f('small', 'margin-top-small')}>
              To ensure you have the latest data and software enhancements we
              always recommend you download the latest version of InterProScan.
              However all previous releases are archived on the{' '}
              <Link
                href="ftp://ftp.ebi.ac.uk/pub/software/unix/iprscan/5/"
                target="_blank"
              >
                FTP site
              </Link>. You can find, clone, and download the full InterProScan
              source code on the{' '}
              <Link
                href="//github.com/ebi-pf-team/interproscan"
                className={f('ext')}
                target="_blank"
              >
                Github repository
              </Link>.
            </p>
          </section>
        </div>
      </div>
    );
  }
}

export default Release_notes;
