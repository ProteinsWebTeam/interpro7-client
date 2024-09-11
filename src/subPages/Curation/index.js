// @flow
import React from 'react';
import T from 'prop-types';

import { createSelector } from 'reselect';
import { format } from 'url';

import config from 'config';

import Loading from 'components/SimpleCommonComponents/Loading';
import Link from 'components/generic/Link';
import loadData from 'higherOrder/loadData';

// $FlowFixMe
import descriptionToPath from 'utils/processDescription/descriptionToPath';

import { foundationPartial } from 'styles/foundation';

import ipro from 'styles/interpro-new.css';
import ebiGlobalStyles from 'ebi-framework/css/ebi-global.css';
import fonts from 'EBI-Icon-fonts/fonts.css';

const f = foundationPartial(ipro, ebiGlobalStyles, fonts);

/*:: type Props = {
  data: Object,
}; */

const CurationSubPage = ({ data }) => {
  const { loading, payload } = data;

  if (loading) return <Loading />;
  // eslint-disable-next-line camelcase
  const details = payload?.extra_fields?.details;

  if (!details) return null;

  // eslint-disable-next-line camelcase
  const sequenceOntology = details.curation?.sequence_ontology || '';
  return (
    <div className={f('row', 'column')}>
      <h4>Curation</h4>
      <table className={f('light', 'table-sum')}>
        <tbody>
          <tr>
            <td>Author</td>
            <td className={f('first-letter-cap')}>
              {(details.curation?.authors || [])
                .map((author) => {
                  let preferredName = author.author;
                  if (author.orcid) {
                    preferredName = (
                      <a
                        href={`https://orcid.org/${author.orcid}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {author.author}
                        <i
                          className={f('icon', 'icon-common')}
                          data-icon="&#xf112;"
                        />{' '}
                      </a>
                    );
                  }
                  return <span key={author.author}>{preferredName}</span>;
                })
                .reduce((prev, curr) => [prev, ', ', curr])}
            </td>
          </tr>
          <tr>
            <td>Sequence Ontology</td>
            <td className={f('first-letter-cap')}>
              <a
                href={`http://www.sequenceontology.org/miso/current_svn/term/${details.curation.sequence_ontology}`}
                target="_blank"
                rel="noreferrer"
              >
                {sequenceOntology}
              </a>
            </td>
          </tr>
        </tbody>
      </table>
      <h4>HMM Information</h4>
      <table className={f('light', 'table-sum')}>
        <tbody>
          <tr>
            <td>HMM build commands</td>
            <td>
              Build method: {details.hmm?.commands?.build || ''}
              <br />
              Search method: {details.hmm?.commands?.search || ''}
            </td>
          </tr>
          <tr>
            <td>Gathering threshold</td>
            <td>
              Sequence: {details.hmm?.cutoffs?.gathering?.sequence || ''}
              <br />
              Domain: {details.hmm?.cutoffs?.gathering?.domain || ''}
            </td>
          </tr>
          <tr>
            <td>Download</td>
            <td>
              <Link
                href={`${config.root.API.href}/entry/pfam/${payload?.metadata?.accession}?annotation=hmm`}
                download={`${
                  payload?.metadata?.accession || 'download'
                }.hmm.gz`}
              >
                <span
                  className={f('icon', 'icon-common', 'icon-download')}
                  data-icon="&#xf019;"
                />{' '}
                Download
              </Link>{' '}
              the raw HMM for this family
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};
CurationSubPage.propTypes = {
  data: T.object.isRequired,
};

const getPfamCurationUrl = createSelector(
  (state) => state.settings.api,
  (state) => state.customLocation.description.main.key,
  (state) =>
    state.customLocation.description.main.key &&
    state.customLocation.description[state.customLocation.description.main.key]
      .db,
  (state) =>
    state.customLocation.description[state.customLocation.description.main.key]
      .accession,
  ({ protocol, hostname, port, root }, mainType, db, accession) => {
    if (!accession) return;
    return format({
      protocol,
      hostname,
      port,
      pathname:
        root +
        descriptionToPath({
          main: { key: mainType },
          [mainType]: {
            db,
            accession,
          },
        }),
      query: { extra_fields: 'details' },
    });
  },
);

export default loadData(getPfamCurationUrl)(CurationSubPage);
