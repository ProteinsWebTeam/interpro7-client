import React from 'react';
import { createPortal } from 'react-dom';
import T from 'prop-types';

const modalRoot = document.getElementById('modal-root');

import { foundationPartial } from 'styles/foundation';

import ipro from 'styles/interpro-new.css';
import interproTheme from 'styles/theme-interpro.css'; /* needed for custom button color*/
import local from './style.css';
import { noop } from 'lodash-es';
const f = foundationPartial(interproTheme, ipro, local);

const Modal = ({ show = false, children, closeModal = noop }) => {
  if (!show) return null;

  const Wrap = (
    <>
      <div className={f('modal-bg')} />
      <div
        className={f('modal')}
        data-reveal
        aria-labelledby="modalTitle"
        role="dialog"
      >
        {children}
        <button
          className={f('close-modal')}
          aria-label="Close"
          onClick={closeModal}
        >
          &#215;
        </button>
      </div>
    </>
  );
  return createPortal(Wrap, modalRoot);
};
Modal.propTypes = {
  show: T.bool,
  children: T.any,
  closeModal: T.funcm,
};
export default Modal;
