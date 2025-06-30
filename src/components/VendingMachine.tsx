import vendingCoke from '../assets/vending_coke.png'
import vendingWater from '../assets/vending_water.png'
import vendingCoffee from '../assets/vending_coffee.png'
import { useState } from 'react'
import { DrinkSelector } from './DrinkSelector'
import Payment from './Payment'
import type { CashUnit, Drink } from '../types/vending'

const drinks = [
  { id: 'coke', name: '콜라', price: 1100, stock: 2, img: vendingCoke },
  { id: 'water', name: '물', price: 600, stock: 5, img: vendingWater },
  { id: 'coffee', name: '커피', price: 700, stock: 3, img: vendingCoffee },
]

export default function VendingMachine() {
  // 1. 상품 선택, 결제 준비 등 state를 모두 여기서!
  const [paymentReady, setPaymentReady] = useState(false)
  const [payMethod, setPayMethod] = useState<'cash'|'card'|null>(null)
  const [cashInput, setCashInput] = useState<Record<CashUnit, number>>({
    100: 0, 500: 0, 1000: 0, 5000: 0, 10000: 0
  })

  // 2. 선택된 상품 정보
  const [drinksState, setDrinksState] = useState(drinks); // 재고 변화 관리
  const [cardHolding, setCardHolding] = useState(50000); // 카드 잔액(예시)
  
  const handleBuy = (drink: Drink) => {
    if (drink.stock <= 0) {
      alert('재고가 없습니다.');
      return;
    }
    if (payMethod === 'cash') {
      if (cashTotal < drink.price) {
        alert('투입 금액이 부족합니다.');
        return;
      }
      // 거스름돈 계산 및 안내
      const change = cashTotal - drink.price;
      if (change < 0) {
        alert('투입 금액이 부족합니다.');
        return;
      }
      // 100원, 500원 단위로만 반환
      if (change % 100 !== 0 && change % 500 !== 0) {
        alert('거스름돈은 100원/500원 단위만 반환됩니다.');
        return;
      }
      alert(`구매 완료! 거스름돈: ${change.toLocaleString()}원`);
      // 재고 차감
      setDrinksState(prev => prev.map(d =>
        d.id === drink.id ? { ...d, stock: d.stock - 1 } : d
      ));
      // 상태 리셋
      setCashInput({ 100: 0, 500: 0, 1000: 0, 5000: 0, 10000: 0 });
      setPaymentReady(false);
      setPayMethod(null);
      return;
    }
  
    if (payMethod === 'card') {
      // 잔액은 상관없음! 무조건 구매 가능
      setDrinksState(prev => prev.map(d =>
        d.id === drink.id ? { ...d, stock: d.stock - 1 } : d
      ));
      setCardHolding((prev) => prev - drink.price);
      alert('카드 결제 완료!');
      setPaymentReady(false);
      setPayMethod(null);
      return;
    }
  };

  const cashTotal = Object.entries(cashInput)
  .reduce((sum, [unit, count]) => sum + Number(unit) * Number(count), 0);

  console.log('paymentReady:', paymentReady);

  return (
    <div className="min-h-screen flex justify-center bg-white py-10 px-10">
      <div className="w-[720px] max-w-full py-10 px-8 rounded-[2.5rem] flex flex-col items-center bg-red-600 relative">
        <div className="mb-4 text-3xl font-extrabold tracking-tight text-white">Vending Machine</div>
        <DrinkSelector
          drinks={drinksState}
          paymentReady={paymentReady}
          onBuy={handleBuy}
          payMethod={payMethod}
          cashTotal={cashTotal}
        />
        <div className="w-full mt-4 p-8 bg-white rounded-2xl shadow-lg">
          <Payment
            onPaymentReady={setPaymentReady}
            paymentReady={paymentReady}
            payMethod={payMethod}
            setPayMethod={setPayMethod}
            cashInput={cashInput}
            setCashInput={setCashInput}
          />
        </div>
      </div>
    </div>
  )
}