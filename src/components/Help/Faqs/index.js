import React, { PureComponent } from 'react';

import loadable from 'higherOrder/loadable';

import { foundationPartial } from 'styles/foundation';

import ipro from 'styles/interpro-new.css';
import local from './style.css';

const f = foundationPartial(ipro, local);

const SchemaOrgData = loadable({
  loader: () => import(/* webpackChunkName: "schemaOrg" */ 'schema_org'),
  loading: () => null,
});

export default class Faqs extends PureComponent {
  render() {
    return (
      <section>
        <h3>Frequently asked questions (FAQs)</h3>

        <details className={f('accordion-style')}>
          <summary>How can I ensure privacy for my sequence searches?</summary>
          <p>
            We adhere to EMBL standards on data privacy. However, if you have
            privacy concerns about submitting sequences for analysis via the
            web, the InterProScan software package can be downloaded for local
            installation from the EBI's FTP server.
          </p>
        </details>
        <details className={f('accordion-style')}>
          <summary>Can I access InterProScan programmatically?</summary>
          <p>
            InterProScan can be accessed programmatically via Web services that
            allow up to one sequence per request, and up to 25 requests in
            parallel (both SOAP and REST-based services are available).
          </p>
        </details>
        <details className={f('accordion-style')}>
          <summary>How do I interpret my InterProScan results?</summary>
          <p>
            Please see the online tutorials section on the Training & tutorials
            page.
          </p>
        </details>
        <details className={f('accordion-style')}>
          <summary>What are entry types and why are they important?</summary>
          <p>
            Each InterPro entry is assigned one of a number of types which tell
            you what you can infer when a protein matches the entry. The entry
            types are:
          </p>
          <ul>
            <li>
              {' '}
              Homologous Superfamily: A homologous superfamily is a group of
              proteins that share a common evolutionary origin, reflected by
              similarity in their structure. Since superfamily members often
              display very low similarity at the sequence level, this type of
              InterPro entry is usually based on a collection of underlying
              hidden Markov models, rather than a single signature.
            </li>
            <li>
              {' '}
              Family: A protein family is a group of proteins that share a
              common evolutionary origin reflected by their related functions,
              similarities in sequence, or similar primary, secondary or
              tertiary structure. A match to an InterPro entry of this type
              indicates membership of a protein family.
            </li>
            <li>
              {' '}
              Domain: Domains are distinct functional, structural or sequence
              units that may exist in a variety of biological contexts. A match
              to an InterPro entry of this type indicates the presence of a
              domain.
            </li>
            <li>
              {' '}
              Repeat: A match to an InterPro entry of this type identifies a
              short sequence that is typically repeated within a protein.
            </li>
            <li>
              {' '}
              Site: A match to an InterPro entry of this type indicates a short
              sequence that contains one or more conserved residues. The type of
              sites covered by InterPro are active sites, binding sites,
              post-translational modification sites and conserved sites.
            </li>
          </ul>
          <p>
            In addition to signatures that have been grouped into InterPro
            entries, you can also find unintegrated signatures that might not
            yet be curated or might not reach InterPro's standards for
            integration. However, they may provide information about a protein.
          </p>
        </details>
        <details className={f('accordion-style')}>
          <summary>What are entry relationships?</summary>
          <p>
            InterPro organises its content into hierarchies, where possible.
            Entries at the top of these hierarchies describe broad families or
            domains that share higher level structure and/or function, while
            those entries at the bottom describe more specific functional
            subfamilies or structural/functional subclasses of domains. For
            example, steroid hormone receptors constitute a family of nuclear
            receptors responsible for signal transduction mediated by steroid
            hormones, and can be sub-classified into different groups, including
            the liver X receptor subfamily. This subfamily consists of nuclear
            receptors that regulate the metabolism of several important lipids,
            including oxysterols.
          </p>
        </details>
        <details className={f('accordion-style')}>
          <summary>What are overlapping entries?</summary>
          <p>
            On the entry page, the relationship between homologous superfamilies
            and other InterPro entries is calculated by analysing the overlap
            between matched sequence sets. An InterPro entry is considered
            related to a homologous superfamily if its sequence matches overlap
            (i.e., the match positions fall within the homologous superfamily
            boundaries) and either the Jaccard index (equivalent) or containment
            index (parent/child) of the matching sequence sets is greater than
            0.75.
          </p>
        </details>
        <details className={f('accordion-style')}>
          <summary>
            What do the colours mean in the graphical view of matches to my
            protein?
          </summary>
          <p>
            The graphical view of InterPro matches show where the signatures
            that match your protein appear on the sequence. There are two ways
            that these graphical "blobs" can be coloured. If you select "Colour
            by: domain relationship", in the left hand menu, the domains that
            are from the same or related InterPro entries will be coloured the
            same, allowing easy visualisation of domains we know to be related.
            Unintegrated signatures will always be grey blobs, family signatures
            will always be shown as white, and sites will always be black when
            this option is selected. If you select "Colour by: member database",
            each blob in the sequence features section will be coloured
            according to the member database that provides the signature, as
            shown in this diagram. However, the sequence summary view will
            retain the domain relationship colour scheme.
          </p>
        </details>
        <details className={f('accordion-style')}>
          <summary>
            What do the colours mean in the graphical view of matches to my
            protein?
          </summary>
          <p>
            The graphical view of InterPro matches show where the signatures
            that match your protein appear on the sequence. There are two ways
            that these graphical "blobs" can be coloured. If you select "Colour
            by: domain relationship", in the left hand menu, the domains that
            are from the same or related InterPro entries will be coloured the
            same, allowing easy visualisation of domains we know to be related.
            Unintegrated signatures will always be grey blobs, family signatures
            will always be shown as white, and sites will always be black when
            this option is selected. If you select "Colour by: member database",
            each blob in the sequence features section will be coloured
            according to the member database that provides the signature, as
            shown in this diagram. However, the sequence summary view will
            retain the domain relationship colour scheme.
          </p>
        </details>
        <details className={f('accordion-style')}>
          <summary>
            Why are there no e-values associated with InterPro entries?
          </summary>
          <p>
            The signatures contained within InterPro are produced in different
            ways by different member databases, so their e-values and/or scoring
            systems cannot be meaningfully compared or combined. For this
            reason, we do not show e-values on the InterPro web site. However,
            e-values can be obtained via the downloadable InterProScan software
            package, which outputs detailed individual results for each member
            database sequence analysis algorithm.
          </p>
        </details>

        <details className={f('accordion-style')}>
          <summary>Can I trust my sequence search results?</summary>
          <p>
            We make every effort to ensure that signatures integrated into
            InterPro are accurate. Before being integrated, signatures are
            manually checked by curators to ensure that they are of a high
            quality (i.e., they match the proteins they are supposed to and hit
            as few incorrect proteins as possible). While matches to InterPro
            should therefore be trustworthy, there are some caveats. Most
            proteins are currently uncharacterised, so quality checks can only
            ever be based on the subset of characterised proteins that match the
            signature. It is therefore possible that signatures can match false
            positives that have not been detected. A useful rule of thumb is
            that the more signatures within an InterPro entry that match a
            protein, the more likely it is that the match is correct. Matches
            within the same hierarchy would also tend to increase confidence, as
            they all imply membership of a particular group. Nevertheless,
            please bear in mind that the member database signatures are
            computational predictions. If you think one of our signatures
            matches false positives, please contact us.
          </p>
        </details>

        <details className={f('accordion-style')}>
          <summary>How are InterPro entries mapped to GO terms?</summary>
          <p>
            The assignment of GO terms to InterPro entries is performed
            manually, and is an ongoing process (view related publication).
          </p>
        </details>

        <details className={f('accordion-style')}>
          <summary>How do I download InterPro?</summary>
          <p>
            The database and related software are freely available from the ftp
            site for download and distribution, provided the following Copyright
            line notice is supplied: InterPro - Integrated Resource Of Protein
            Domains And Functional Sites. Copyright (C) 2001 The InterPro
            Consortium.
          </p>
        </details>

        <details className={f('accordion-style')}>
          <summary>How do I contribute?</summary>
          <p>
            We welcome your contributions. We encourage you to use the Add your
            annotation button on InterPro entry pages to suggest updated or
            improved annotation for individual InterPro entries. To report
            errors or problems with the database, please get in touch via EBI
            support.
          </p>
        </details>

        <details className={f('accordion-style')}>
          <summary>How do I collaborate?</summary>
          <p>
            If you are interested in potential collaborations with InterPro,
            please contact us via EBI support.
          </p>
        </details>
      </section>
    );
  }
}
