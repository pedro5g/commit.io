export const ExitCode = {
  FAILURE: 1,
  SUCCESS: 0,
} as const;

export type ExitCodeType = keyof typeof ExitCode;
