// src/utils/vendingUtils.ts
import { type CashUnit, type Drink } from '../types/vending';

// 음료 재고 확인
export function isDrinkInStock(drink: Drink) {
  return drink.stock > 0;
}

// 투입 금액 비교
export function isEnoughMoney(input: number, price: number) {
  return input >= price;
}

// 잔돈 계산
export function calcChange(input: number, price: number, changeStore: Record<CashUnit, number>) {
  let change = input - price;
  let result: Record<CashUnit, number> = { 10000: 0, 5000: 0, 1000: 0, 500: 0, 100: 0 };

  for (const unit of [10000, 5000, 1000, 500, 100] as CashUnit[]) {
    while (change >= unit && changeStore[unit] > 0) {
      result[unit]++;
      changeStore[unit]--;
      change -= unit;
    }
  }
  // 잔돈을 다 주지 못하는 경우
  if (change > 0) return null;
  return result;
}

// 카드 결제 성공 여부 (예시: 90% 확률 성공)
export function mockCardPayment() {
  return Math.random() > 0.1;
}