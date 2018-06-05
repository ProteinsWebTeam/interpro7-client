import React, { PureComponent } from 'react';

import loadable from 'higherOrder/loadable';

import { schemaProcessCitations } from 'schema_org/processors';

import { foundationPartial } from 'styles/foundation';

import local from './style.css';
import fonts from 'EBI-Icon-fonts/fonts.css';

const f = foundationPartial(local, fonts);

const SchemaOrgData = loadable({
  loader: () => import(/* webpackChunkName: "schemaOrg" */ 'schema_org'),
  loading: () => null,
});

const citations = [
  {
    resource: 'INTERPRO',
    label: 'InterPro',
    authors: `Robert D. Finn, Teresa K. Attwood, Patricia C. Babbitt,
              Alex Bateman, Peer Bork, Alan J. Bridge, Hsin-Yu Chang,
              Zsuzsanna Dosztányi, Sara El-Gebali, Matthew Fraser,
              Julian Gough, David Haft, Gemma L. Holliday, Hongzhan
              Huang, Xiaosong Huang, Ivica Letunic, Rodrigo Lopez,
              Shennan Lu, Aron Marchler-Bauer, Huaiyu Mi, Jaina
              Mistry, Darren A. Natale, Marco Necci, Gift Nuka,
              Christine A. Orengo, Youngmi Park, Sebastien Pesseat,
              Damiano Piovesan, Simon C. Potter, Neil D. Rawlings,
              Nicole Redaschi, Lorna Richardson, Catherine Rivoire,
              Amaia Sangrador-Vegas, Christian Sigrist, Ian Sillitoe,
              Ben Smithers, Silvano Squizzato, Granger Sutton, Narmada
              Thanki, Paul D Thomas, Silvio C. E. Tosatto, Cathy H.
              Wu, Ioannis Xenarios, Lai-Su Yeh, Siew-Yit Young and
              Alex L. Mitchell`,
    year: '2017',
    title: 'InterPro in 2017 — beyond protein family and domain annotations',
    journal: 'Nucleic Acids Research, Jan 2017',
    doi: '10.1093/nar/gkw1107',
  },
  {
    resource: 'INTERPROSCAN',
    label: 'InterProScan',
    authors: `Philip Jones, David Binns, Hsin-Yu Chang, Matthew
              Fraser, Weizhong Li, Craig McAnulla, Hamish McWilliam,
              John Maslen, Alex Mitchell, Gift Nuka, Sebastien
              Pesseat, Antony F. Quinn, Amaia Sangrador-Vegas, Maxim
              Scheremetjew, Siew-Yit Yong, Rodrigo Lopez, and Sarah
              Hunter`,
    year: '2014',
    title: 'InterProScan 5: genome-scale protein function classification',
    journal: 'Bioinformatics, Jan 2014',
    doi: 'doi:10.1093/bioinformatics/btu031',
  },
];

export default class Citation extends PureComponent {
  render() {
    return (
      <section>
        <h3>How to cite</h3>
        <div className={f('row')}>
          {citations.map(c => (
            <div
              key={c.resource}
              className={f('columns', 'large-6', 'margin-bottom-large')}
            >
              <SchemaOrgData
                data={{ identifier: c.doi, author: c.authors }}
                processData={schemaProcessCitations}
              />
              <div className={f('cite-box')}>
                <span
                  className={f('cite-icon', 'icon', 'icon-conceptual')}
                  data-icon="l"
                />
                <span className={f('cite-title')}>
                  <h4>{c.resource}</h4>
                </span>
                <span className={f('cite-text')}>
                  To cite {c.label}, please refer to the following publication:
                  <br />
                  <i>{c.authors}</i> ({c.year}). <strong>{c.title}</strong>.{' '}
                  {c.journal}; doi: {c.doi}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }
}
