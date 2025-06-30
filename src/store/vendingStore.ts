import { create } from 'zustand'
import type { CashUnit, Drink } from '../types/vending'
import { initialCash, initialCard } from '../utils/cashUtils'

type BuyDrinkResult = { type: 'success' | 'error' | 'warn', message: string } | null
type VendingState = {
  drinks: Drink[]
  cash: Record<CashUnit, number>
  card: number
  cashInput: Record<CashUnit, number>
  payMethod: 'cash' | 'card' | null
  paymentReady: boolean
  
  // 액션
  reset: (initCash: Record<CashUnit, number>, initCard: number) => void
  setPayMethod: (method: 'cash' | 'card' | null) => void
  setPaymentReady: (ready: boolean) => void
  setCashInput: (unit: CashUnit, count: number) => void
  resetInput: () => void
  resetAll: () => void

  buyDrink: (drinkId: string) => BuyDrinkResult
  setDrinks: (drinks: Drink[]) => void
}

export const useVendingStore = create<VendingState>((set, get) => ({
  drinks: [],
  cash: { ...initialCash },
  card: initialCard,
  cashInput: { 100: 0, 500: 0, 1000: 0, 5000: 0, 10000: 0 },
  payMethod: null,
  paymentReady: false,

  reset: (initCash, initCard) => set(() => ({
    cash: { ...initCash },
    card: initCard
  })),
  setPayMethod: (method) => set({ payMethod: method }),
  setPaymentReady: (ready) => set({ paymentReady: ready }),
  setCashInput: (unit, count) =>
    set((state) => ({
      cashInput: { ...state.cashInput, [unit]: count }
    })),
  resetInput: () =>
    set({
      cashInput: { 100: 0, 500: 0, 1000: 0, 5000: 0, 10000: 0 },
    }),
  resetAll: () =>
    set({
      cash: { ...initialCash },
      card: initialCard,
      cashInput: { 100: 0, 500: 0, 1000: 0, 5000: 0, 10000: 0 },
      payMethod: null,
      paymentReady: false,
      drinks: get().drinks, // drinks 유지
    }),

  setDrinks: (drinks) => set({ drinks }),

  buyDrink: (drinkId): BuyDrinkResult => {
    const state = get()
    const drink = state.drinks.find(d => d.id === drinkId)
    if (!drink || drink.stock <= 0)
      return { type: 'error', message: '재고가 없습니다.' }

    // 현금 결제
    if (state.payMethod === 'cash') {
      const cashTotal = Object.entries(state.cashInput).reduce(
        (sum, [unit, count]) => sum + Number(unit) * Number(count), 0
      )
      if (cashTotal < drink.price)
        return { type: 'error', message: '투입 금액이 부족합니다.' }

      // (1) 투입 금액만큼 현금 차감
      const units: CashUnit[] = [100, 500, 1000, 5000, 10000];
      let newCash = { ...state.cash }
      units.forEach(unit => {
        newCash[unit] -= state.cashInput[unit];
      });

      // (2) 거스름돈 계산
      let change = cashTotal - drink.price
      if (change < 0)
        return { type: 'error', message: '투입 금액이 부족합니다.' }
      if (change > 0 && change % 100 !== 0 && change % 500 !== 0)
        return { type: 'warn', message: '거스름돈은 100원/500원 단위만 반환됩니다.' }

      // (3) 거스름돈 지급 (100/500원 단위)
      const changeUnits: CashUnit[] = [500, 100]
      const changeGiven: Record<CashUnit, number> = { 100: 0, 500: 0, 1000: 0, 5000: 0, 10000: 0 }
      let remain = change
      for (const unit of changeUnits) {
        let cnt = Math.floor(remain / unit)
        if (cnt > 0) {
          changeGiven[unit] = cnt
          newCash[unit] += cnt
          remain -= unit * cnt
        }
      }

      // (4) 현금 보유량 업데이트, 재고 차감 등
      set({
        cash: newCash,
        drinks: state.drinks.map(d => d.id === drink.id ? { ...d, stock: d.stock - 1 } : d),
        cashInput: { 100: 0, 500: 0, 1000: 0, 5000: 0, 10000: 0 },
        payMethod: null,
        paymentReady: false,
      })

      const changeMsg =
        Object.entries(changeGiven)
          .filter(([u, v]) => v > 0)
          .map(([u, v]) => `${u}원:${v}개`)
          .join(', ') || '없음'

      return { type: 'success', message: `구매 완료! 거스름돈: ${changeMsg}` }
    }

    // 카드 결제
    if (state.payMethod === 'card') {
      if (state.card < drink.price)
        return { type: 'error', message: '카드 잔액이 부족합니다.' }
      set({
        drinks: state.drinks.map(d => d.id === drink.id ? { ...d, stock: d.stock - 1 } : d),
        card: state.card - drink.price,
        cashInput: { 100: 0, 500: 0, 1000: 0, 5000: 0, 10000: 0 },
        payMethod: null,
        paymentReady: false,
      })
      return { type: 'success', message: '카드 결제 완료!' }
    }

    return null
  },
}))