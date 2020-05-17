import { Lab } from "../spaces/Lab";
import { ColorSpace } from "../color-spaces";

// lab(l a b / a)
// l is a percentage from 0 to Infinity
// a and b are unbounded numbers
// we do not process alpha values
export const parse = (color: string): Lab | null => {
  const parsed = color.match(/-?[\d.%?]+/g);
  if (parsed === null || parsed.length < 3) {
    return null;
  }
  const [L, a, b] = parsed.map(Number.parseFloat);
  return { type: ColorSpace.Lab, values: [L, a, b] };
};

export const stringify = (color: Lab, alpha?: string): string => {
  const [L, a, b] = color.values.map(
    (value: number, index: number) =>
      `${value.toFixed(index === 0 ? 2 : 4)}${index === 0 ? "%" : ""}`
  );
  return `lab(${L} ${a} ${b}${alpha ? ` / ${alpha}` : ""})`;
};
