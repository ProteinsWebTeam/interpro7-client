/*
 * Copyright (c) 2016 - now David Sehnal, licensed under Apache 2.0, See LICENSE file for more info.
 */
class CustomTheme {
  constructor(Core, Visualisation, BootStrap, Q) {
    this.Core = Core;
    this.Visualisation = Visualisation;
    this.Bootstrap = BootStrap;
    this.Q = Q;
  }

  createTheme(model, colorDef) {
    var mapper = new ColorMapper(this.Core, this.Visualisation);
    mapper.addColor(colorDef.base);
    var map = new Uint8Array(model.data.atoms.count);
    for (var _i = 0, _a = colorDef.entries; _i < _a.length; _i++) {
      var e = _a[_i];
      var query = this.Q.sequence(
        e.entity_id.toString(),
        e.struct_asym_id,
        { seqNumber: e.start_residue_number },
        { seqNumber: e.end_residue_number },
      ).compile();
      var colorIndex = mapper.addColor(e.color);
      for (
        var _b = 0, _c = query(model.queryContext).fragments;
        _b < _c.length;
        _b++
      ) {
        var f = _c[_b];
        for (var _d = 0, _e = f.atomIndices; _d < _e.length; _d++) {
          var a = _e[_d];
          map[a] = colorIndex;
        }
      }
    }
    var fallbackColor = { r: 0.6, g: 0.6, b: 0.6 };
    var selectionColor = { r: 0, g: 0, b: 1 };
    var highlightColor = { r: 1, g: 0, b: 1 };
    var colors = this.Core.Utils.FastMap.create();
    colors.set('Uniform', fallbackColor);
    colors.set('Selection', selectionColor);
    colors.set('Highlight', highlightColor);
    var mapping = this.Visualisation.Theme.createColorMapMapping(
      function(i) {
        return map[i];
      },
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
    var visuals = plugin.selectEntities(
      this.Bootstrap.Tree.Selection.byRef(modelRef)
        .subtree()
        .ofType(this.Bootstrap.Entity.Molecule.Visual),
    );
    for (var _i = 0, visuals_2 = visuals; _i < visuals_2.length; _i++) {
      var v = visuals_2[_i];
      plugin.command(this.Bootstrap.Command.Visual.UpdateBasicTheme, {
        visual: v,
        theme: theme,
      });
    }
  }
}

class ColorMapper {
  constructor(Core, Visualisation) {
    this.Core = Core;
    this.uniqueColors = [];
    this.map = Core.Utils.FastMap.create();
    this.Visualisation = Visualisation;
  }

  addColor(color) {
    var id = color.r + '-' + color.g + '-' + color.b;
    if (this.map.has(id)) return this.map.get(id);
    var index = this.uniqueColors.length;
    this.uniqueColors.push(
      this.Visualisation.Color.fromRgb(color.r, color.g, color.b),
    );
    this.map.set(id, index);
    return index;
  }
}

Object.defineProperty(ColorMapper.prototype, 'colorMap', {
  get: function() {
    var map = this.Core.Utils.FastMap.create();
    this.uniqueColors.forEach(function(c, i) {
      return map.set(i, c);
    });
    return map;
  },
  enumerable: true,
  configurable: true,
});

export default CustomTheme;
