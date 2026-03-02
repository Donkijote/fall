export const clamp = (value: number, min: number, max: number): number => {
  return Math.min(max, Math.max(min, value));
};

export const px = (value: number): number => {
  return Math.round(value);
};

export const formatControlValue = (value: number, step: number): string => {
  if (step >= 1) {
    return String(Math.round(value));
  }

  return value.toFixed(2).replace(/\.?0+$/, "");
};
