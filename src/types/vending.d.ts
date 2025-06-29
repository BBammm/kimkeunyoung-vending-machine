export type Drink = {
  id: string;
  name: string;
  price: number;
  stock: number;
  img?: any;
};

export type PaymentType = 'cash' | 'card';

export type CashUnit = 100 | 500 | 1000 | 5000 | 10000;

export type VendingState =
  | 'selecting-drink'
  | 'selecting-payment'
  | 'input-cash'
  | 'input-card'
  | 'processing'
  | 'dispensing'
  | 'change-return'
  | 'completed'
  | 'error';

export type VendingError =
  | 'OUT_OF_STOCK'
  | 'NOT_ENOUGH_MONEY'
  | 'CARD_FAIL'
  | 'NO_CHANGE'
  | 'UNKNOWN';