import React from 'react';

import Card from 'components/SimpleCommonComponents/Card';
import Link from 'components/generic/Link';

import config from 'config';

import cssBinder from 'styles/cssBinder';

import fonts from 'EBI-Icon-fonts/fonts.css';
import style from './style.css';

const css = cssBinder(style, fonts);

type Keys = 'InterProScan' | 'IDA' | 'TextSearch' | 'default';
type LinkInfo = {
  href: string;
  target?: string;
};
const helpTopics: Record<
  Keys,
  {
    documentation: LinkInfo;
    training?: LinkInfo;
  }
> = {
  InterProScan: {
    documentation: {
      href: `${config.root.readthedocs.href}searchways.html#sequence-search`,
      target: '_blank',
    },
    training: {
      href: 'http://www.ebi.ac.uk/training/online/course/interpro-functional-and-structural-analysis-protei/sequence-searching',
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
      href: '#',
      target: '_blank',
    },
  },
};

type Props = {
  topic: Keys;
};
export const HelpBanner = ({ topic }: Props) => {
  const current = helpTopics[topic] || helpTopics.default;
  return (
    <Card
      title={
        <span className={css('vf-card')}>
          <span
            className={css('icon', 'icon-common', 'font-l')}
            data-icon="&#xf059;"
          />{' '}
          Help & Support
        </span>
      }
    >
      <div className={css('help-banner')}>
        <div>
          Available {topic} resources:
          <br />
          <span
            className={css('icon', 'icon-common', 'font-l')}
            data-icon="&#xf02d;"
          />{' '}
          <Link
            {...current.documentation}
            className={css({ ext: current.documentation.target })}
          >
            Documentation
          </Link>
          <br />
          {current.training && (
            <>
              <span
                className={css('icon', 'icon-common', 'font-l')}
                data-icon="&#xf2ff;"
              />{' '}
              <Link
                {...current.training}
                className={css({ ext: current.training.target })}
              >
                Online training courses
              </Link>
              <br />
            </>
          )}
          <span
            className={css('icon', 'icon-common', 'font-l')}
            data-icon="&#xf0e0;"
          />{' '}
          <Link
            href="https://www.ebi.ac.uk/support/interpro-general-query"
            target="_blank"
          >
            Contact us
          </Link>
        </div>
      </div>
    </Card>
  );
};

export default React.memo(HelpBanner);
