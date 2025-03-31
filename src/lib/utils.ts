export function parseDuration(durationStr: string): number {
  const regex = /^(\d+)(ms|s|m|h)$/;
  const res = durationStr.match(regex);
  if (!res || res.length !== 3) {
    return NaN;
  }
  const val = parseInt(res[1]);
  const unit = res[2];
  switch (unit) {
    case "ms":
      return val;
    case "s":
      return val * 1000;
    case "m":
      return val * 60 * 1000;
    case "h":
      return val * 60 * 60 * 1000;
    default:
      return NaN;
  }
}

export function handleError(e: unknown) {
  console.error("Error: ", `${e instanceof Error ? e.message : e}`);
}
