import React, { FormEvent, useState } from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { format } from 'url';

import { addToast } from 'actions/creators';
import getUrlFor from 'utils/url-patterns';

import Link from 'components/generic/Link';
import Tooltip from 'components/SimpleCommonComponents/Tooltip';
import DropDownButton from 'components/SimpleCommonComponents/DropDownButton';
import Button from 'components/SimpleCommonComponents/Button';

import Integration from './Integration';
import ContributingSignatures from './ContributingSignatures';
import RepresentativeStructure from './RepresentativeStructure';

import cssBinder from 'styles/cssBinder';

import fonts from 'EBI-Icon-fonts/fonts.css';
import local from './style.css';
import ipro from 'styles/interpro-vf.css';

const css = cssBinder(fonts, local, ipro);

type addToastType = typeof addToast;

const SidePanel = ({
  metadata,
  dbInfo,
  api,
  addToast,
}: {
  metadata: EntryMetadata;
  dbInfo: DBInfo;
  api: ParsedURLServer;
  addToast: addToastType;
}) => {
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
  const queue = metadata.source_database.toLowerCase();

  const handleSubmit = (event: FormEvent) => {
    if (!event.target) return;
    event.preventDefault();
    const data = new FormData(event.target as HTMLFormElement);
    data.append('subject', `Add annotation, ${entry}`);
    data.append('queue', queue);
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

  const handleFields = (e: FormEvent) => {
    const target = e.target as HTMLFormElement;
    if (target.name === 'message') setMessage(target.value);
    else setEmail(target.value);
  };

  const clearFields = () => {
    setMessage('');
    setEmail('');
  };

  return (
    <>
      {['interpro', 'pfam'].includes(
        // Only receiving new annotations for pfam and interpro
        metadata.source_database.toLowerCase(),
      ) &&
        !metadata.is_removed && (
          <div>
            <DropDownButton
              label={
                <Tooltip
                  title={`You can suggest annotation updates for this entry using the provided form.
                  Our curators will review and, if suitable, include them in the next
                  ${
                    metadata.source_database.toLowerCase() === 'interpro'
                      ? 'InterPro'
                      : 'Pfam'
                  } release.
                  Please include supporting literature references for better accuracy.`}
                >
                  Add your annotation
                </Tooltip>
              }
              icon="&#xf303;"
              extraClasses={css('annotation')}
            >
              <form
                onSubmit={handleSubmit}
                className={css('vf-stack', 'vf-stack--200')}
              >
                <label
                  className={css('vf-form__label', 'vf-form__label--required')}
                  htmlFor="message"
                >
                  Your annotation
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={message}
                  onChange={handleFields}
                  className={css('vf-form__textarea')}
                  rows={5}
                  required
                />
                <label
                  className={css('vf-form__label', 'vf-form__label--required')}
                  htmlFor="from_email"
                >
                  Email address
                </label>
                <input
                  id="from_email"
                  name="from_email"
                  type="email"
                  value={email}
                  onChange={handleFields}
                  className={css('vf-form__input')}
                  required
                />
                <div className={css('flex-space-evenly')}>
                  <Button submit>Submit</Button>
                  <Button type="tertiary" onClick={clearFields}>
                    Clear
                  </Button>
                </div>
              </form>
            </DropDownButton>
          </div>
        )}
      {metadata.integrated && <Integration intr={metadata.integrated} />}
      {!['interpro', 'pfam', 'antifam'].includes(
        metadata.source_database.toLowerCase(),
      ) &&
        url && (
          <section>
            <h5>External Links</h5>
            <ul className={css('no-bullet')}>
              <li>
                <Link
                  className={css('ext-link')}
                  target="_blank"
                  href={url(metadata.accession)}
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
    </>
  );
};

const mapStateToProps = createSelector(
  (state: GlobalState) => state.settings.api,
  (api) => ({ api }),
);

export default connect(mapStateToProps, { addToast })(SidePanel);
