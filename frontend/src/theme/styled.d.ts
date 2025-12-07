import 'styled-components';
import { xiaoGenshin } from './xiaoGenshin';

type Theme = typeof xiaoGenshin;

declare module 'styled-components' {
  export interface DefaultTheme extends Theme {}
}
