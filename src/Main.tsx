import {
  columnSystem,
  COLUMN_UNIT,
  GUTTER_UNIT,
} from "@charcoal-ui/foundation";
import { Button } from "@charcoal-ui/react";
import { createTheme } from "@charcoal-ui/styled";
import { maxWidth } from "@charcoal-ui/utils";
import { FC, useEffect, useRef, useState } from "react";
import styled, { css, keyframes } from "styled-components";
import { Twemoji } from "./components/Emoji";
import { emojis } from "./constants";
import { ChatIcon, LetterIcon, TalkIcon, VideoIcon } from "./Icons";
import { Step } from "./types";
import { unreachable } from "./utils/unreachable";

const theme = createTheme(styled);

type MainStep = Extract<Step, 1 | 2 | 3 | 4>;

const MAX_WIDTH = columnSystem(10, COLUMN_UNIT, GUTTER_UNIT);

const TEXT_NEGATIVE_MARGIN_Y = {
  desktop: 24,
  mobile: 12,
};
const TEXT_NEGATIVE_MARGIN_X = {
  desktop: 60,
  mobile: 32,
};

const MAIN_TEXT: {
  [key in MainStep]: {
    main: string;
    sub: string;
    title: string;
    description: string;
    Icon: FC;
  };
} = {
  1: {
    main: "テキストチャットで",
    sub: "伝えられた",
    title: "シーン１：相手とのテキストチャットで「好き」などと伝えられる",
    description:
      "LINEやInstagramのDMなど、相手と自分だけのチャットの中での出来事です。",
    Icon: ChatIcon,
  },
  2: {
    main: "ビデオ通話で",
    sub: "言われた",
    title: "シーン２：ビデオ通話している時に相手の口から直接「好き」と言われる",
    description:
      "寝る前や休日に暇で通話しているかもしれないし、勉強などを一緒にしていることもあるでしょう。",
    Icon: VideoIcon,
  },
  3: {
    main: "面と向かって",
    sub: "言われた",
    title: "シーン３：一緒の場所にいる時に相手の口から直接「好き」と言われる",
    description:
      "二人で出かけていて雰囲気のいいタイミングで言われるかもしれないし、他の人がいるところでこっそりと言われるかもしれません。",
    Icon: TalkIcon,
  },
  4: {
    main: "手書きの手紙を",
    sub: "渡された",
    title: "シーン４：告白が書かれた手書きの文章で「好き」などと伝えられる",
    description:
      "誕生日などのプレゼントと一緒に入っていたり、本など書類に紛れていたり...急に手渡しされることもあるでしょう。",
    Icon: LetterIcon,
  },
};

