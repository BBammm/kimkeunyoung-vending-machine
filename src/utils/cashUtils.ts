export const initialCash = {
  100: Number(import.meta.env.VITE_CASH_100 ?? 0),
  500: Number(import.meta.env.VITE_CASH_500 ?? 0),
  1000: Number(import.meta.env.VITE_CASH_1000 ?? 0),
  5000: Number(import.meta.env.VITE_CASH_5000 ?? 0),
  10000: Number(import.meta.env.VITE_CASH_10000 ?? 0),
} as const;

export const initialCard = Number(import.meta.env.VITE_CARD ?? 0);