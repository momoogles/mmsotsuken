import styled, { css, keyframes } from "styled-components";
import { createTheme } from "@charcoal-ui/styled";

const theme = createTheme(styled);

export const Spinner = () => (
  <div
    css={css`
      animation: ${pop} 0.8s infinite;
      width: 24px;
      height: 24px;
      ${theme((o) => [o.bg.icon6, o.borderRadius("oval")])}
    `}
  />
);

const pop = keyframes`
  0% {
    opacity: 0;
    transform: scale(0);
  }
  50% {
    opacity: 1;
    transform: scale(1);
  }
  100% {
    opacity: 0;
  }
`;
