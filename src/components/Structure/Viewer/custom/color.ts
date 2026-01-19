import { Location } from 'molstar/lib/mol-model/location';
import { ColorTheme, LocationColor } from 'molstar/lib/mol-theme/color';
import { ThemeDataContext } from 'molstar/lib/mol-theme/theme';
import { Color } from 'molstar/lib/mol-util/color';
import { ParamDefinition as PD } from 'molstar/lib/mol-util/param-definition';
import {
  StructureElement,
  StructureProperties,
} from 'molstar/lib/mol-model/structure';

type ColorMap = Record<number, number>;

export const CustomThemeParams = {
  colorMap: PD.Value<ColorMap>({} as ColorMap),
};

type Params = typeof CustomThemeParams;

export function CustomTheme(
  ctx: ThemeDataContext,
  props: PD.Values<Params>,
): ColorTheme<Params> {
  let color: LocationColor;

  if (ctx.structure && !ctx.structure.isEmpty) {
    color = (location: Location) => {
      if (StructureElement.Location.is(location)) {
        const pos = StructureProperties.residue.auth_seq_id(location);
        if (props.colorMap[pos]) {
          return Color(props.colorMap[pos]);
        }
        return Color.fromRgb(170, 170, 170);
      }
      return Color.fromRgb(170, 170, 170);
    };
  } else {
    color = () => Color.fromRgb(170, 170, 170);
  }

  return {
    factory: CustomTheme,
    granularity: 'groupInstance',
    color: color,
    props: props,
    description: 'Assigns residue colors according to the B-factor values',
  };
}

export const CustomThemeProvider: ColorTheme.Provider<Params, 'custom'> = {
  name: 'custom',
  label: 'custom',
  factory: CustomTheme,
  getParams: () => CustomThemeParams,
  defaultValues: PD.getDefaultValues(CustomThemeParams),
  isApplicable: (ctx: ThemeDataContext) => !!ctx.structure,
  category: '',
};
