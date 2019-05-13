// @flow
import React, { PureComponent } from 'react';

import { foundationPartial } from 'styles/foundation';

import global from '../../../styles/interpro-new.css';
import ebiGlobalStyles from 'ebi-framework/css/ebi-global.css';
import style from '../../../pages/style.css';

import embl from '../../../images/thirdparty/funding/logo_embl.png';
import wellcome from '../../../images/thirdparty/funding/logo_wellcome.jpg';
import bbsrc from '../../../images/thirdparty/funding/logo_bbsrc.png';

// Bind css with style object
const f = foundationPartial(ebiGlobalStyles, style, global);

export default class Funding extends PureComponent /*:: <{}> */ {
  render() {
    return (
      <section>
        <h3>Funding</h3>
        <img src={embl} className={f('image-funding')} alt="EMBL logo" />
        <img
          src={wellcome}
          className={f('image-funding')}
          alt="Wellcome Trust logo"
        />
        <img src={bbsrc} className={f('image-funding')} alt="BBSRC logo" />
        <p>
          InterPro is supported by EMBL, with additional funding gratefully
          received from the Biotechnology and Biological Sciences Research
          Council (BBSRC grants BB/L024136/1 and BB/N00521X/1) and the Wellcome
          Trust (grant 108433/Z/15/Z).
        </p>
      </section>
    );
  }
}
