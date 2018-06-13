import React, { PureComponent } from 'react';

import Link from 'components/generic/Link';

import { foundationPartial } from 'styles/foundation';

import loadWebComponent from 'utils/load-web-component';

import fonts from 'EBI-Icon-fonts/fonts.css';
import ipro from 'styles/interpro-new.css';
import local from './style.css';

const f = foundationPartial(ipro, fonts, local);

export default class Faqs extends PureComponent {
  componentDidMount() {
    loadWebComponent(() =>
      import(/* webpackChunkName: "interpro-components" */ 'interpro-components').then(
        m => m.InterproType,
      ),
    ).as('interpro-type');
  }

  render() {
    return (
      <section>
        <div className={f('row')}>
          <div className={f('columns', 'large-8')}>
            <h3 className={f('margin-bottom-xlarge')}>
              Frequently asked questions (FAQs)
            </h3>

            <details className={f('accordion-style')}>
              <summary>
                How can I ensure privacy for my sequence searches?
              </summary>
              <p>
                We adhere to EMBL standards on data privacy. However, if you
                have privacy concerns about submitting sequences for analysis
                via the web, the InterProScan software package can be downloaded
                for local installation from the{' '}
                <Link
                  href="ftp://ftp.ebi.ac.uk/pub/software/unix/iprscan"
                  className={f('ext')}
                  target="_blank"
                >
                  {' '}
                  EBI&apos;s FTP server
                </Link>.
              </p>
            </details>
            <details className={f('accordion-style')}>
              <summary>Can I access InterProScan programmatically?</summary>
              <p>
                InterProScan can be accessed programmatically via Web services
                that allow up to one sequence per request, and up to 25 requests
                in parallel (both{' '}
                <Link
                  href="//www.ebi.ac.uk/seqdb/confluence/pages/viewpage.action?pageId=68165103"
                  className={f('ext')}
                  target="_blank"
                >
                  {' '}
                  SOAP
                </Link>{' '}
                and{' '}
                <Link
                  href="//www.ebi.ac.uk/seqdb/confluence/pages/viewpage.action?pageId=68165098"
                  className={f('ext')}
                  target="_blank"
                >
                  {' '}
                  REST
                </Link>-based services are available).
              </p>
            </details>
            <details className={f('accordion-style')}>
              <summary>How do I interpret my InterProScan results?</summary>
              <p>
                Please see the online tutorials section on the{' '}
                <Link href="/help/tutorial/">Training &amp; tutorials</Link>{' '}
                page.
              </p>
            </details>

            <details className={f('accordion-style')}>
              <summary>
                What are entry types and why are they important?
              </summary>
              <div>
                <p>
                  Each InterPro entry is assigned one of a number of types which
                  tell you what you can infer when a protein matches the entry.
                  The entry types are:
                </p>

                <ul className={f('flex-grid')}>
                  <li>
                    {' '}
                    <interpro-type
                      dimension="4em"
                      type="homologous superfamily"
                      aria-label="Entry type"
                    />{' '}
                    <strong>Homologous Superfamily</strong>: A homologous
                    superfamily is a group of proteins that share a common
                    evolutionary origin, reflected by similarity in their
                    structure. Since superfamily members often display very low
                    similarity at the sequence level, this type of InterPro
                    entry is usually based on a collection of underlying hidden
                    Markov models, rather than a single signature.
                  </li>
                  <li>
                    {' '}
                    <interpro-type
                      dimension="4em"
                      type="Family"
                      aria-label="Entry type"
                    />{' '}
                    <strong>Family</strong>: A protein family is a group of
                    proteins that share a common evolutionary origin reflected
                    by their related functions, similarities in sequence, or
                    similar primary, secondary or tertiary structure. A match to
                    an InterPro entry of this type indicates membership of a
                    protein family.
                  </li>
                  <li>
                    {' '}
                    <interpro-type
                      dimension="4em"
                      type="Domain"
                      aria-label="Entry type"
                    />
                    <strong>Domain</strong>: Domains are distinct functional,
                    structural or sequence units that may exist in a variety of
                    biological contexts. A match to an InterPro entry of this
                    type indicates the presence of a domain.
                  </li>
                  <li>
                    {' '}
                    <interpro-type
                      dimension="4em"
                      type="Repeat"
                      aria-label="Entry type"
                    />
                    <strong>Repeat</strong>: A match to an InterPro entry of
                    this type identifies a short sequence that is typically
                    repeated within a protein.
                  </li>
                  <li>
                    {' '}
                    <interpro-type
                      dimension="4em"
                      type="Site"
                      aria-label="Entry type"
                    />
                    <strong>Site</strong>: A match to an InterPro entry of this
                    type indicates a short sequence that contains one or more
                    conserved residues. The type of sites covered by InterPro
                    are active sites, binding sites, post-translational
                    modification sites and conserved sites.
                  </li>
                  <li>
                    {' '}
                    <interpro-type
                      dimension="4em"
                      type="Unknown"
                      aria-label="Entry type"
                    />
                    <strong>Unintegrated signatures</strong>: In addition to
                    signatures that have been grouped into InterPro entries, you
                    can also find unintegrated signatures that might not yet be
                    curated or might not reach InterPro&apos;s standards for
                    integration. However, they may provide information about a
                    protein.
                  </li>
                </ul>
              </div>
            </details>

            <details className={f('accordion-style')}>
              <summary>What are entry relationships?</summary>
              <div>
                <p>
                  InterPro organises its content into hierarchies, where
                  possible. Entries at the top of these hierarchies describe
                  broad families or domains that share higher level structure
                  and/or function, while those entries at the bottom describe
                  more specific functional subfamilies or structural/functional
                  subclasses of domains.
                </p>
                <p>
                  For example, steroid hormone receptors constitute a family of
                  nuclear receptors responsible for signal transduction mediated
                  by steroid hormones, and can be sub-classified into different
                  groups, including the liver X receptor subfamily. This
                  subfamily consists of nuclear receptors that regulate the
                  metabolism of several important lipids, including oxysterols.
                </p>
              </div>
            </details>

            <details className={f('accordion-style')}>
              <summary>What are overlapping entries?</summary>
              <p>
                On the entry page, the relationship between homologous
                superfamilies and other InterPro entries is calculated by
                analysing the overlap between matched sequence sets. An InterPro
                entry is considered related to a homologous superfamily if its
                sequence matches overlap (i.e., the match positions fall within
                the homologous superfamily boundaries) and either the Jaccard
                index (equivalent) or containment index (parent/child) of the
                matching sequence sets is greater than 0.75.
              </p>
            </details>

            <details className={f('accordion-style')}>
              <summary>
                What do the colours mean in the graphical view of matches to my
                protein?
              </summary>
              {
                // Text need an update
              }
              <p>
                The graphical view of InterPro matches show where the signatures
                that match your protein appear on the sequence. There are two
                ways that these graphical &ldquo;blobs&rdquo; can be coloured.
                If you select &ldquo;Colour by: domain relationship&rdquo;, in
                the left hand menu, the domains that are from the same or
                related InterPro entries will be coloured the same, allowing
                easy visualisation of domains we know to be related.
                Unintegrated signatures will always be grey blobs, family
                signatures will always be shown as white, and sites will always
                be black when this option is selected. If you select
                &ldquo;Colour by: member database&rdquo;, each blob in the
                sequence features section will be coloured according to the
                member database that provides the signature, as shown in this
                diagram. However, the sequence summary view will retain the
                domain relationship colour scheme.
              </p>
            </details>

            <details className={f('accordion-style')}>
              <summary>
                Why are there no e-values associated with InterPro entries?
              </summary>
              <p>
                The signatures contained within InterPro are produced in
                different ways by different member databases, so their e-values
                and/or scoring systems cannot be meaningfully compared or
                combined. For this reason, we do not show e-values on the
                InterPro web site. However, e-values can be obtained via the
                downloadable InterProScan software package, which outputs
                detailed individual results for each member database sequence
                analysis algorithm.
              </p>
            </details>

            <details className={f('accordion-style')}>
              <summary>Can I trust my sequence search results?</summary>
              <div>
                <p>
                  We make every effort to ensure that signatures integrated into
                  InterPro are accurate. Before being integrated, signatures are
                  manually checked by curators to ensure that they are of a high
                  quality (i.e., they match the proteins they are supposed to
                  and hit as few incorrect proteins as possible).
                </p>
                <p>
                  While matches to InterPro should therefore be trustworthy,
                  there are some caveats. Most proteins are currently
                  uncharacterised, so quality checks can only ever be based on
                  the subset of characterised proteins that match the signature.
                  It is therefore possible that signatures can match false
                  positives that have not been detected.
                </p>
                <p>
                  A useful rule of thumb is that the more signatures within an
                  InterPro entry that match a protein, the more likely it is
                  that the match is correct. Matches within the same hierarchy
                  would also tend to increase confidence, as they all imply
                  membership of a particular group.
                </p>
                <p>
                  Nevertheless, please bear in mind that the member database
                  signatures are computational predictions. If you think one of
                  our signatures matches false positives, please{' '}
                  <Link
                    href="//www.ebi.ac.uk/support/interpro-general-query"
                    className={f('ext')}
                    target="_blank"
                  >
                    contact us
                  </Link>.
                </p>
              </div>
            </details>

            <details className={f('accordion-style')}>
              <summary>How are InterPro entries mapped to GO terms?</summary>
              <p>
                The assignment of GO terms to InterPro entries is performed
                manually, and is an ongoing process (<Link
                  to={{
                    description: {
                      other: ['help', 'documentation/publication'],
                    },
                  }}
                >
                  view related publication
                </Link>).
              </p>
            </details>

            <details className={f('accordion-style')}>
              <summary>How do I download InterPro?</summary>
              <p>
                The database and related software are freely available from the
                ftp site for download and distribution, provided the following
                Copyright line notice is supplied:{' '}
                <i>
                  InterPro - Integrated Resource Of Protein Domains And
                  Functional Sites. Copyright (C) 2001 The InterPro Consortium.
                </i>
              </p>
            </details>

            <details className={f('accordion-style')}>
              <summary>How do I contribute?</summary>
              <p>
                We welcome your contributions. To report errors or problems with
                the database, please{' '}
                <Link
                  href="//www.ebi.ac.uk/support/interpro-general-query"
                  className={f('ext')}
                  target="_blank"
                >
                  get in touch via EBI support
                </Link>.
              </p>
            </details>

            <details className={f('accordion-style')}>
              <summary>How do I collaborate?</summary>
              <p>
                If you are interested in potential collaborations with InterPro,
                please{' '}
                <Link
                  href="//www.ebi.ac.uk/support/interpro-general-query"
                  className={f('ext')}
                  target="_blank"
                >
                  contact us via EBI support
                </Link>.
              </p>
            </details>
          </div>
          <div className={f('columns', 'large-4')}>
            <div className={f('box-add')}>
              <h3 className={f('light', 'margin-top-xxlarge')}>
                Additional help
              </h3>
              <ul>
                {
                  // <li>
                  //   <Link href="//www.ebi.ac.uk/support/interpro-general-query">
                  //     <span
                  //       className={f('icon', 'icon-common')}
                  //       data-icon="&#x27a;"
                  //     />{' '}
                  //     Chat with an assistant{' '}
                  //   </Link>
                  // </li>
                }
                <li>
                  <Link href="//www.ebi.ac.uk/support/interpro-general-query">
                    <span
                      className={f('icon', 'icon-common')}
                      data-icon="&#x1d8;"
                    />{' '}
                    Submit a ticket
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    );
  }
}
