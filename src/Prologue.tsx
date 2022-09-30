import styled, { css } from "styled-components";
import { createTheme } from "@charcoal-ui/styled";
import { Button, TextField } from "@charcoal-ui/react";
import { Dispatch, SetStateAction, useState } from "react";
import {
  columnSystem,
  COLUMN_UNIT,
  GUTTER_UNIT,
} from "@charcoal-ui/foundation";
import { Spinner } from "./components/Spinner";

const theme = createTheme(styled);

const TEXT_FIELD_MAX_WIDTH = columnSystem(3, COLUMN_UNIT, GUTTER_UNIT);

export const Prologue = ({
  typingUid,
  setTypingUid,
  error,
  onNext,
}: {
  typingUid: string;
  setTypingUid: Dispatch<SetStateAction<string>>;
  /** NOTE: 空文字列ならエラーがないとする */
  error: string | "";
  onNext(): Promise<void>;
}) => {
  const [loading, setLoading] = useState(false);
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
          もし好きな人から電話で告白されたら...手紙で告白されたら...直接告白されたら...！
        </span>
        <span
          css={css`
            ${theme((o) => [o.typography(16).bold])}
          `}
        >
          これから見せるさまざまなシチュエーションを
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
          gap: 8px;
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
              assistiveText={error}
              invalid={error !== ""}
              value={typingUid}
              onChange={setTypingUid}
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
            disabled={typingUid === "" || loading}
            size="M"
            onClick={async () => {
              try {
                setLoading(true);
                await onNext();
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
