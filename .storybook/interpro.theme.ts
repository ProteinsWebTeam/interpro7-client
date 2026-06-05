import { create } from '@storybook/theming/create';
import interproLogo from '../src/images/logo/logo_Interpro.png';

export default create({
  base: 'light',
  brandTitle: 'InterPro 7',
  brandUrl: 'https://www.ebi.ac.uk/interpro',
  brandImage: interproLogo,
});
