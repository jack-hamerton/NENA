
import 'styled-components';

declare module 'styled-components' {
  export interface DefaultTheme {
    primary: string;
    primaryHover: string;
    background: string;
    accent: string;
    text: string;
    borderColor: string;
  }
}
