// @flow
import React from 'react';

import Link from 'components/generic/Link';

import local from './style.css';

import cssBinder from 'styles/cssBinder';
const css = cssBinder(local);

const citationDetails = {
  doi: '10.1093/nar/gkae1082',
  title: 'InterPro: the protein sequence classification resource in 2025',
  authors: `Blum M, Andreeva A, Florentino LC, Chuguransky SR, Grego T, Hobbs E,
            Pinto BL, Orr A, Paysan-Lafosse T, Ponamareva I, Salazar GA,
            Bordin N, Bork P, Bridge A, Colwell L, Gough J, Haft DH, Letunic I,
            Llinares-López F, Marchler-Bauer A, Meng-Papaxanthos L, Mi H,
            Natale DA, Orengo CA, Pandurangan AP, Piovesan D, Rivoire C,
            Sigrist CJA, Thanki N, Thibaud-Nissen F, Thomas PD, Tosatto SCE,
            Wu CH, Bateman A.`,
  source: 'Nucleic Acids Research',
  year: 2024,
  imageClass: 'image-nar-default',
};

type pubProps = {
  doi: string;
  title: string;
  authors: string;
  source: string;
  year: number;
};

export const PrintedPublication = ({
  doi,
  title,
  authors,
  source,
  year,
}: pubProps) => {
  return (
    <blockquote className={css('vf-blockquote')}>
      <div>{authors}</div>
      <div>
        <b>{title}</b>
      </div>
      <>
        <i>{source}</i>. {year},{' '}
        <Link
          href={`https://doi.org/${doi}`}
          className={css('ext')}
          target="_blank"
        >
          doi: {doi}
        </Link>
      </>
    </blockquote>
  );
};

export const InterProCitation = () => (
  <PrintedPublication {...citationDetails} />
);
