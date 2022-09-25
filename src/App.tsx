import styled, {
  createGlobalStyle,
  css,
  ThemeProvider,
} from "styled-components";
import { light, dark } from "@charcoal-ui/theme";
import { createTheme, TokenInjector, useMedia } from "@charcoal-ui/styled";
import { Twemoji } from "./components/Emoji";
import { maxWidth } from "@charcoal-ui/utils";
import { Aligner } from "./components/Aligner";
import { Prologue } from "./Prologue";
import { memo, useRef, useState } from "react";
import { unreachable } from "./utils/unreachable";
import { Epilogue } from "./Epilogue";
import { Main } from "./Main";
import { Step } from "./types";
import { emojis } from "./constants";
import { db } from "./api";
import { getUser } from "./api/getUser";
import { updateUser } from "./api/updateUser";
import { UserDocument } from "./api/types";

const theme = createTheme(styled);

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0px;
    ${theme((o) => [
      o.bg.background1,
      o.font.text2,
      o.typography(16).preserveHalfLeading,
    ])}
  }

  a {
    ${theme((o) => [o.font.link1])}
  }
`;

export const App = () => {
  const isDark = useMedia("(prefers-color-scheme: dark)");

  return (
    <ThemeProvider theme={isDark ? dark : light}>
      <Contents />
      <GlobalStyle />
      <TokenInjector theme={{ ":root": isDark ? dark : light }} />
    </ThemeProvider>
  );
};

const Contents = () => {
  const bodyRef = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState<Step>("prologue");
  const [sessionGroup, setSessionGroup] =
    useState<UserDocument["group"]>("plain");
  const [sessionUid, setSessionUid] = useState<string | undefined>(undefined);

  const resetScrollTop = () =>
    bodyRef.current?.scrollIntoView({ behavior: "smooth" });

  const handleNext = (s: Step) => {
    setStep(s);
    resetScrollTop();
  };

  return (
    <div
      css={css`
        display: grid;
        grid-template-rows: auto 1fr auto;
        min-height: 100vh;
        min-height: 100lvh;
      `}
    >
      <header
        css={css`
          ${theme((o) => [o.border.default.bottom])}
        `}
      >
        <Aligner>
          <Header uid={sessionUid} />
        </Aligner>
      </header>
      <div
        ref={bodyRef}
        css={[
          css`
            height: 100%;
            display: grid;
            grid-auto-rows: 1fr;
          `,
          (step === 1 || step === 2 || step === 3 || step === 4) &&
            css`
              ${theme((o) => [o.bg.background2])}
            `,
        ]}
      >
        <Aligner>
          {step === "prologue" ? (
            <Prologue
              onNext={async ({ uid, step }) => {
                try {
                  const data = await getUser(db, { id: uid });
                  if (data === null) {
                    throw new Error();
                  }
                  setSessionGroup(data.group);
                  setSessionUid(uid);
                  return handleNext(data.locked ? "epilogue" : step);
                } catch {
                  return handleNext(step);
                }
              }}
            />
          ) : step === 1 || step === 2 || step === 3 || step === 4 ? (
            <Main
              step={step}
              onNext={handleNext}
              onEnd={async ({ step, reactions }) => {
                try {
                  if (sessionUid !== undefined) {
                    await updateUser(db, {
                      id: sessionUid,
                      newDocument: {
                        group: sessionGroup,
                        locked: true,
                        reactions,
                      },
                    });
                  }
                } finally {
                  handleNext(step);
                }
              }}
            />
          ) : step === "epilogue" ? (
            <Epilogue uid={sessionUid} />
          ) : (
            unreachable(step)
          )}
        </Aligner>
      </div>
      <footer
        css={css`
          ${theme((o) => [o.border.default.top, o.bg.background2])}
        `}
      >
        <Aligner>
          <Footer />
        </Aligner>
      </footer>
    </div>
  );
};

const Header = memo(({ uid }: { uid?: string }) => (
  <div
    css={css`
      display: grid;
      grid-template-columns: auto 1fr;
      align-items: center;
      ${theme((o) => [o.height.px(64)])}
    `}
  >
    <div
      css={css`
        display: grid;
        grid-auto-flow: column;
        gap: 8px;
      `}
    >
      {emojis.map((v) => (
        <Twemoji key={v} size={24} emoji={v} />
      ))}
    </div>
    <div
      css={css`
        display: grid;
        place-content: end;
      `}
    >
      <span
        css={css`
          ${theme((o) => [o.typography(14).bold])}
        `}
      >
        {uid && `ID: ${uid}`}
      </span>
    </div>
  </div>
));

const Footer = memo(() => (
  <div
    css={css`
      display: grid;
      place-content: center;
      ${theme((o) => [o.height.px(40), o.bg.background2])}
      grid-template-columns: auto 1fr auto;
      grid-template-rows: auto;
      @media ${(p) => maxWidth(p.theme.breakpoint.screen2)} {
        ${theme((o) => [o.height.auto, o.padding.vertical(16)])}
        grid-template-columns: auto;
        grid-template-rows: auto min-content auto;
      }
    `}
  >
    <small>@ 2022 momoogles</small>
    <div />
    <small>
      All emojis designed by
      <span> </span>
      <a href="https://twemoji.twitter.com/" target="_blank" rel="noopener">
        Twemoji
      </a>
      <span>. License:</span>
      <span> </span>
      <a
        href="https://creativecommons.org/licenses/by-sa/4.0/#"
        target="_blank"
        rel="noopener"
      >
        CC BY-SA 4.0
      </a>
    </small>
  </div>
));
