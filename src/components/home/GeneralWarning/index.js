import React from 'react';
import T from 'prop-types';
import loadData from 'higherOrder/loadData';

import { foundationPartial } from 'styles/foundation';

import ebiGlobalStyles from 'ebi-framework/css/ebi-global.css';

const f = foundationPartial(ebiGlobalStyles);

const GeneralWarning = ({ data }) => {
  const message = data?.payload;
  if ((message || '').trim() === '') return null;
  return (
    <div className={f('callout', 'withicon', 'alert')}>
      <b>{message}</b>
    </div>
  );
};
GeneralWarning.propTypes = {
  data: T.object,
};

export default loadData({
  getUrl: () =>
    'https://www.ebi.ac.uk/interpro/announcement/GENERAL_WARNING.txt',
  fetchOptions: {
    responseType: 'text',
    useCache: false,
  },
})(GeneralWarning);
