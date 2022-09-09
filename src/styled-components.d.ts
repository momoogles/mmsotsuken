import { CharcoalTheme } from "@charcoal-ui/theme";
import {} from "styled-components/cssprop";

declare module "styled-components" {
  export interface DefaultTheme extends CharcoalTheme {}
}
