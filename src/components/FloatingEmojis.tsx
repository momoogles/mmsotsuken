import { ComponentProps } from "react";
import { css, keyframes } from "styled-components";
import { Twemoji } from "./Emoji";

export const FloatingEmojis = ({
  floatingEmojis,
}: {
  floatingEmojis: {
    id: number;
    level: 1 | 2 | 3 | 4 | 5;
    emoji: string;
    duration: `${number}ms`;
    positionXPx: number;
  }[];
}) => {
  const maxLevelSize = 20;
  const emojiSize = (level: 1 | 2 | 3 | 4 | 5) =>
    level === 1 ? 12 : level === 2 ? 14 : level === 3 ? 16 : maxLevelSize;
  return (
    <span
      css={css`
        position: relative;
        z-index: 0;
        width: ${maxLevelSize}px;
        height: ${maxLevelSize}px;
      `}
    >
      {floatingEmojis.map(({ id, level, emoji, duration, positionXPx }) => (
        <span
          key={id}
          css={[
            css`
              position: absolute;
              display: inline-grid;
              place-content: center;
              opacity: 0;
            `,
            floatAnimationCss({
              duration,
              initXPx: positionXPx,
            }),
          ]}
        >
          <Twemoji emoji={emoji} size={emojiSize(level)} />
        </span>
      ))}
    </span>
  );
};

const floatAnimationCss = ({
  duration,
  initXPx,
}: {
  duration: `${number}ms`;
  initXPx: number;
}) => css`
  transform: translate(${initXPx}px, -100%);
  opacity: 0;
  animation: ${float({ initXPx })} ${duration} 0.1s ease-out forwards;
`;

const float = ({ initXPx }: { initXPx: number }) => keyframes`
  50% {
    opacity: 0.8;
  }
  100% {
    transform: translate(${initXPx}px, -600%);
    opacity: 0;
  }
`;

export function createFloatingEmoji({
  maxDurationMs,
}: {
  maxDurationMs: number;
}): Pick<
  ComponentProps<typeof FloatingEmojis>["floatingEmojis"][number],
  "duration" | "positionXPx"
> {
  const duration = `${Math.floor(
    (Math.random() * maxDurationMs) / 2 + maxDurationMs / 2
  )}ms` as const;
  const positionXDeviationPx = 8;
  const positionXPx = Math.floor(
    Math.random() * positionXDeviationPx * 2 - positionXDeviationPx
  );
  return { duration, positionXPx };
}
