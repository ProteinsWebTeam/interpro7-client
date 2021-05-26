import { CustomElementProperty } from 'molstar/lib/mol-model-props/common/custom-element-property';
import { Color, ColorScale } from 'molstar/lib/mol-util/color';

// eslint-disable-next-line no-magic-numbers
const defaultColor = Color(0x777777);
const scale = ColorScale.create({
  listOrName: 'turbo',
  domain: [1, 0],
});

export const ColorByResidueLddtTheme = CustomElementProperty.create({
  label: 'Colour by Residue pLDDT score',
  name: 'basic-wrapper-residue-striping',
  getData: async (model) => {
    const map = new Map();
    const entryURL = model.entry.split('structure')[0];
    const lddtURL = `${entryURL}lddt`;
    const residueIndex = model.atomicHierarchy.residueAtomSegments.index;
    const residueRowCount = model.atomicHierarchy.atoms._rowCount;
    const response = await fetch(lddtURL);
    const residueLDDT = await response.json();
    for (let i = 0, _i = residueRowCount; i < _i; i++) {
      map.set(i, residueLDDT[residueIndex[i]]);
    }
    return { value: map };
  },
  coloring: {
    getColor: (e) => {
      return scale.color(e);
    },
    defaultColor: defaultColor,
  },
  getLabel: function (e) {
    return `pLDDT: ${e}`;
  },
});
