import loadable from 'higherOrder/loadable';

const Entry = loadable({
  loader: () => import(/* webpackChunkName: "entry-subpage" */ './Entry'),
});

const Protein = loadable({
  loader: () => import(/* webpackChunkName: "protein-subpage" */ './Protein'),
});

const Structure = loadable({
  loader: () =>
    import(/* webpackChunkName: "structure-subpage" */ './Structure'),
});

const Organism = loadable({
  loader: () => import(/* webpackChunkName: "organism-subpage" */ './Organism'),
});

const DomainArchitecture = loadable({
  loader: () =>
    import(/* webpackChunkName: "domain-architecture-subpage" */ './DomainArchitecture'),
});

const HMMModel = loadable({
  loader: () =>
    import(/* webpackChunkName: "hmm-model-subpage" */ './HMMModel'),
});

const subPages = new Map([
  ['entry', Entry],
  ['protein', Protein],
  ['structure', Structure],
  ['organism', Organism],
  ['domain architecture', DomainArchitecture],
  ['hmm model', HMMModel],
]);

export default subPages;
