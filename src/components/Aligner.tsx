import styled, { css } from "styled-components";
import { createTheme } from "@charcoal-ui/styled";
import { maxWidth } from "@charcoal-ui/utils";
import { PropsWithChildren, ComponentProps } from "react";
import {
  columnSystem,
  COLUMN_UNIT,
  GUTTER_UNIT,
} from "@charcoal-ui/foundation";

const theme = createTheme(styled);

const MAX_WIDTH = columnSystem(12, COLUMN_UNIT, GUTTER_UNIT);

export const Aligner = ({ children }: PropsWithChildren<{}>) => (
  <div
    css={css`
      ${theme((o) => [o.padding.horizontal(24)])}
      @media ${(p) => maxWidth(p.theme.breakpoint.screen2)} {
        ${theme((o) => [o.padding.horizontal(16)])}
      }
    `}
  >
    <div
      css={css`
        max-width: ${MAX_WIDTH}px;
        margin: 0 auto;
        height: 100%;
      `}
    >
      {children}
    </div>
  </div>
);
