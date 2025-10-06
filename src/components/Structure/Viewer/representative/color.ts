import { Location } from 'molstar/lib/mol-model/location';
import { ColorTheme, LocationColor } from 'molstar/lib/mol-theme/color';
import { ThemeDataContext } from 'molstar/lib/mol-theme/theme';
import { Color } from 'molstar/lib/mol-util/color';
import { ParamDefinition as PD } from 'molstar/lib/mol-util/param-definition';
import {
  StructureElement,
  StructureProperties,
} from 'molstar/lib/mol-model/structure';

type ColorMap = Record<number, string>;

export const RepresentativeThemeParams = {
  colorMap: PD.Value<ColorMap>({} as ColorMap),
};

type Params = typeof RepresentativeThemeParams;

export function RepresentativeTheme(
  ctx: ThemeDataContext,
  props: PD.Values<Params>,
): ColorTheme<Params> {
  let color: LocationColor;

  console.log(ctx, props);

  if (ctx.structure && !ctx.structure.isEmpty) {
    color = (location: Location) => {
      if (StructureElement.Location.is(location)) {
        const pos = StructureProperties.residue.auth_seq_id(location);
        if (props.colorMap[pos] !== undefined) {
          return Color.fromHexStyle(props.colorMap[pos].toUpperCase());
        }
        return Color.fromRgb(170, 170, 170);
      }
      return Color.fromRgb(170, 170, 170);
    };
  } else {
    color = () => Color.fromRgb(170, 170, 170);
  }

  return {
    factory: RepresentativeTheme,
    granularity: 'instance',
    color: color,
    props: props,
    description: 'Assigns residue colors according to the B-factor values',
  };
}

export const RepresentativeThemeProvider: ColorTheme.Provider<
  Params,
  'representative'
> = {
  name: 'representative',
  label: 'Representative',
  factory: RepresentativeTheme,
  getParams: () => RepresentativeThemeParams,
  defaultValues: PD.getDefaultValues(RepresentativeThemeParams),
  isApplicable: (ctx: ThemeDataContext) => !!ctx.structure,
  category: '',
};
