import React from 'react';

import Link from 'components/generic/Link';
import ResizeObserverComponent from 'wrappers/ResizeObserverComponent';
import Card from 'components/SimpleCommonComponents/Card';

import cssBinder from 'styles/cssBinder';

import fonts from 'EBI-Icon-fonts/fonts.css';
import cards from 'components/SimpleCommonComponents/Card/styles.css';
import local from './styles.css';

const css = cssBinder(local, fonts, cards);

export const content = [
  {
    type: 'tool',
    link: '//interproscan-docs.readthedocs.io/en/latest/',
    title: 'InterProScan',
    description: `InterProScan is the software package that allows sequences
    (protein and nucleic) to be scanned against InterPro&apos;s
    signatures. Signatures are predictive models, provided by
    several different databases, that make up the InterPro
    consortium. InterProScan only runs on Linux machine.`,
    github: '//github.com/ebi-pf-team/interproscan',
    imageClass: 'image-tool-ipscan',
  },
  {
    type: 'tool',
    link: '//www.ebi.ac.uk/interpro/api/static_files/swagger/',
    title: 'A new API for InterPro',
    description: `You can now skip URL and use this JSON interface to work
    with your data directly. Currently there are 6 main
    endpoints: entry, protein, structure, taxonomy, proteome and
    set.`,
    github: '//github.com/ProteinsWebTeam/interpro7-api',
    imageClass: 'image-tool-api',
  },
  {
    type: 'library',
    link: '//ebi-webcomponents.github.io/nightingale',
    title: 'Nightingale',
    description: `Nigthtingale is a monorepo containing visualisation web
    components, including the formerly known Protvista, a
    powerful and blazing-fast tool for handling protein sequence
    visualisation in the browser. ProtVista has been developed
    by UniProt.`,
    github: '//github.com/ebi-webcomponents/nightingale',
    imageClass: 'image-tool-protvista',
  },
];
type ToolCardProps = {
  type: string;
  github: string;
  title: string;
  link: string;
  imageClass: string;
  description: string;
};
export const ToolCard = ({
  type,
  github,
  title,
  link,
  imageClass,
  description,
}: ToolCardProps) => (
  <Card
    imageIconClass={css(imageClass)}
    imageComponent={
      <div className={css('card-tag', `tag-${type}`)}>{type}</div>
    }
    title={
      <Link href={github} target="_blank">
        {title}
      </Link>
    }
    linkForMore={link}
    footer={
      github && (
        <Link href={github} target="_blank">
          <div
            className={css('icon', 'icon-common', 'icon-right', 'button-nu')}
          >
            <em className={css('icon', 'icon-common')} data-icon="&#xf09b;" />
          </div>
        </Link>
      )
    }
  >
    <div className={css('description')}>{description}</div>
  </Card>
);
const minWidth = 300;

export const ToolCards = () => (
  <section>
    <ResizeObserverComponent measurements={['width']} element="div">
      {({ width }: { width: number }) => (
        <div className={css('tools-container', 'vf-grid')}>
          {content.slice(0, Math.min(width / minWidth)).map((card, i) => (
            <ToolCard key={i} {...card} />
          ))}
        </div>
      )}
    </ResizeObserverComponent>
  </section>
);
