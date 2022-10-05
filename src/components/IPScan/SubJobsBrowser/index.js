// @flow
import React, { useRef, useEffect, useState } from 'react';
import T from 'prop-types';

import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import { IPscanRegex } from 'utils/processDescription/handlers';
import Link from 'components/generic/Link';

import { foundationPartial } from 'styles/foundation';
import theme from 'styles/theme-interpro.css';
import style from './style.css';

const f = foundationPartial(theme, style);

/*::
type Props ={
  accession: string,
  jobs: {
    remoteID: string,
    localTitle: string,
  }[]
}
  */

const SubJobsBrowser = ({ jobs, accession } /*: Props */) => {
  const scroller /*: { current: null | HTMLDivElement } */ = useRef(null);
  const [currentJob, setCurrentJob] = useState(0);
  useEffect(() => {
    scroller.current?.addEventListener('scroll', () => {
      const first = Array.from(scroller.current?.querySelectorAll('div') || [])
        .map((e, i) => ({
          id: e.id,
          left: e.getBoundingClientRect().left,
          position: i,
        }))
        .filter(({ left }) => left >= 0)?.[0];
      if (first && currentJob !== first.position) setCurrentJob(first.position);
    });
  }, [scroller.current]);
  if ((jobs?.length || 0) < 2) return null;

  const scroll = (next /*: boolean */ = true) => {
    if (scroller?.current) {
      const itemSize =
        (next ? 1 : -1) *
        (scroller?.current?.querySelector('div')?.clientWidth || 0);
      scroller?.current?.scrollBy(itemSize, 0);
    }
  };
  const scrollNext = () => scroll(true);
  const scrollPrev = () => scroll(false);
  return (
    <section className={f('callout', 'jobs-browser')}>
      <header>
        This result was part of a multiple ({jobs.length}) sequence job. You can
        choose another sequence below:
      </header>
      <main>
        <button onClick={scrollPrev}>◀︎</button>

        <div className={f('job-slider')}>
          <div className={f('slides')} ref={scroller}>
            {jobs.map(({ remoteID, localTitle }) => (
              <div key={remoteID} id={remoteID}>
                {remoteID === accession ? (
                  <b>{localTitle}</b>
                ) : (
                  <Link
                    to={{
                      description: {
                        main: { key: 'result' },
                        result: { type: 'InterProScan', accession: remoteID },
                      },
                    }}
                  >
                    {localTitle}
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
        <button onClick={scrollNext}>►</button>
      </main>
    </section>
  );
};
SubJobsBrowser.propTypes = {
  jobs: T.arrayOf(T.object),
  accession: T.string,
};

const mapStateToProps = createSelector(
  (state) => state.customLocation.description.result.accession,
  (state) => state.jobs,
  (accession, jobs) => {
    const matches = accession.match(IPscanRegex);
    const posfix = matches[2] || matches[3];
    if (!posfix || !posfix.startsWith('-')) return {};
    const jobIDBase = accession.slice(0, -posfix.length);
    // prettier-ignore
    const relatedJobs = (Object.values(jobs)/*: any*/)
      .map(({ metadata }) => metadata)
      .filter(({ remoteID }) => remoteID.startsWith(jobIDBase));
    return { jobs: relatedJobs, accession };
  },
);

export default connect(mapStateToProps)(SubJobsBrowser);
