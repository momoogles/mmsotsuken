import { css } from "styled-components";
import twemoji from "twemoji";

export const Twemoji = ({ emoji, size }: { emoji: string; size: number }) => {
  return (
    <span
      css={css`
        display: inline-flex;
        vertical-align: top;
        > img {
          width: ${size}px;
          height: ${size}px;
        }
      `}
      dangerouslySetInnerHTML={{
        __html: twemoji.parse(emoji, {
          folder: "svg",
          ext: ".svg",
        }),
      }}
    />
  );
};
