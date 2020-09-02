import React from 'react';
import T from 'prop-types';
import { foundationPartial } from 'styles/foundation';

import config from 'config';
import fonts from 'EBI-Icon-fonts/fonts.css';
import style from './style.css';
import Link from 'components/generic/Link';

const f = foundationPartial(style, fonts);

const helpTopics = {
  InterProScan: {
    documentation: {
      href: `${config.root.readthedocs.href}searchways.html#sequence-search`,
      target: '_blank',
    },
    training: {
      href:
        'http://www.ebi.ac.uk/training/online/course/interpro-functional-and-structural-analysis-protei/sequence-searching',
      target: '_blank',
    },
  },
  IDA: {
    documentation: {
      href: `${config.root.readthedocs.href}searchways.html#domain-architecture-search`,
      target: '_blank',
    },
  },
  TextSearch: {
    documentation: {
      href: `${config.root.readthedocs.href}searchways.html#text-search`,
      target: '_blank',
    },
  },
  default: {
    documentation: {
      to: { description: { other: ['help', 'documentation'] } },
    },
  },
};

export const HelpBanner = ({ topic } /*: {topic: string} */) => {
  const current = helpTopics[topic] || helpTopics.default;
  return (
    <div className={f('help-banner', 'flex-card')}>
      <header>
        <span
          className={f('icon', 'icon-common', 'font-l')}
          data-icon="&#xf059;"
        />{' '}
        Need more Help?
      </header>
      <div>
        If you need more info on {topic}, you can either look at the:
        <br />
        <span
          className={f('icon', 'icon-common', 'font-l')}
          data-icon="&#xf02d;"
        />{' '}
        <Link
          {...current.documentation}
          className={f({ ext: current.documentation.target })}
        >
          Documentation page
        </Link>
        <br />
        {current.training && (
          <>
            <span
              className={f('icon', 'icon-common', 'font-l')}
              data-icon="&#xf2ff;"
            />{' '}
            <Link
              {...current.training}
              className={f({ ext: current.training.target })}
            >
              Online training course
            </Link>
            <br />
          </>
        )}
        or{' '}
        <Link
          href="http://www.ebi.ac.uk/support/interpro-general-query"
          target="_blank"
        >
          contact us
        </Link>{' '}
        directly with your question.
      </div>
    </div>
  );
};
HelpBanner.propTypes = {
  topic: T.string,
};

export default React.memo(HelpBanner);
