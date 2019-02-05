// @flow
import React from 'react';
import Link from 'components/generic/Link';

import { foundationPartial } from 'styles/foundation';

import ipro from 'styles/interpro-new.css';

const f = foundationPartial(ipro);

const AboutInterPro = () => (
  <section>
    <h3>About InterPro</h3>
    <div>
      <h4>What is InterPro?</h4>
      <p>
        InterPro is a resource that provides functional analysis of protein
        sequences by classifying them into families and predicting the presence
        of domains and important sites. To classify proteins in this way,
        InterPro uses predictive models, known as signatures, provided by
        several different databases (referred to as member databases) that make
        up the InterPro consortium.
      </p>
    </div>
    <div>
      <h4>What is InterProScan?</h4>
      <p>
        InterProScan is the software package that allows sequences to be scanned
        against InterPro's signatures (more information about{' '}
        <Link
          href="//github.com/ebi-pf-team/interproscan/wiki"
          className={f('ext')}
          target="_blank"
        >
          InterProScan
        </Link>
        ).
      </p>
    </div>
    <div>
      <h4>Why is InterPro useful?</h4>
      <p>
        InterPro combines signatures from multiple, diverse databases into a
        single searchable resource, reducing redundancy and helping users
        interpret their sequence analysis results. By uniting the member
        databases, InterPro capitalises on their individual strengths, producing
        a powerful diagnostic tool and integrated resource.
      </p>
    </div>
    <div>
      <h4>Who uses InterPro?</h4>
      <p>
        InterPro is used by research scientists interested in the large-scale
        analysis of whole proteomes, genomes and metagenomes, as well as
        researchers seeking to characterise individual protein sequences. Within
        the EBI, InterPro is used to help annotate protein sequences in
        UniProtKB. It is also used by the Gene Ontology Annotation group to
        automatically assign Gene Ontology terms to protein sequences.
      </p>
    </div>
    <div>
      <h4>Update frequency</h4>
      <p>
        InterPro is updated approximately every 8 weeks. Our{' '}
        <Link
          to={{
            description: { other: ['release_notes'] },
          }}
        >
          release notes pages
        </Link>{' '}
        contain information about what has changed in each update.
      </p>
    </div>
  </section>
);

export default AboutInterPro;
