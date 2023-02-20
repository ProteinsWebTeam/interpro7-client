// @flow
import React, { useState } from 'react';
import T from 'prop-types';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { format } from 'url';

import { addToast } from 'actions/creators';
import getUrlFor from 'utils/url-patterns';

import Link from 'components/generic/Link';
import Tooltip from 'components/SimpleCommonComponents/Tooltip';
import DropDownButton from 'components/SimpleCommonComponents/DropDownButton';
import Integration from 'components/Entry/Integration';
import ContributingSignatures from 'components/Entry/ContributingSignatures';
import RepresentativeStructure from './RepresentativeStructure';
import { foundationPartial } from 'styles/foundation';

import fonts from 'EBI-Icon-fonts/fonts.css';
import local from '../style.css';

const f = foundationPartial(fonts, local);

const SidePanel = ({ metadata, dbInfo, api, addToast }) => {
  const url = getUrlFor(metadata.source_database);
  const { protocol, hostname, port, root } = api;

  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');

  const apiUrl = format({
    protocol,
    hostname,
    port,
    pathname: `${root}/mail/`,
  });
  const entry = `${metadata.name.name} (${metadata.accession})`;

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.target);
    data.append('subject', `Add annotation, ${entry}`);
    fetch(apiUrl, {
      method: 'POST',
      body: data,
    }).then((response) => {
      let text;
      // eslint-disable-next-line no-magic-numbers
      if (response.status === 200) {
        text = 'Thanks for your feedback';
        // eslint-disable-next-line no-magic-numbers
      } else if (response.status === 429) {
        text = 'Request aborted as too many requests are made within a minute';
      } else {
        text = 'Invalid request';
      }
      addToast(
        {
          title: text,
          ttl: 3000,
        },
        'interhelp-mail',
      );
      setMessage('');
      setEmail('');
    });
  };

  const handleFields = (e) => {
    if (e.target.name === 'message') setMessage(e.target.value);
    else setEmail(e.target.value);
  };

  const clearFields = () => {
    setMessage('');
    setEmail('');
  };

  return (
    <section>
      <div>
        <Tooltip
          title={
            'You may suggest updates to the annotation of this entry using this form. Suggestions will be sent to ' +
            'our curators for review and, if acceptable, will be included in the next public release of InterPro. It is ' +
            'helpful if you can include literature references supporting your annotation suggestion.'
          }
        >
          <DropDownButton
            label="Add your annotation"
            icon="&#xf303;"
            extraClasses={f('annotation')}
          >
            <form onSubmit={handleSubmit}>
              <label htmlFor="message">Your annotation</label>
              <textarea
                id="message"
                name="message"
                value={message}
                onChange={handleFields}
                rows="5"
                required
              />
              <label htmlFor="from_email">Email address</label>
              <input
                id="from_email"
                name="from_email"
                type="email"
                value={email}
                onChange={handleFields}
                required
              />
              <button className={f('button')}>Submit</button>
              <button className={f('button')} onClick={clearFields}>
                Clear
              </button>
            </form>
          </DropDownButton>
        </Tooltip>
      </div>
      {metadata.integrated && <Integration intr={metadata.integrated} />}
      {!['interpro', 'pfam'].includes(
        metadata.source_database.toLowerCase(),
      ) && (
        <section>
          <h5>External Links</h5>
          <ul className={f('no-bullet')}>
            <li>
              <Link
                className={f('ext')}
                target="_blank"
                href={url && url(metadata.accession)}
              >
                View {metadata.accession} in{' '}
                {(dbInfo && dbInfo.name) || metadata.source_database}
              </Link>
            </li>
          </ul>
        </section>
      )}
      {metadata.member_databases &&
      Object.keys(metadata.member_databases).length ? (
        <ContributingSignatures contr={metadata.member_databases} />
      ) : null}
      {metadata.representative_structure && (
        <RepresentativeStructure
          accession={metadata.representative_structure.accession}
          name={metadata.representative_structure.name}
        />
      )}
    </section>
  );
};
SidePanel.propTypes = {
  metadata: T.object.isRequired,
  dbInfo: T.object.isRequired,
  api: T.object.isRequired,
  addToast: T.func.isRequired,
};

const mapStateToProps = createSelector(
  (state) => state.settings.api,
  (api) => ({
    api,
  }),
);

export default connect(mapStateToProps, { addToast })(SidePanel);
