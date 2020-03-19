import React, { useEffect, useState, useRef } from 'react';
import T from 'prop-types';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { goToCustomLocation } from 'actions/creators';

import loadWebComponent from 'utils/load-web-component';
import pathToDescription from 'utils/processDescription/pathToDescription';

import config from 'config';

const webComponents = [];

const loadInterProWebComponents = () => {
  if (!webComponents.length) {
    const interproComponents = () =>
      import(
        /* webpackChunkName: "interpro-components" */ 'interpro-components'
      );
    webComponents.push(
      loadWebComponent(() =>
        interproComponents().then(m => m.InterproHierarchy),
      ).as('interpro-hierarchy'),
    );
    webComponents.push(
      loadWebComponent(() =>
        interproComponents().then(m => m.InterproEntry),
      ).as('interpro-entry'),
    );
    webComponents.push(
      loadWebComponent(() => interproComponents().then(m => m.InterproType)).as(
        'interpro-type',
      ),
    );
  }
  return Promise.all(webComponents);
};

const getUniqueHierarchies = hierarchies =>
  Array.from(new Map(hierarchies.map(h => [h.accession, h])).values());

const ProteinEntryHierarchy = ({
  hierarchy,
  accessions,
  hrefroot,
  goToCustomLocation,
  ready,
  includeChildren = false,
}) => {
  const componentRef = useRef();
  useEffect(() => {
    if (componentRef.current && ready) {
      // Making sure the same hierarchy only appears once.
      componentRef.current.hierarchy = hierarchy;
      // Adding the click event so it doesn't refresh the whole page,
      // but instead use the customLocation.
      componentRef.current.addEventListener('click', e => {
        const target = (e.path || e.composedPath())[0];
        if (target.classList.contains('link')) {
          e.preventDefault();
          goToCustomLocation({
            description: pathToDescription(
              target
                .getAttribute('href')
                .replace(new RegExp(`^${config.root.website.path}`), ''),
            ),
          });
        }
      });
    }
  });

  return (
    <interpro-hierarchy
      accessions={accessions}
      hrefroot={hrefroot}
      ref={componentRef}
      displaymode={`pruned${includeChildren ? '' : ' no-children'}`}
    />
  );
};
ProteinEntryHierarchy.propTypes = {
  hierarchy: T.object.isRequired,
  accessions: T.array.isRequired,
  hrefroot: T.string.isRequired,
  goToCustomLocation: T.func.isRequired,
  ready: T.bool.isRequired,
};

const ProteinEntryHierarchies = ({
  entries,
  goToCustomLocation,
  includeChildren = false,
}) => {
  const [ready, setReady] = useState(false);

  // eslint-disable-next-line func-style,require-jsdoc
  async function loadComponents() {
    return await loadInterProWebComponents();
  }

  useEffect(() => {
    loadComponents().then(() => {
      setReady(true);
    });
  }, []);

  const hierarchies = getUniqueHierarchies(entries.map(e => e.hierarchy));
  console.log(hierarchies);
  return (
    <div>
      {hierarchies.length
        ? hierarchies.map(h => (
            <ProteinEntryHierarchy
              hierarchy={h}
              accessions={entries.map(e => e.accession)}
              hrefroot={`${config.root.website.path}/entry/interpro`}
              goToCustomLocation={goToCustomLocation}
              key={h.accession}
              ready={ready}
              includeChildren={includeChildren}
            />
          ))
        : null}
    </div>
  );
};
ProteinEntryHierarchies.propTypes = {
  entries: T.arrayOf(
    T.shape({
      accession: T.string.isRequired,
      type: T.string.isRequired,
      hierarchy: T.object.isRequired,
    }),
  ),
  goToCustomLocation: T.func,
};

const mapStateToProps = createSelector(
  state => state.settings.api,
  api => ({ api }),
);

export default connect(mapStateToProps, { goToCustomLocation })(
  ProteinEntryHierarchies,
);
