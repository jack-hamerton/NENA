
import 'styled-components';

declare module 'styled-components' {
  export interface DefaultTheme {
    primary: string;
    primaryHover: string;
    background: string;
    accent: string;
    text: string;
    borderColor: string;
    font: string;
    secondary: string;
    tertiary: string;
    colors: {[key: string]: string};
  }
}
