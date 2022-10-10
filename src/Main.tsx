import {
  columnSystem,
  COLUMN_UNIT,
  GUTTER_UNIT,
} from "@charcoal-ui/foundation";
import { Button } from "@charcoal-ui/react";
import { createTheme } from "@charcoal-ui/styled";
import { maxWidth } from "@charcoal-ui/utils";
import {
  autoPlacement,
  offset,
  Strategy,
  useFloating,
} from "@floating-ui/react-dom";
import {
  ComponentProps,
  FC,
  forwardRef,
  PropsWithChildren,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import styled, { css, keyframes } from "styled-components";
import { UserDocument } from "./api/types";
import { Twemoji } from "./components/Emoji";
import {
  createFloatingEmoji,
  FloatingEmojis,
  MAX_LEVEL_SIZE,
} from "./components/FloatingEmojis";
import { Spinner } from "./components/Spinner";
import { emojis } from "./constants";
import { ChatIcon, LetterIcon, TalkIcon, VideoIcon } from "./Icons";
import { Step } from "./types";
import { unreachable } from "./utils/unreachable";

const theme = createTheme(styled);

type MainStep = Extract<Step, 1 | 2 | 3 | 4>;

const PAGER_NUMBER_LABEL_SIZE = 24;

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
    sub: "告白される",
    title: "シーン１：相手とのテキストチャットで「好き」などと伝えられた",
    description:
      "LINEやInstagramのDMなど、相手と自分だけのチャットの中での出来事です。",
    Icon: ChatIcon,
  },
  2: {
    main: "ビデオ通話で",
    sub: "告白される",
    title: "シーン２：ビデオ通話している時に相手の口から直接「好き」と言われた",
    description:
      "寝る前や休日に暇で通話しているかもしれないし、勉強などを一緒にしていることもあるでしょう。",
    Icon: VideoIcon,
  },
  3: {
    main: "面と向かって",
    sub: "告白される",
    title: "シーン３：一緒の場所にいる時に相手の口から直接「好き」と言われた",
    description:
      "二人で出かけていて雰囲気のいいタイミングで言われるかもしれないし、他の人がいるところでこっそりと言われるかもしれません。",
    Icon: TalkIcon,
  },
  4: {
    main: "手書きの手紙で",
    sub: "告白される",
    title: "シーン４：「好きです」と書かれた手書きの文章を渡された",
    description:
      "誕生日などのプレゼントと一緒に入っていたり、本など書類に紛れていたり...急に手渡しされることもあるでしょう。",
    Icon: LetterIcon,
  },
};

export const Main = ({
  step,
  group,
  onNext,
  onEnd,
}: {
  step: MainStep;
  group: UserDocument["group"];
  onNext(step: Extract<Step, 2 | 3 | 4>): void;
  onEnd(p: { step: "epilogue"; reactions: number[] }): Promise<void>;
}) => {
  const [reacted, setReacted] = useState(false);
  const reactionsRef = useRef<Map<MainStep, number>>(new Map());
  const [tooltip, setTooltip] = useState(true);

  const { x, y, strategy, reference, floating } = useFloating({
    strategy: "absolute",
    middleware: [autoPlacement({ alignment: "start" }), offset(24)],
  });

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.returnValue = "";
      return "";
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, []);

  const handleNext = () => {
    onNext((step + 1) as 2 | 3 | 4);
    return setTooltip(false);
  };

  const handleEnd = async () => {
    const reactions: number[] = [];
    for (const [step, value] of reactionsRef.current.entries()) {
      reactions[step - 1] = value;
    }
    await onEnd({
      step: "epilogue",
      reactions,
    });
  };

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
        {tooltip && (
          <Tooltip
            ref={floating}
            strategy={strategy}
            y={y}
            x={x}
            onConfirm={() => setTooltip(false)}
          >
            <span>あなたの感想と似ている絵文字を</span>
            <span
              css={css`
                ${theme((o) => [o.bg.surface4])}
              `}
            >
              {" "}
              たくさん連打{" "}
            </span>
            <span>{"して、\nいまの気持ちを表現しましょう！"}</span>
          </Tooltip>
        )}
        <div
          key={step}
          css={css`
            position: sticky;
            bottom: 0;
            ${theme((o) => [
              o.padding.horizontal(24).vertical(16),
              o.margin.top(24),
              o.bg.background1,
            ])}
          `}
        >
          <div
            ref={reference}
            css={css`
              display: flex;
              gap: 8px;
              flex-flow: row wrap;
            `}
          >
            {emojis.map((v) => (
              <EmojiButton
                key={v}
                withMotion={group === "with-motion"}
                emoji={v}
                step={step}
                onClick={() => {
                  const reaction = reactionsRef.current.get(step);
                  reactionsRef.current.set(step, (reaction ?? 0) + 1);
                  setReacted(true);
                }}
              />
            ))}
          </div>
          <footer
            css={css`
              ${theme((o) => [o.margin.top(40)])}
            `}
          >
            <Footer
              step={step}
              reacted={reacted}
              onNext={handleNext}
              onEnd={handleEnd}
            />
          </footer>
        </div>
      </div>
    </div>
  );
};

