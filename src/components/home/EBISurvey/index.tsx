import React from 'react';
import Callout from 'components/SimpleCommonComponents/Callout';
import Link from 'components/generic/Link';
import cssBinder from 'styles/cssBinder';
import fonts from 'EBI-Icon-fonts/fonts.css';

import config from 'config';

const css = cssBinder(fonts);

const EBISurvey = () => {
  return config.root?.EBISurvey?.href ? (
    <Callout type="warning">
      <div>
        Do data resources managed by EMBL-EBI and our collaborators make a
        difference to your work?
        <br /> Please take 10 minutes to fill in our{' '}
        <Link
          href={config.root.EBISurvey.href}
          className={css('ext')}
          target="_blank"
        >
          annual user survey
        </Link>
        , and help us make the case for why sustaining open data resources is
        critical for life sciences research.
      </div>
    </Callout>
  ) : null;
};

export default EBISurvey;
