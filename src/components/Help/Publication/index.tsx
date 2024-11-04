// @flow
import React from 'react';

import Link from 'components/generic/Link';

import local from './style.css';

import cssBinder from 'styles/cssBinder';
const css = cssBinder(local);

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

type pubProps = {
  url: string;
  title: string;
  authors: string;
  source: string;
  imageClass?: string;
  dark?: boolean;
};

export const PrintedPublication = ({
  url,
  title,
  authors,
  source,
  dark,
}: pubProps) => {
  return (
    <blockquote className={css('vf-quote', { dark })}>
      {authors}{' '}
      <Link href={url} target="_blank">
        {title}
      </Link>
      . <i>{source}</i>
    </blockquote>
  );
};

export const PrintedInterPro2022 = () => (
  <PrintedPublication {...data4InterPro2022} />
);
