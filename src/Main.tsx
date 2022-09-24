import {
  columnSystem,
  COLUMN_UNIT,
  GUTTER_UNIT,
} from "@charcoal-ui/foundation";
import { Button } from "@charcoal-ui/react";
import { createTheme } from "@charcoal-ui/styled";
import styled, { css } from "styled-components";
import { Twemoji } from "./components/Emoji";
import { Step } from "./types";
import { unreachable } from "./utils/unreachable";

const theme = createTheme(styled);

const MAX_WIDTH = columnSystem(10, COLUMN_UNIT, GUTTER_UNIT);

export const Main = ({
  step,
  onNext,
}: {
  step: Extract<Step, 1 | 2 | 3 | 4>;
  onNext(step: Extract<Step, 2 | 3 | 4 | "epilogue">): void;
}) => {
  return (
    <div
      css={css`
        width: 100%;
        box-sizing: border-box;
        max-width: ${MAX_WIDTH}px;
        margin: auto;
        ${theme((o) => [o.padding.vertical(40)])}
      `}
    >
      <div
        css={css`
          ${theme((o) => [
            o.bg.surface3,
            o.borderRadius(24),
            o.padding.top(8).bottom(24),
          ])}
        `}
      >
        <div
          css={css`
            width: 100%;
            height: 600px;
            display: grid;
            place-content: center;
            ${theme((o) => [o.font.text1])}
          `}
        >
          <span
            css={css`
              ${theme((o) => [o.typography(32).bold])}
            `}
          >
            画像{step}
          </span>
        </div>
        <div
          css={css`
            ${theme((o) => [o.border.default.bottom, o.margin.bottom(24)])}
          `}
        />
        <div
          css={css`
            display: grid;
            gap: 16px;
            ${theme((o) => [o.padding.horizontal(24)])}
          `}
        >
          <div
            css={css`
              ${theme((o) => [o.typography(20).bold, o.font.text2])}
            `}
          >
            画像{step}
          </div>
          <div
            css={css`
              ${theme((o) => [o.typography(16), o.font.text3])}
            `}
          >
            画像{step}
          </div>
        </div>
        <div
          css={css`
            position: sticky;
            bottom: 0;
            display: grid;
            grid-auto-flow: column;
            place-content: start;
            gap: 8px;
            ${theme((o) => [
              o.padding.horizontal(24).vertical(16),
              o.margin.top(24),
              o.bg.background1,
            ])}
          `}
        >
          {["🥳", "💕", "💯", "😂", "🤔"].map((v) => (
            <Button className="gtm-reaction" data-gtm size="S">
              <span
                css={css`
                  pointer-events: none;
                `}
              >
                <Twemoji size={24} emoji={v} />
              </span>
            </Button>
          ))}
        </div>
      </div>
      <div
        css={css`
          display: grid;
          place-content: end;
          max-width: ${MAX_WIDTH};
          ${theme((o) => [o.margin.top(24)])}
        `}
      >
        {step === 1 || step === 2 || step === 3 ? (
          <Button
            // NOTE: stepが変わったらkeyでDOMを破壊してfocusを外す
            key={step}
            variant="Primary"
            size="M"
            onClick={() => onNext((step + 1) as 2 | 3 | 4)}
          >
            次へ進む
          </Button>
        ) : step === 4 ? (
          <Button
            // NOTE: stepが変わったらkeyでDOMを破壊してfocusを外す
            key={step}
            variant="Primary"
            size="M"
            onClick={() => onNext("epilogue")}
          >
            おわる
          </Button>
        ) : (
          unreachable(step)
        )}
      </div>
    </div>
  );
};
