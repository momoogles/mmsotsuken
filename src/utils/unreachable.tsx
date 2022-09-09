export const unreachable = (v: never) => {
  throw new Error(v);
};
