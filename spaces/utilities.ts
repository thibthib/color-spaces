import { Color } from "../color";

export const applyMatrix = (
  colorValues: [number, number, number],
  matrix: number[][]
): [number, number, number] => {
  const result = matrix.map((row) =>
    row.reduce((a, c, i) => a + c * (colorValues[i] || 0), 0)
  );
  return [result[0], result[1], result[2]];
};

export const updateValues = <C extends Color>(
  color: C,
  transform: (value: number) => number
): C => ({
  ...color,
  values: color.values.map(transform),
});
