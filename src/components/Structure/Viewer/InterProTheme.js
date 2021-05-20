import { ColorTheme } from 'molstar/lib/mol-theme/color';
import { ColorNames } from 'molstar/lib/mol-util/color/names';

/**
 *
 * @param {*} ctx
 * @param {*} props
 * @returns
 */
export const ResidueTheme = (ctx, props) => {
  const theme = {
    factory: ResidueTheme,
    palette: {
      colors: [ColorNames.white],
    },
    props: props,
    description: 'White theme for highlighting InterPro entries',
  };
  return theme;
};

export const ResidueThemeProvider = {
  name: 'basic-wrapper-custom-color-theme',
  label: 'InterPro REsidue Color Theme',
  category: ColorTheme.Category.Misc,
  factory: ResidueTheme,
  getParams: () => ({}),
  defaultValues: {},
  isApplicable: (ctx) => true,
};
