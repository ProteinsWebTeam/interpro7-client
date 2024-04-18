import React from 'react';
import Link from 'components/generic/Link';
import cssBinder from 'styles/cssBinder';
import local from './style.css';
import ipro from 'styles/interpro-vf.css';
const css = cssBinder(local, ipro);

export const EBIHeader = () => (
  <header
    id="masthead-black-bar"
    className={css('clearfix', 'masthead-black-bar', 'tmp-ebi-header')}
  >
    <div>
      <nav className={css('row')}>
        <ul id="global-nav" className={css('menu', 'global-nav', 'text-right')}>
          <li className={css('ebi')}>
            <Link href="//www.ebi.ac.uk">EMBL-EBI</Link>
          </li>

          <li className={css('services')}>
            <Link href="//www.ebi.ac.uk/services">Services</Link>
          </li>

          <li className={css('research')}>
            <Link href="//www.ebi.ac.uk/research">Research</Link>
          </li>

          <li className={css('training')}>
            <Link href="//www.ebi.ac.uk/training">Training</Link>
          </li>

          <li className={css('about')}>
            <Link href="//www.ebi.ac.uk/about">About us</Link>
          </li>

          <li
            className={css(
              'float-right',
              'show-for-medium',
              'embl-selector',
              'embl-ebi',
            )}
          >
            <Link
              className={css('button', 'float-right')}
              href={'//www.ebi.ac.uk/'}
            >
              &nbsp;
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  </header>
);

export default EBIHeader;
