declare module '*.css' {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const content: any;
  export default content;
}
declare module '*.avif' {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const content: any;
  export default content;
}
declare module '*.png' {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const content: any;
  export default content;
}
declare module '*.svg' {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const content: any;
  export default content;
}
declare module '*.tmpl' {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const content: any;
  export default content;
}
declare module '*.fasta' {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const content: any;
  export default content;
}

// TODO: remove after migration of storage/
declare module 'storage/searchStorage' {
  const content: {
    getValue: () => unknown;
    setValue: (v: unknown) => void;
  };
  export default content;
}

declare module 'interpro-components' {
  let InterproHierarchy: InterProHierarchyProps;
  let InterproEntry: InterProEntryProps;
  let InterproType: InterProTypeProps;
}
declare module 'taxonomy-visualisation' {
  class TaxonomyVisualisation {
    tree: unknown;
    data: unknown;
    searchTerm: string;
    fisheye: boolean;
    constructor(x: unknown, options: {});
    addEventListener: (
      type: string,
      eventHandler: (event: Event) => void,
    ) => void;
    focusNodeWithID: (id?: string) => void;
    cleanup: () => void;
    resetZoom: () => void;
  }
  export default TaxonomyVisualisation;
}
declare module 'skylign' {
  let Skylign: SkylignProps;
}
interface SkylignProps
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLElement>,
    HTMLElement
  > {
  logo: string;
}

declare namespace JSX {
  interface IntrinsicElements {
    'interpro-type': InterProTypeProps;
    'interpro-hierarchy': InterProHierarchyProps;
    'interpro-entry': InterProEntryProps;
    'skylign-component': SkylignProps;
  }
}

interface InterProEntryProps
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLElement>,
    HTMLElement
  > {
  type: string;
  dimension: string;
}

interface InterProTypeProps
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLElement>,
    HTMLElement
  > {
  type: string;
  dimension: string;
  expanded?: boolean;
}

interface InterProHierarchyProps
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLElement>,
    HTMLElement
  > {
  accession?: string;
  accessions: string | string[];
  displaymode: string;
  hideafter?: number;
  hrefroot: string | null;
  hierarchy?: InterProHierarchyType;
  _hierarchy?: InterProHierarchyType;
}

type InterProHierarchyType = {
  accession: string;
  name: string;
  type: string;
  children: Array<InterProHierarchyType> | null;
};
