import React from 'react';
import { Helmet } from 'react-helmet-async';
import Link from 'components/generic/Link';
import Twitter from 'components/Twitter';

import cssBinder from 'styles/cssBinder';

import ipro from 'styles/interpro-vf.css';
import fonts from 'EBI-Icon-fonts/fonts.css';

const css = cssBinder(fonts, ipro);

const Contact = () => {
  return (
    <section className={css('vf-stack', 'vf-stack--400')}>
      <Helmet>
        <title>Contact us</title>
      </Helmet>

      <h3>Contact us</h3>
      <p>Please use one of the following channels to get in touch with us.</p>

      <h4>InterPro</h4>
      <ul className={css('vf-list')}>
        <li>
          <Link
            href="//www.ebi.ac.uk/support/interpro"
            target="_blank"
            withReferrer
          >
            <span className={css('icon', 'icon-common')} data-icon="&#x6e;" />{' '}
            Submit a ticket
          </Link>
        </li>
        <li>
          <Twitter />
        </li>
        <li>
          <Link
            href="https://www.linkedin.com/company/interpro-pfam/"
            target="_blank"
            withReferrer
          >
            <span className={css('icon', 'icon-common')} data-icon="&#xf08c;" />{' '}
            LinkedIn account
          </Link>
        </li>
      </ul>

      <h4>Pfam</h4>
      <ul className={css('vf-list')}>
        <li>
          <Link
            href="//www.ebi.ac.uk/support/pfam"
            target="_blank"
            withReferrer
          >
            <span className={css('icon', 'icon-common')} data-icon="&#x6e;" />{' '}
            Submit a ticket
          </Link>
        </li>
        <li>
          <Twitter handler="PfamDB" />
        </li>
      </ul>
    </section>
  );
};

export default Contact;
