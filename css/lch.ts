import { LCH } from "../spaces/LCH";
import { ColorSpace } from "../color-spaces";
import { beautifyNumber } from "./utils";

// lch(l c h / a)
// l is a percentage from 0 to Infinity
// c and h are unbounded numbers
// we do not process alpha values
export const parse = (color: string): LCH | null => {
  const parsed = color.match(/-?[\d.%?]+/g);
  if (parsed === null || parsed.length < 3) {
    return null;
  }
  const [l, c, h] = parsed.map(Number.parseFloat);
  return { type: ColorSpace.LCH, values: [l, c, h] };
};

export const stringify = (color: LCH, alpha?: string): string => {
  const [L, C, H] = color.values.map(
    (value: number, index: number) =>
      `${beautifyNumber(value, index === 0 ? 2 : 4)}${index === 0 ? "%" : ""}`
  );
  return `lch(${L} ${C} ${H}${alpha ? ` / ${alpha}` : ""})`;
};
