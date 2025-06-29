import { useVendingStore } from '../store/vendingStore'
import { useState } from 'react'

// CashUnit type 재사용
const units = [100, 500, 1000, 5000, 10000] as const
type CashUnit = typeof units[number]

export default function Payment() {
  const { cash: cashHoldings, card: cardHolding } = useVendingStore()
  // cashInput: {100: 0, ...}
  const [cashInput, setCashInput] = useState<Record<CashUnit, number>>({
    100: 0, 500: 0, 1000: 0, 5000: 0, 10000: 0
  })
  const [payMethod, setPayMethod] = useState<'cash' | 'card' | null>(null)

  // 투입합계 계산
  const cashTotal = units.reduce((sum, unit) => sum + unit * cashInput[unit], 0)

  // 버튼 증감 핸들러
  const handleIncrement = (unit: CashUnit) => {
    if (cashInput[unit] < cashHoldings[unit]) {
      setCashInput(prev => ({ ...prev, [unit]: prev[unit] + 1 }))
      setPayMethod('cash')
    }
  }
  const handleDecrement = (unit: CashUnit) => {
    if (cashInput[unit] > 0) {
      setCashInput(prev => ({ ...prev, [unit]: prev[unit] - 1 }))
      setPayMethod('cash')
    }
  }

  // 카드 버튼 클릭
  const handleCard = () => {
    setPayMethod('card')
    // 현금 수량 리셋
    setCashInput({ 100: 0, 500: 0, 1000: 0, 5000: 0, 10000: 0 })
  }

  // 현금 조작시 카드 비활성, 카드 클릭시 현금입력 비활성
  const cashDisabled = payMethod === 'card'
  const cardDisabled = payMethod === 'cash' && cashTotal > 0

  return (
    <div className="rounded-xl p-5 flex flex-col gap-5 mt-8">
      {/* 현금 영역 */}
      <div className="mb-2">
        <div className="font-bold text-gray-800 mb-2">현금 투입</div>
        <div className="flex gap-8 justify-center mt-2 mb-3">
          {units.map(unit => (
            <div key={unit} className="flex flex-col items-center">
              <span className="font-bold text-gray-700 mb-2">{unit.toLocaleString()}원</span>
              <div className="w-20 h-30 bg-gray-100 rounded-xl shadow flex flex-col justify-between items-center py-2">
                <button
                  className="w-6 h-6 flex items-center justify-center bg-gray-200 rounded-full text-lg font-bold hover:bg-red-200 disabled:opacity-40"
                  onClick={() => handleIncrement(unit)}
                  disabled={cashDisabled || cashInput[unit] >= cashHoldings[unit]}
                >▲</button>
                <span className="text-2xl font-mono text-gray-600">{cashInput[unit]}</span>
                <button
                  className="w-6 h-6 flex items-center justify-center bg-gray-200 rounded-full text-lg font-bold hover:bg-red-200 disabled:opacity-40"
                  onClick={() => handleDecrement(unit)}
                  disabled={cashDisabled || cashInput[unit] === 0}
                >▼</button>
              </div>
              <span className="text-xs text-gray-500 mt-1">{cashHoldings[unit]}장 보유</span>
            </div>
          ))}
        </div>
        <div className="mt-2 flex justify-end items-center gap-4">
          <span className="text-base font-semibold text-red-600">
            투입합계: {cashTotal.toLocaleString()}원
          </span>
          <button
            className="ml-2 px-4 py-1 rounded bg-gray-300 hover:bg-gray-400 text-white font-semibold shadow"
            onClick={() => setCashInput({ 100: 0, 500: 0, 1000: 0, 5000: 0, 10000: 0 })}
            disabled={cashDisabled && cashTotal === 0}
            type="button"
          >
            초기화
          </button>
        </div>
      </div>

      {/* 카드 영역 */}
      <div>
        <div className="font-bold text-gray-800 mb-2">카드 결제</div>
        <button
          className={`px-8 py-2 bg-blue-500 text-white font-bold rounded-xl shadow
            ${cardDisabled ? 'opacity-40 cursor-not-allowed' : 'hover:bg-blue-600'}`}
          onClick={handleCard}
          disabled={cardDisabled}
        >카드 투입</button>
        <span className="ml-3 text-gray-500 text-sm">보유잔액: {cardHolding.toLocaleString()}원</span>
      </div>
    </div>
  )
}