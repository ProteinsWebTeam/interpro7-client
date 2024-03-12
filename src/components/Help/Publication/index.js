// @flow
import React from 'react';
import T from 'prop-types';

import Link from 'components/generic/Link';

import { foundationPartial } from 'styles/foundation';

import local from './style.css';

const f = foundationPartial(local);

const data4InterPro2022 = {
  url: 'https://doi.org/10.1093/nar/gkac993',
  title: 'InterPro in 2022',
  authors: `Paysan-Lafosse T, Blum M, Chuguransky S, Grego T, Pinto BL, Salazar GA, 
            Bileschi ML, Bork P, Bridge A, Colwell L, Gough J, Haft DH, Letunić I, 
            Marchler-Bauer A, Mi H, Natale DA, Orengo CA, Pandurangan AP, Rivoire C, 
            Sigrist CJA, Sillitoe I, Thanki N, Thomas PD, Tosatto SCE, Wu CH, Bateman A.`,
  source: 'Nucleic Acids Research, Nov 2022, (doi: 10.1093/nar/gkac993)',
  imageClass: 'image-nar-default',
};
const pubTypes = {
  url: T.string,
  title: T.string,
  authors: T.string,
  source: T.oneOfType([
    T.string,
    T.shape({
      journal: T.string,
      details: T.string,
    }),
  ]),
  imageClass: T.string,
  dark: T.bool,
};

export const PrintedPublication = (
  {
    title,
    authors,
    source,
    url,
    dark = false,
  } /*: { title: string, authors: string, source: string , url: string, dark?: boolean }*/,
) => (
  <blockquote className={f('quote', { dark })}>
    {authors}{' '}
    <Link href={url} target="_blank">
      {title}
    </Link>
    . <i>{source}</i>
  </blockquote>
);
PrintedPublication.propTypes = pubTypes;

export const PrintedInterPro2022 = () => (
  <PrintedPublication {...data4InterPro2022} />
);