const Footer = ({
  step,
  reacted,
  onNext,
  onEnd,
}: {
  step: MainStep;
  reacted: boolean;
  onNext(): void;
  onEnd(): Promise<void>;
}) => {
  const [timer, setTimer] = useState(10);
  const [endLoading, setEndLoading] = useState(false);

  useEffect(() => {
    if (timer > 0) {
      const timeoutId = setTimeout(() => {
        setTimer((v) => v - 1);
      }, 1000);
      return () => clearTimeout(timeoutId);
    }
  }, [timer]);

  const timerViewer =
    timer > 0 ? (
      <div
        css={css`
          position: absolute;
          bottom: 100%;
          right: 0;
          ${theme((o) => [
            o.font.text2,
            o.typography(14).bold,
            o.padding.vertical(4),
          ])}
        `}
      >
        (あと{timer}秒)
      </div>
    ) : null;

  return (
    <div
      css={css`
        display: flex;
        align-items: center;
        justify-content: flex-end;
        gap: 16px;
      `}
    >
      <div
        css={css`
          flex: 1;
          max-width: ${columnSystem(3, COLUMN_UNIT, GUTTER_UNIT)}px;
        `}
      >
        <div
          css={css`
            position: relative;
            z-index: 0;
            overflow: hidden;
            ${theme((o) => [
              o.borderRadius("oval"),
              o.border.default,
              o.height.px(8),
              o.bg.surface2,
            ])}

            ::before {
              content: "";
              position: absolute;
              inset: 0;
              transform: translateX(-${100 - step * 20}%);
              ${theme((o) => [o.bg.brand])}
            }
          `}
        />
        <div
          css={css`
            display: flex;
            justify-content: space-between;
            margin: 0 -${PAGER_NUMBER_LABEL_SIZE / 2 - 4}px;
          `}
        >
          {([0, 1, 2, 3, 4, 5] as const).map((n) => (
            <div
              key={n}
              css={[
                css`
                  display: grid;
                  place-items: center;
                  ${theme((o) => [
                    o.margin.top(4),
                    o.width.px(PAGER_NUMBER_LABEL_SIZE),
                    o.height.px(PAGER_NUMBER_LABEL_SIZE),
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
      </div>
      <div
        // NOTE: stepが変わったらkeyでDOMを破壊してfocusを外す
        key={step}
      >
        {step === 1 || step === 2 || step === 3 ? (
          <Button
            css={css`
              position: relative;
              z-index: 0;
            `}
            disabled={!reacted || timer > 0}
            variant="Primary"
            size="M"
            onClick={onNext}
          >
            つぎへ
            {timerViewer}
          </Button>
        ) : step === 4 ? (
          <Button
            css={css`
              position: relative;
              z-index: 0;
            `}
            disabled={endLoading || timer > 0}
            variant="Primary"
            size="M"
            onClick={async () => {
              try {
                setEndLoading(true);
                await onEnd();
              } finally {
                setEndLoading(false);
              }
            }}
          >
            {endLoading ? <Spinner /> : "おわる"}
            {timerViewer}
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
          css={css`
            overflow: hidden;
            width: fit-content;
            white-space: none;
            position: relative;
            ${theme((o) => [o.bg.surface1])}
            ${theme((o) => [o.typography(20).bold])}
                @media ${(p) => maxWidth(p.theme.breakpoint.screen2)} {
              ${theme((o) => [o.typography(16).bold])}
            }
          `}
        >
          どう思いますか？
          <div
            key={step}
            css={[
              css`
                position: absolute;
                inset: 0;
                ${theme((o) => [o.bg.text1])};
              `,
              slideInAnimationCss({
                to: step % 2 === 0 ? "left" : "right",
                delay: "0.4s",
              }),
            ]}
          />
        </div>
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

const LEVEL_THRESHOLD = [2, 5, 10, 18] as const;

const useLevel = () => {
  const growingRef = useRef(false);
  const [levelCount, setLevelCount] = useState<number>(0);
  const level: 1 | 2 | 3 | 4 | 5 =
    levelCount < LEVEL_THRESHOLD[0]
      ? 1
      : levelCount < LEVEL_THRESHOLD[1]
      ? 2
      : levelCount < LEVEL_THRESHOLD[2]
      ? 3
      : levelCount < LEVEL_THRESHOLD[3]
      ? 4
      : 5;

  useEffect(() => {
    if (levelCount > 0) {
      const timeoutId = setTimeout(() => {
        growingRef.current = false;
        setLevelCount((v) =>
          v >= LEVEL_THRESHOLD[3]
            ? LEVEL_THRESHOLD[2]
            : v >= LEVEL_THRESHOLD[2]
            ? LEVEL_THRESHOLD[1]
            : v >= LEVEL_THRESHOLD[1]
            ? LEVEL_THRESHOLD[0]
            : 0
        );
      }, 600);
      return () => clearTimeout(timeoutId);
    }
  }, [levelCount]);

  const incrementLevelCount = useCallback(() => {
    growingRef.current = true;
    setLevelCount((v) => v + 1);
  }, []);

  return { level, incrementLevelCount, growing: growingRef.current };
};

const EmojiButton = ({
  emoji,
  step,
  withMotion,
  onClick,
}: {
  emoji: typeof emojis[number];
  step: MainStep;
  withMotion?: boolean;
  onClick(): void;
}) => {
  const [current, setCurrent] = useState<number>(0);
  const [plusCount, setPlusCount] = useState<number>(0);
  const [count, setCount] = useState(VARIANT[step][emoji].initCount);
  const [floatingEmojis, setFloatingEmojis] = useState<
    ComponentProps<typeof FloatingEmojis>["floatingEmojis"]
  >([]);

  const { level, incrementLevelCount, growing } = useLevel();

  useEffect(() => {
    const lag = Math.floor(Math.random() * 100);
    const count = VARIANT[step][emoji].mockCounts[current] ?? 1;
    const timeoutId = setTimeout(() => {
      setCount((v) => v + count);
      setCurrent((v) => (v < 4 ? v + 1 : 0));
    }, 4000 + lag);
    return () => clearTimeout(timeoutId);
  }, [current]);

  const circleScale =
    level === 1
      ? 1.0
      : level === 2
      ? 1.02
      : level === 3
      ? 1.06
      : level === 4
      ? 1.32
      : 1.5;
  const twemojiScale =
    level === 1
      ? 1.0
      : level === 2
      ? 1.06
      : level === 3
      ? 1.2
      : level === 4
      ? 1.32
      : 1.5;

  return (
    <Button
      className="gtm-reaction"
      data-gtm
      size="S"
      onClick={() => {
        setPlusCount((v) => v + 1);

        incrementLevelCount();
        const maxDurationMs = 1500;
        setFloatingEmojis((v) => [
          ...v,
          {
            id: (v[v.length - 1]?.id ?? 0) + 1,
            level,
            emoji,
            ...createFloatingEmoji({ maxDurationMs }),
          },
        ]);
        setTimeout(() => {
          setFloatingEmojis((v) => v.slice(1));
        }, maxDurationMs);

        onClick();
      }}
    >
      <span
        css={css`
          position: relative;
          z-index: 0;
          pointer-events: none;
          display: inline-flex;
          align-items: center;
        `}
      >
        <span
          css={[
            css`
              display: inline-grid;
              place-content: center;
            `,
            withMotion &&
              css`
                position: relative;
                z-index: 0;
              `,
          ]}
        >
          <span
            key={plusCount}
            css={[
              css`
                display: inline-grid;
                place-content: center;
                transition: transform 0.2s ease-in;
              `,
              withMotion &&
                growing &&
                emojiPulseAnimationCss({
                  initScale: twemojiScale,
                }),
            ]}
          >
            <Twemoji size={20} emoji={emoji} />
          </span>
          {withMotion &&
            growing &&
            floatingEmojis.map(({ id }) => (
              <div
                key={id}
                css={[
                  css`
                    position: absolute;
                    z-index: -1;
                    border-radius: 50%;
                    inset: 0;
                  `,
                  level < 3
                    ? css`
                        border: 1px solid ${(p) => p.theme.color.brand};
                      `
                    : level < 5
                    ? css`
                        border: 2px solid #b356de;
                      `
                    : css`
                        border: 3px solid ${(p) => p.theme.color.assertive};
                      `,
                  circlePulseAnimationCss({ initScale: circleScale }),
                ]}
              />
            ))}
        </span>
        <span
          css={css`
            margin-left: 4px;
          `}
        >
          {count + plusCount}
        </span>
        {plusCount > 0 && (
          <span
            css={[
              css`
                position: absolute;
                top: 0;
                right: 0;
                transform: translate(100%, -50%);
                ${theme((o) => [o.typography(12).bold, o.font.assertive])}
              `,
              withMotion &&
                css`
                  transition: color 0.2s ease-in;
                `,
              withMotion &&
                (level < 3
                  ? css`
                      ${theme((o) => [o.font.brand])}
                    `
                  : level < 5
                  ? css`
                      color: #b356de;
                    `
                  : css`
                      ${theme((o) => [o.font.assertive])}
                    `),
            ]}
          >
            +{plusCount}
          </span>
        )}
        {withMotion && (
          <span
            css={css`
              position: absolute;
              top: -${MAX_LEVEL_SIZE}px;
              right: 0;
            `}
          >
            <FloatingEmojis floatingEmojis={floatingEmojis} />
          </span>
        )}
      </span>
    </Button>
  );
};

const slideToRight = keyframes`
  100% {
    transform: translateX(101%);
  }
`;
const slideToLeft = keyframes`
  100% {
    transform: translateX(-101%);
  }
`;
const slideInAnimationCss = ({
  to,
  delay,
}: {
  to: "right" | "left";
  delay: `${number}s`;
}) => css`
  transform: translateX(0);
  animation: ${to === "right"
      ? slideToRight
      : to === "left"
      ? slideToLeft
      : unreachable(to)}
    0.2s ${delay} cubic-bezier(0.9, 0.01, 0.6, 1.01) forwards;
`;

const emojiPulse = ({ initScale }: { initScale: number }) => keyframes`
  50% {
    transform: scale(${initScale - 0.2})
  }
`;
const emojiPulseAnimationCss = ({ initScale }: { initScale: number }) => css`
  transform: scale(${initScale});
  animation: ${emojiPulse({ initScale })} 0.2s linear 1;
`;

const circlePulse = ({ initScale }: { initScale: number }) => keyframes`
  50% {
    opacity: 0.8;
  }
  100%{
    transform: scale(${initScale + 1});
    opacity: 0;
  }
`;
const circlePulseAnimationCss = ({ initScale }: { initScale: number }) => css`
  opacity: 0;
  transform: scale(${initScale});
  animation: ${circlePulse({ initScale })} 0.4s 0.1s forwards;
`;

const Tooltip = forwardRef<
  HTMLDivElement,
  PropsWithChildren<{
    strategy: Strategy;
    x: number | null;
    y: number | null;
    onConfirm(): void;
  }>
>(({ strategy, y, x, onConfirm, children }, ref) => (
  <div
    ref={ref}
    css={css`
      ${theme((o) => [o.bg.brand, o.borderRadius(16)])}
    `}
    style={{
      position: strategy,
      top: y ?? 0,
      left: x ?? 0,
    }}
  >
    <div
      css={css`
        position: relative;
        z-index: 0;
        ${theme((o) => [o.padding.all(16)])}

        ::after {
          content: "";
          position: absolute;
          bottom: -6px;
          left: 60%;
          width: 12px;
          height: 12px;
          transform: rotate(45deg);
          ${theme((o) => [o.bg.brand])}
        }
      `}
    >
      <div
        css={css`
          ${theme((o) => [o.typography(14).bold, o.font.text5])}
          white-space: pre-wrap;
        `}
      >
        {children}
      </div>
      <div
        css={css`
          display: grid;
          place-content: center;
          ${theme((o) => [o.margin.top(16)])}
        `}
      >
        <Button variant="Overlay" onClick={onConfirm}>
          わかった
        </Button>
      </div>
    </div>
  </div>
));
