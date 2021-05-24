import { CustomElementProperty } from 'molstar/lib/mol-model-props/common/custom-element-property';
import { Color, ColorScale } from 'molstar/lib/mol-util/color';

const scale = ColorScale.create({
  listOrName: 'turbo',
  domain: [0, 1],
});

export const ColorByResidueLddtTheme = CustomElementProperty.create({
  label: 'Colour by Residue pLDDT score',
  name: 'basic-wrapper-residue-striping',
  getData: function (model) {
    const map = new Map();
    const residueIndex = model.atomicHierarchy.residueAtomSegments.index;
    for (let i = 0, _i = model.atomicHierarchy.atoms._rowCount; i < _i; i++) {
      map.set(i, Math.random());
    }
    return { value: map };
  },
  coloring: {
    getColor: (e) => {
      return scale.color(e);
      // return e === 0 ? Color(0xff0000) : Color(0x0000ff);
    },
    defaultColor: Color(0x777777),
  },
  getLabel: function (e) {
    return e === 0 ? 'Odd stripe' : 'Even stripe';
  },
});
