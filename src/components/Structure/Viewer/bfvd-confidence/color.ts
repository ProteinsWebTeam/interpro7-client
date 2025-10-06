import { Location } from 'molstar/lib/mol-model/location';
import { StructureElement } from 'molstar/lib/mol-model/structure';
import { ColorTheme, LocationColor } from 'molstar/lib/mol-theme/color';
import { ThemeDataContext } from 'molstar/lib/mol-theme/theme';
import { Color } from 'molstar/lib/mol-util/color';
import { ParamDefinition as PD } from 'molstar/lib/mol-util/param-definition';

const BFactorColors = [
  { max: 50, color: Color.fromRgb(255, 125, 69) },
  { max: 70, color: Color.fromRgb(255, 219, 19) },
  { max: 90, color: Color.fromRgb(101, 203, 243) },
  { max: 100, color: Color.fromRgb(0, 83, 214) },
];

export const BFactorColorThemeParams = {};

type Params = typeof BFactorColorThemeParams;

export function BFactorColorTheme(
  ctx: ThemeDataContext,
  props: PD.Values<Params>,
): ColorTheme<Params> {
  let color: LocationColor;

  console.log('here2');

  if (ctx.structure && !ctx.structure.isEmpty) {
    color = (location: Location) => {
      if (StructureElement.Location.is(location)) {
        console.log('here');
        const atom = location.unit.model.atomicConformation;
        const bFactor = atom.B_iso_or_equiv?.value(location.element);
        if (bFactor !== undefined) {
          for (const entry of BFactorColors) {
            if (bFactor <= entry.max) return entry.color;
          }
        }
      }
      return Color.fromRgb(170, 170, 170); // Default gray
    };
  } else {
    color = () => Color.fromRgb(170, 170, 170);
  }

  return {
    factory: BFactorColorTheme,
    granularity: 'group',
    color: color,
    props: props,
    description: 'Assigns residue colors according to the B-factor values',
  };
}

export const BFactorColorThemeProvider: ColorTheme.Provider<
  Params,
  'b-factor'
> = {
  name: 'b-factor',
  label: 'B-Factor',
  factory: BFactorColorTheme,
  getParams: () => BFactorColorThemeParams,
  defaultValues: PD.getDefaultValues(BFactorColorThemeParams),
  isApplicable: (ctx: ThemeDataContext) => !!ctx.structure,
  category: '',
};
