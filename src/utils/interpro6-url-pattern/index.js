// map of regular expressions, and their corresponding match handlers
export const lut = new Map([
  [/\/search\/sequence-search\/?$/, () => ['search', 'sequence']],
  [/\/(release_notes|download|about)(\.html?)?\/?$/, ([, other]) => [other]],
  [/\/training(\.html?)?\/?$/, () => ['help', 'tutorial']],
  [/\/(faqs|documentation)(\.html?)?\/?$/, ([, other]) => ['help', other]],
  [
    /\/(entry)\/([^/]*)?\/?/,
    ([, , accession]) => ['entry', 'interpro', accession],
  ],
  [
    /\/(protein)\/([^/]*)?\/?/,
    ([, , accession]) => ['protein', 'uniprot', accession],
  ],
  [
    /\/(signature)\/([^/]*)?\/?/,
    ([, , accession]) => ['search', 'text', accession],
  ],
  [/\/member-database\/([^/]*)?\/?/, ([, memberDB]) => ['entry', memberDB]],
]);

export default pathname => {
  for (const [re, urlPartMaker] of lut.entries()) {
    const match = pathname.match(re);
    if (match) {
      const mapper = urlPartMaker(match);
      return mapper;
    }
  }
};
