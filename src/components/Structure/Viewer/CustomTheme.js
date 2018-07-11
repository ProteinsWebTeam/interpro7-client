/*
 * Copyright (c) 2016 - now David Sehnal, licensed under Apache 2.0, See LICENSE file for more info.
 */
class ColorMapper {
  constructor(Core, Visualisation) {
    this.Core = Core;
    this.uniqueColors = [];
    this.map = Core.Utils.FastMap.create();
    this.Visualisation = Visualisation;
  }

  addColor(color) {
    const id = `${color.r}-${color.g}-${color.b}`;
    if (this.map.has(id)) return this.map.get(id);
    const index = this.uniqueColors.length;
    this.uniqueColors.push(
      this.Visualisation.Color.fromRgb(color.r, color.g, color.b),
    );
    this.map.set(id, index);
    return index;
  }
}

class CustomTheme {
  constructor(Core, Visualisation, BootStrap, Q) {
    this.Core = Core;
    this.Visualisation = Visualisation;
    this.Bootstrap = BootStrap;
    this.Q = Q;
  }

  createTheme(model, colorDef) {
    const mapper = new ColorMapper(this.Core, this.Visualisation);
    mapper.addColor(colorDef.base);
    const map = new Uint8Array(model.data.atoms.count);
    for (const fragment of colorDef.entries) {
      const residues = [];
      for (
        let i = fragment.start_residue_number;
        i <= fragment.end_residue_number;
        i++
      ) {
        residues.push({
          authAsymId: fragment.struct_asym_id,
          authSeqNumber: i,
        });
      }
      const query = this.Q.residues(...residues).compile();

      const colorIndex = mapper.addColor(fragment.color);
      for (
        let _b = 0, _c = query(model.queryContext).fragments;
        _b < _c.length;
        _b++
      ) {
        for (let _d = 0, _e = _c[_b].atomIndices; _d < _e.length; _d++) {
          map[_e[_d]] = colorIndex;
        }
      }
    }
    const fallbackColor = { r: 0.6, g: 0.6, b: 0.6 };
    const selectionColor = { r: 0, g: 1, b: 1 };
    const highlightColor = { r: 0, g: 1, b: 0 };
    const colors = this.Core.Utils.FastMap.create();
    colors.set('Uniform', fallbackColor);
    colors.set('Selection', selectionColor);
    colors.set('Highlight', highlightColor);
    const mapping = this.Visualisation.Theme.createColorMapMapping(
      i => map[i],
      mapper.colorMap,
      fallbackColor,
    );
    // make the theme "sticky" so that it persist "ResetScene" command.
    return this.Visualisation.Theme.createMapping(mapping, {
      colors: colors,
      isSticky: true,
    });
  }

  applyTheme(plugin, modelRef, theme) {
    const visuals = plugin.selectEntities(
      this.Bootstrap.Tree.Selection.byRef(modelRef)
        .subtree()
        .ofType(this.Bootstrap.Entity.Molecule.Visual),
    );
    for (let _i = 0, visuals2 = visuals; _i < visuals2.length; _i++) {
      plugin.command(this.Bootstrap.Command.Visual.UpdateBasicTheme, {
        visual: visuals2[_i],
        theme: theme,
      });
    }
  }
}

Object.defineProperty(ColorMapper.prototype, 'colorMap', {
  get: function() {
    const map = this.Core.Utils.FastMap.create();
    this.uniqueColors.forEach((color, index) => map.set(index, color));
    return map;
  },
  enumerable: true,
  configurable: true,
});

export default CustomTheme;
