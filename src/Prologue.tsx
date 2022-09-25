import styled, { css } from "styled-components";
import { createTheme } from "@charcoal-ui/styled";
import { Button, TextField } from "@charcoal-ui/react";
import { useState } from "react";
import {
  columnSystem,
  COLUMN_UNIT,
  GUTTER_UNIT,
} from "@charcoal-ui/foundation";
import { Step } from "./types";

const theme = createTheme(styled);

const TEXT_FIELD_MAX_WIDTH = columnSystem(3, COLUMN_UNIT, GUTTER_UNIT);

export const Prologue = ({
  onNext,
}: {
  onNext(step: Extract<Step, 1>): void;
}) => {
  const [uid, setUid] = useState("");
  const [isTypingUid, setIsTypingUid] = useState(false);
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
      <div
        css={css`
          display: grid;
          gap: 16px;
          ${theme((o) => [o.font.text2])}
        `}
      >
        <span
          css={css`
            ${theme((o) => [o.typography(16).bold])}
          `}
        >
          あなたが好きな人からこんなコクハクをされたらどう思いますか？
        </span>
        <span
          css={css`
            ${theme((o) => [o.typography(16).bold])}
          `}
        >
          <span> </span>
          <span
            css={css`
              ${theme((o) => [o.font.brand])}
            `}
          >
            "リアクション機能"
          </span>
          を使って評価しましょう！
        </span>
      </div>
      <div
        css={css`
          display: grid;
          place-items: center;
          margin: auto;
          max-width: ${TEXT_FIELD_MAX_WIDTH}px;
        `}
      >
        <div
          css={css`
            transition: height 0.2s;
            height: ${isTypingUid ? 40 + 24 : 0}px;
          `}
        >
          {isTypingUid && (
            <TextField
              autoFocus
              placeholder="IDを入力"
              value={uid}
              onChange={setUid}
              maxLength={10}
              showCount
            />
          )}
        </div>
        {!isTypingUid ? (
          <Button size="M" onClick={() => setIsTypingUid(true)}>
            IDを入力
          </Button>
        ) : (
          <Button size="M" onClick={() => onNext(1)}>
            はじめる
          </Button>
        )}
      </div>
    </div>
  );
};
