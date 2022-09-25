import styled, { css } from "styled-components";
import { createTheme } from "@charcoal-ui/styled";

const theme = createTheme(styled);

export const Epilogue = ({ uid }: { uid?: string }) => {
  return (
    <div
      css={css`
        display: grid;
        width: 100%;
        height: 100%;
        place-content: center;
        text-align: center;
        gap: 24px;
      `}
    >
      <span
        css={css`
          ${theme((o) => [o.typography(16).bold, o.font.text1])}
        `}
      >
        {uid && `ID: ${uid} の回答は終了しました。`}
        ご協力ありがとうございました！
      </span>
    </div>
  );
};
