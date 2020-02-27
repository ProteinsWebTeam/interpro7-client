// @flow
import React from 'react';
import T from 'prop-types';

import Link from 'components/generic/Link';
import ResizeObserverComponent from 'wrappers/ResizeObserverComponent';

import { foundationPartial } from 'styles/foundation';

import interpro from 'styles/interpro-new.css';
import ebiGlobalStyles from 'ebi-framework/css/ebi-global.css';
import fonts from 'EBI-Icon-fonts/fonts.css';
import theme from 'styles/theme-interpro.css';

const f = foundationPartial(ebiGlobalStyles, fonts, interpro, theme);

const content = [
  {
    type: 'tool',
    link: '//github.com/ebi-pf-team/interproscan/wiki',
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
/*:: type ToolCardType = {
  type: string,
  github: string,
  title: string,
  link: string,
  imageClass: string,
  description: string,
 }; */
export const ToolCard = (
  { type, github, title, link, imageClass, description } /*: ToolCardType*/,
) => (
  <div className={f('flex-card')}>
    <div className={f('card-image', imageClass)}>
      <div className={f('card-tag', `tag-${type}`)}>{type}</div>
    </div>

    <div className={f('card-content')}>
      <div className={f('card-title')}>
        <h4>
          <Link href={github} target="_blank">
            {title}
          </Link>
        </h4>
      </div>
      <div className={f('card-description')}>{description}</div>
    </div>

    <div className={f('card-more')}>
      {github && (
        <Link href={github} target="_blank">
          <div className={f('icon', 'icon-common', 'icon-right', 'button-nu')}>
            <em className={f('icon', 'icon-common')} data-icon="&#xf09b;" />
          </div>
        </Link>
      )}

      <Link href={link} target="_blank">
        <div
          className={f('button-more', 'icon', 'icon-common', 'icon-right')}
          data-icon="&#xf061;"
        >
          Read more
        </div>
      </Link>
    </div>
  </div>
);
ToolCard.propTypes = {
  type: T.string,
  github: T.string,
  title: T.string,
  link: T.string,
  imageClass: T.string,
  description: T.string,
};

const minWidth = 300;

export const ToolCards = () => (
  <section>
    <div className={f('row', 'columns', 'margin-bottom-large')}>
      <ResizeObserverComponent measurements={['width']} element="div">
        {({ width }) => (
          <div className={f('flex-column')}>
            {content.slice(0, Math.min(width / minWidth)).map((card, i) => (
              <ToolCard key={i} {...card} />
            ))}
          </div>
        )}
      </ResizeObserverComponent>
    </div>
  </section>
);
