import { ColorTheme } from 'molstar/lib/mol-theme/color';
import { ColorNames } from 'molstar/lib/mol-util/color/names';

export function SelectionTheme(ctx, props) {
  const theme = {
    factory: SelectionTheme,
    palette: {
      colors: [ColorNames.white],
    },
    props: props,
    description: 'White theme for highlighting InterPro entries',
  };
  return theme;
}

export const SelectionThemeProvider = {
  name: 'basic-wrapper-custom-color-theme',
  label: 'InterPro Color Theme',
  category: ColorTheme.Category.Misc,
  factory: SelectionTheme,
  getParams: () => ({}),
  defaultValues: {},
  isApplicable: (ctx) => true,
};
