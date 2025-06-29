import { create } from 'zustand'

type CashUnit = 100 | 500 | 1000 | 5000 | 10000

type VendingState = {
  cash: Record<CashUnit, number> // 권종별 보유 장수
  card: number                   // 카드 잔액(원)
  // 초기화(리셋) 함수도 같이 제공
  setCash: (unit: CashUnit, count: number) => void
  setCard: (amount: number) => void
  reset: (initCash: Record<CashUnit, number>, initCard: number) => void
}

export const useVendingStore = create<VendingState>((set) => ({
  cash: { 100: 0, 500: 0, 1000: 0, 5000: 0, 10000: 0 },
  card: 0,
  setCash: (unit, count) =>
    set((state) => ({
      cash: { ...state.cash, [unit]: count }
    })),
  setCard: (amount) => set(() => ({ card: amount })),
  reset: (initCash, initCard) => set(() => ({
    cash: { ...initCash },
    card: initCard
  }))
}))