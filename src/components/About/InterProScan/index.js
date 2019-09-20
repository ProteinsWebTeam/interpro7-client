// @flow
import React from 'react';
import { dataPropType } from 'higherOrder/loadData/dataPropTypes';

import Link from 'components/generic/Link';

import { foundationPartial } from 'styles/foundation';

import ipro from 'styles/interpro-new.css';
import style from './style.css';

import loadData from 'higherOrder/loadData';
import { getUrlForRelease } from 'higherOrder/loadData/defaults';
import Loading from 'components/SimpleCommonComponents/Loading';
import fonts from 'EBI-Icon-fonts/fonts.css';
import Tooltip from 'components/SimpleCommonComponents/Tooltip';

const f = foundationPartial(ipro, style, fonts);

const parseBody = text =>
  text
    .trim()
    .split('\n')
    .reduce((agg, line) => {
      const [k, v] = line.split(':');
      agg[k] = v;
      return agg;
    }, {});

export const InterProScan = (
  {
    data: { loading, payload },
  } /*: {data: {loading: boolean, payload: ?Object}}*/,
) => {
  if (loading || !payload) return <Loading />;
  const { tag_name: version, body } = payload;
  const metadata = parseBody(body);
  return (
    <>
      <section className={f('banner')}>
        <div className={f('image-tool-ipscan')} />
        <div>
          <h3>InterProScan</h3>
          InterProScan is the software package that allows sequences (protein
          and nucleic) to be scanned against InterPro&#39;s signatures.
          Signatures are predictive models, provided by several different
          databases, that make up the InterPro consortium.
        </div>
      </section>
      <section>
        <h3>
          Download the latest version <small>({version})</small>
        </h3>
        <div>
          <span className={f('icon', 'icon-common')} data-icon="&#xf17c;" />{' '}
          Linux (64-bit) -{' '}
          <Tooltip
            title={`
              <b>Software</b>:<br/>
              <ul>
                <li>Linux 64-bit</li>
                <li>Perl 5</li>
                <li>Python 3</li>
                <li>Java 8</li>
              </ul>`}
            style={{ textDecoration: 'underline', cursor: 'help' }}
          >
            System requirements
          </Tooltip>
          <br />
          <small>
            <ul>
              <li>
                There are no versions planned for Windows or Apple operating
                systems. This is due to constraints in the various third-party
                binaries that InterProScan runs.
              </li>

              <li>
                Older versions of InterProScan are not supported anymore. We
                highly recommend you to update to the latest version.
              </li>
            </ul>
          </small>
        </div>
        <div className={f('download', 'flex-card')}>
          <Link
            className={f('button')}
            href={`ftp://ftp.ebi.ac.uk/pub/software/unix/iprscan/5/${version}/interproscan-${version}-64-bit.tar.gz`}
            target="_blank"
          >
            Download InterProScan
          </Link>
          {metadata.size && (
            <div className={f('metadata')}>
              Version {version} - {metadata.CPU} {metadata.OS} - {metadata.size}
            </div>
          )}
          {metadata.MD5 && (
            <div className={f('metadata')}>MD5: {metadata.MD5}</div>
          )}
        </div>
        <p>
          For more information on downloading, installing and running
          InterProScan please see the{' '}
          <Link
            href="https://github.com/ebi-pf-team/interproscan/wiki"
            target="_blank"
            className={f('ext')}
          >
            InterProScan wiki
          </Link>
          .
        </p>
      </section>
      <section>
        <h3>Web services</h3>
        <p>
          Programmatic access to InterProScan is possible via a number of
          different web service protocols, that allow up to 30 sequences to be
          analysed per request.
        </p>
        <div className={f('cols')}>
          <div className={f('flex-card')}>
            <header>REST</header>
            <p>We provide access to InterProScan via RESTful services.</p>
            <Link
              className={f('ext', 'secondary')}
              href="https://www.ebi.ac.uk/seqdb/confluence/display/JDSAT/InterProScan+5+Help+and+Documentation#InterProScan5HelpandDocumentation-RESTAPI"
              target="_blank"
            >
              REST API
            </Link>
          </div>
          <div className={f('flex-card')}>
            <header>SOAP</header>
            <p>
              We also provide access to InterProScan via SOAP-based web
              services.
            </p>
            <Link
              className={f('ext')}
              href="https://www.ebi.ac.uk/seqdb/confluence/display/JDSAT/InterProScan+5+Help+and+Documentation#InterProScan5HelpandDocumentation-SOAPAPIPrivacy"
              target="_blank"
            >
              SOAP API
            </Link>
          </div>
        </div>
      </section>

      <section>
        <h3>Web based tools</h3>
        <p>
          Web access using the sequence search box on the InterPro website (
          <Link to={{ description: {} }}>homepage</Link> or under{' '}
          <Link
            to={{
              description: {
                main: { key: 'search' },
                search: { type: 'sequence' },
              },
            }}
          >
            /search/sequence
          </Link>
          ), for the analysis of <b>single protein sequences</b> in FASTA format
          with a maximum length of 40,000 amino acids.
        </p>
      </section>
      <section>
        <h3>Source code</h3>
        <p>
          You can find, clone, and download the full InterProScan source code on
          the Github repository, available under{' '}
          <Link
            href="https://github.com/ebi-pf-team/interproscan"
            target="_blank"
            className={f('ext')}
          >
            github.com/ebi-pf-team/interproscan
          </Link>
          .
        </p>
      </section>
      <section>
        <h3>Previous releases</h3>
        <p>
          To ensure you have the latest data and software enhancements we always
          recommend you download the latest version of InterProScan. However all
          previous releases are archived on the{' '}
          <Link
            href="ftp://ftp.ebi.ac.uk/pub/software/unix/iprscan/5/"
            target="_blank"
            className={f('ext')}
          >
            FTP site
          </Link>
          .
        </p>
      </section>
      <section>
        <h3>License</h3>
        <p>
          The InterProScan software is distributed under the open source Apache
          license, as are the included scanning tools (except SignalP and
          TMHMM). Therefore, you do not need a special license for commercial
          use but please cite the resource and keep the Copyright statement with
          your installation.
        </p>
      </section>
      <section>
        <h3>Follow us & reporting bugs</h3>
        <p>
          If you want to get updates on InterProScan, you can subscribe to the{' '}
          <Link
            href="http://listserver.ebi.ac.uk/mailman/listinfo/interproscan-announce"
            target="_blank"
            className={f('ext')}
          >
            <span className={f('icon', 'icon-common')} data-icon="&#xf2d4;" />{' '}
            interproscan-announce mailing list
          </Link>{' '}
          or just follow InterPro on Twitter{' '}
          <Link
            href="https://twitter.com/InterProDB"
            target="_blank"
            className={f('ext')}
          >
            <span className={f('icon', 'icon-common')} data-icon="&#xf099;" />{' '}
            @InterProDB
          </Link>
          .
        </p>
        <p>
          If you want to submit a question or report a bug, please contact us by{' '}
          <Link
            href="mailto:interhelp@ebi.ac.uk"
            target="_blank"
            className={f('ext')}
          >
            <span className={f('icon', 'icon-common')} data-icon="&#xf199;" />{' '}
            email
          </Link>{' '}
          or contact us using the{' '}
          <Link
            href="http://www.ebi.ac.uk/support/interproscan"
            target="_blank"
            className={f('ext')}
          >
            <span className={f('icon', 'icon-common')} data-icon="&#xf29b;" />{' '}
            EBI form
          </Link>
          , providing as much information as possible so that we can recreate
          the problem.
        </p>
      </section>
    </>
  );
};
InterProScan.propTypes = {
  data: dataPropType,
};

export default loadData(getUrlForRelease('IPScan'))(InterProScan);
