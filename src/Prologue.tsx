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
import { Spinner } from "./components/Spinner";

const theme = createTheme(styled);

const TEXT_FIELD_MAX_WIDTH = columnSystem(3, COLUMN_UNIT, GUTTER_UNIT);

export const Prologue = ({
  onNext,
}: {
  onNext(p: { uid: string; step: Extract<Step, 1> }): Promise<void>;
}) => {
  const [loading, setLoading] = useState(false);
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
              maxLength={20}
              showCount
            />
          )}
        </div>
        {!isTypingUid ? (
          <Button size="M" onClick={() => setIsTypingUid(true)}>
            IDを入力
          </Button>
        ) : (
          <Button
            variant="Primary"
            disabled={loading}
            size="M"
            onClick={async () => {
              try {
                setLoading(true);
                await onNext({ uid, step: 1 });
              } finally {
                setLoading(false);
              }
            }}
          >
            {loading ? <Spinner /> : "はじめる"}
          </Button>
        )}
      </div>
    </div>
  );
};