export const Main = ({
  step,
  onNext,
  onEnd,
}: {
  step: MainStep;
  onNext(step: Extract<Step, 2 | 3 | 4>): void;
  onEnd(p: { step: "epilogue"; reactions: number[] }): void;
}) => {
  const reactionCountRef = useRef(0);
  const [reactions, setReactions] = useState<number[]>([]);
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.returnValue = "";
      return "";
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, []);

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
            o.bg.background1,
            o.borderRadius(24),
            o.padding.top(8).bottom(24),
          ])}
        `}
      >
        <div
          css={css`
            width: 100%;
            display: grid;
            place-content: center;
            box-sizing: border-box;
            ${theme((o) => [o.font.text1, o.padding.all(24)])}
            @media ${(p) => maxWidth(p.theme.breakpoint.screen2)} {
              ${theme((o) => [o.padding.all(16)])}
            }
          `}
        >
          <Image step={step} />
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
              @media ${(p) => maxWidth(p.theme.breakpoint.screen2)} {
                ${theme((o) => [o.typography(16).bold])}
              }
            `}
          >
            {MAIN_TEXT[step].title}
          </div>
          <div
            css={css`
              ${theme((o) => [o.typography(14), o.font.text3])}
              @media ${(p) => maxWidth(p.theme.breakpoint.screen2)} {
                ${theme((o) => [o.typography(12).bold])}
              }
            `}
          >
            {MAIN_TEXT[step].description}
          </div>
        </div>
        <div
          key={step}
          css={css`
            position: sticky;
            bottom: 0;
            display: flex;
            flex-flow: row wrap;
            gap: 8px;
            ${theme((o) => [
              o.padding.horizontal(24).vertical(16),
              o.margin.top(24),
              o.bg.background1,
            ])}
          `}
        >
          {emojis.map((v) => (
            <EmojiButton
              key={v}
              emoji={v}
              step={step}
              onClick={() => {
                reactionCountRef.current += 1;
              }}
            />
          ))}
        </div>
      </div>
      <div
        css={css`
          display: grid;
          place-content: end;
          place-items: center;
          grid-auto-flow: column;
          gap: 16px;
          max-width: ${MAX_WIDTH};
          ${theme((o) => [o.margin.top(24)])}
        `}
      >
        <div
          css={css`
            display: flex;
          `}
        >
          {([1, 2, 3, 4] as const).map((n) => (
            <div
              key={n}
              css={[
                css`
                  display: grid;
                  place-content: center;
                  ${theme((o) => [
                    o.width.px(40),
                    o.height.px(40),
                    o.borderRadius("oval"),
                    o.typography(12).bold.preserveHalfLeading,
                    o.font.text2,
                  ])}
                `,
                n === step &&
                  css`
                    ${theme((o) => [o.bg.surface3])}
                  `,
                n < step &&
                  css`
                    ${theme((o) => [o.font.text4])}
                  `,
              ]}
            >
              {n}
            </div>
          ))}
        </div>
        {step === 1 || step === 2 || step === 3 ? (
          <Button
            // NOTE: stepが変わったらkeyでDOMを破壊してfocusを外す
            key={step}
            variant="Primary"
            size="M"
            onClick={() => {
              onNext((step + 1) as 2 | 3 | 4);
              setReactions((v) => [...v, reactionCountRef.current]);
              reactionCountRef.current = 0;
            }}
          >
            つぎへ
          </Button>
        ) : step === 4 ? (
          <Button
            // NOTE: stepが変わったらkeyでDOMを破壊してfocusを外す
            key={step}
            variant="Primary"
            size="M"
            onClick={() => {
              onEnd({
                step: "epilogue",
                reactions: [...reactions, reactionCountRef.current],
              });
            }}
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

const Image = ({ step }: { step: MainStep }) => {
  const Icon = MAIN_TEXT[step].Icon;
  return (
    <div
      css={css`
        padding: ${TEXT_NEGATIVE_MARGIN_Y.desktop}px
          ${TEXT_NEGATIVE_MARGIN_X.desktop}px;
        @media ${(p) => maxWidth(p.theme.breakpoint.screen2)} {
          padding: ${TEXT_NEGATIVE_MARGIN_Y.mobile}px
            ${TEXT_NEGATIVE_MARGIN_X.mobile}px;
        }
      `}
    >
      <div
        css={css`
          display: grid;
          place-items: center;
          ${theme((o) => [o.bg.surface3, o.padding.all(24)])}
          position: relative;
        `}
      >
        <Icon />
        <div
          css={[
            css`
              display: grid;
              position: absolute;
              top: -${TEXT_NEGATIVE_MARGIN_Y.desktop}px;
              @media ${(p) => maxWidth(p.theme.breakpoint.screen2)} {
                top: -${TEXT_NEGATIVE_MARGIN_Y.mobile}px;
              }
            `,
            step % 2 === 0 &&
              css`
                place-items: start;
                left: -${TEXT_NEGATIVE_MARGIN_X.desktop}px;
                @media ${(p) => maxWidth(p.theme.breakpoint.screen2)} {
                  left: -${TEXT_NEGATIVE_MARGIN_X.mobile}px;
                }
              `,
            step % 2 !== 0 &&
              css`
                place-items: end;
                right: -${TEXT_NEGATIVE_MARGIN_X.desktop}px;
                @media ${(p) => maxWidth(p.theme.breakpoint.screen2)} {
                  right: -${TEXT_NEGATIVE_MARGIN_X.mobile}px;
                }
              `,
          ]}
        >
          {[MAIN_TEXT[step].main, MAIN_TEXT[step].sub].map((v, i) => (
            <div
              key={v}
              css={css`
                overflow: hidden;
                width: fit-content;
                white-space: none;
                position: relative;
                ${theme((o) => [o.bg.surface1])}
                ${theme((o) => [o.typography(32).bold])}
                @media ${(p) => maxWidth(p.theme.breakpoint.screen2)} {
                  ${theme((o) => [o.typography(20).bold])}
                }
              `}
            >
              {v}
              <div
                key={step}
                css={[
                  css`
                    position: absolute;
                    inset: 0;
                    ${theme((o) => [o.bg.text1])};
                  `,
                  i === 0 &&
                    slideInAnimationCss({
                      to: step % 2 === 0 ? "right" : "left",
                      delay: "0.2s",
                    }),
                  i === 1 &&
                    slideInAnimationCss({
                      to: step % 2 === 0 ? "right" : "left",
                      delay: "0.3s",
                    }),
                ]}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const VARIANT: {
  [key in MainStep]: {
    [key in typeof emojis[number]]: {
      initCount: number;
      mockCounts: [number, number, number, number, number];
    };
  };
} = {
  1: {
    "😂": {
      initCount: 1,
      mockCounts: [1, 1, 0, 1, 0],
    },
    "😅": {
      initCount: 22,
      mockCounts: [1, 0, 2, 1, 1],
    },
    "😊": {
      initCount: 46,
      mockCounts: [4, 8, 3, 2, 4],
    },
    "😍": {
      initCount: 13,
      mockCounts: [1, 3, 2, 2, 1],
    },
    "🤔": {
      initCount: 40,
      mockCounts: [1, 2, 0, 1, 4],
    },
  },
  2: {
    "😂": {
      initCount: 47,
      mockCounts: [1, 1, 0, 2, 0],
    },
    "😅": {
      initCount: 2,
      mockCounts: [1, 0, 0, 1, 2],
    },
    "😊": {
      initCount: 46,
      mockCounts: [7, 3, 7, 7, 4],
    },
    "😍": {
      initCount: 42,
      mockCounts: [2, 3, 2, 6, 1],
    },
    "🤔": {
      initCount: 14,
      mockCounts: [1, 1, 1, 1, 4],
    },
  },
  3: {
    "😂": {
      initCount: 1,
      mockCounts: [2, 1, 1, 1, 0],
    },
    "😅": {
      initCount: 42,
      mockCounts: [1, 0, 2, 2, 1],
    },
    "😊": {
      initCount: 46,
      mockCounts: [2, 3, 2, 1, 4],
    },
    "😍": {
      initCount: 92,
      mockCounts: [5, 3, 8, 2, 8],
    },
    "🤔": {
      initCount: 2,
      mockCounts: [0, 0, 1, 4, 1],
    },
  },
  4: {
    "😂": {
      initCount: 80,
      mockCounts: [2, 2, 5, 1, 0],
    },
    "😅": {
      initCount: 40,
      mockCounts: [1, 0, 2, 2, 1],
    },
    "😊": {
      initCount: 13,
      mockCounts: [2, 3, 2, 1, 4],
    },
    "😍": {
      initCount: 5,
      mockCounts: [0, 0, 1, 2, 0],
    },
    "🤔": {
      initCount: 69,
      mockCounts: [2, 0, 1, 4, 1],
    },
  },
};

const EmojiButton = ({
  emoji,
  step,
  onClick,
}: {
  emoji: typeof emojis[number];
  step: MainStep;
  onClick(): void;
}) => {
  const [current, setCurrent] = useState<number>(0);
  const [plus, setPlus] = useState<number>(0);
  const [count, setCount] = useState(VARIANT[step][emoji].initCount);

  useEffect(() => {
    const lag = Math.floor(Math.random() * 100);
    const count = VARIANT[step][emoji].mockCounts[current] ?? 1;
    const timeoutId = setTimeout(() => {
      setCount((v) => v + count);
      setCurrent((v) => (v < 4 ? v + 1 : 0));
    }, 4000 + lag);
    return () => clearTimeout(timeoutId);
  }, [current]);

  return (
    <Button
      className="gtm-reaction"
      data-gtm
      size="S"
      onClick={() => {
        setPlus((v) => v + 1);
        onClick();
      }}
    >
      <span
        css={css`
          position: relative;
          z-index: 0;
          pointer-events: none;
        `}
      >
        <Twemoji size={24} emoji={emoji} />
        <span
          css={css`
            margin-left: 4px;
          `}
        >
          {count + plus}
        </span>
        {plus > 0 && (
          <span
            css={css`
              position: absolute;
              top: 0;
              right: 0;
              transform: translate(100%, -50%);
              ${theme((o) => [o.typography(12).bold, o.font.assertive])}
            `}
          >
            +{plus}
          </span>
        )}
      </span>
    </Button>
  );
};

const slideInAnimationCss = ({
  to,
  delay,
}: {
  to: "right" | "left";
  delay: `${number}s`;
}) => css`
  animation: ${to === "right"
      ? slideToRight
      : to === "left"
      ? slideToLeft
      : unreachable(to)}
    0.2s ${delay} cubic-bezier(0.9, 0.01, 0.6, 1.01) forwards;
`;

const slideToRight = keyframes`
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(101%);
  }
`;

const slideToLeft = keyframes`
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-101%);
  }
`;
