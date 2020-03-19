import React from 'react';
import T from 'prop-types';

import { Helmet } from 'react-helmet-async';

import ProteomeFocus from 'components/Proteome/Focus';

import { foundationPartial } from 'styles/foundation';

import ipro from 'styles/interpro-new.css';
import ebiGlobalStyles from 'ebi-framework/css/ebi-global.css';
import fonts from 'EBI-Icon-fonts/fonts.css';

const f = foundationPartial(ebiGlobalStyles, fonts, ipro);

const Coronavirus = ({}) => {
  return (
    <div className={f('row')}>
      <div className={f('columns')}>
        <section>
          <Helmet>
            <title>Coronavirus Update</title>
          </Helmet>
          <h3>InterPro Coronavirus Update</h3>
          <ProteomeFocus accession="UP000000354" />
        </section>
      </div>
    </div>
  );
};

export default Coronavirus;
