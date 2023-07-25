import React, { useEffect, useState, useRef } from 'react';

import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { isEqual } from 'lodash-es';
import { goToCustomLocation } from 'actions/creators';

import loadWebComponent from 'utils/load-web-component';
import pathToDescription from 'utils/processDescription/pathToDescription';

import config from 'config';

const webComponents: Promise<unknown>[] = [];

const loadInterProWebComponents = () => {
  if (!webComponents.length) {
    const interproComponents = () =>
      import(
        /* webpackChunkName: "interpro-components" */ 'interpro-components'
      );
    webComponents.push(
      loadWebComponent(() =>
        interproComponents().then((m) => m.InterproHierarchy),
      ).as('interpro-hierarchy'),
    );
    webComponents.push(
      loadWebComponent(() =>
        interproComponents().then((m) => m.InterproEntry),
      ).as('interpro-entry'),
    );
    webComponents.push(
      loadWebComponent(() =>
        interproComponents().then((m) => m.InterproType),
      ).as('interpro-type'),
    );
  }
  return Promise.all(webComponents);
};

const getUniqueHierarchies = (hierarchies: Array<InterProHierarchyType>) =>
  Array.from(new Map(hierarchies.map((h) => [h.accession, h])).values());

type HierarchyProps = {
  hierarchy:InterProHierarchyType,
accessions: Array<string>,
hrefroot: string,
goToCustomLocation?: typeof goToCustomLocation,
ready: boolean,
includeChildren?: boolean,
}
const ProteinEntryHierarchy = ({
  hierarchy,
  accessions,
  hrefroot,
  goToCustomLocation,
  ready,
  includeChildren = false,
}: HierarchyProps) => {
  const componentRef = useRef<(HTMLElement&{hierarchy?:InterProHierarchyType,_hierarchy?:InterProHierarchyType})|null>(null);
  useEffect(() => {
    if (componentRef.current && ready) {
      // Making sure the same hierarchy only appears once.
      if (isEqual((componentRef.current)?._hierarchy, hierarchy)) return;
      componentRef.current.hierarchy = hierarchy;
      // Adding the click event so it doesn't refresh the whole page,
      // but instead use the customLocation.
      componentRef.current.addEventListener('click', (e) => {
        const target = (e.composedPath())[0] as HTMLElement;
        if (target.classList.contains('link')) {
          e.preventDefault();
          goToCustomLocation?.({
            description: pathToDescription(
              target
                ?.getAttribute('href')
                ?.replace(new RegExp(`^${config.root.website.path}`), ''),
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

type Props ={
  entries: Array<EntryMetadata>,
  goToCustomLocation?: typeof goToCustomLocation,
  includeChildren?: boolean,
}

const ProteinEntryHierarchies = ({
  entries,
  goToCustomLocation,
  includeChildren = false,
}: Props) => {
  const [ready, setReady] = useState(false);

  async function loadComponents() {
    return await loadInterProWebComponents();
  }

  useEffect(() => {
    loadComponents().then(() => {
      setReady(true);
    });
  }, []);

  const hierarchies = getUniqueHierarchies(entries.map((e) => e.hierarchy).filter(Boolean) as Array<InterProHierarchyType>);
  if (!ready) return null;
  return (
    <div>
      {hierarchies.length
        ? hierarchies.map((h) => (
            <ProteinEntryHierarchy
              hierarchy={h}
              accessions={entries.map((e) => e.accession)}
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

const mapStateToProps = createSelector(
  (state) => state.settings.api,
  (api) => ({ api }),
);

export default connect(mapStateToProps, { goToCustomLocation })(
  React.memo(ProteinEntryHierarchies),
);
