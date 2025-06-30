import { useVendingStore } from '../store/vendingStore'

const units = [100, 500, 1000, 5000, 10000] as const
type CashUnit = typeof units[number]

export default function Payment({
  onPaymentReady,
  paymentReady,
  payMethod,
  setPayMethod,
  cashInput,
  setCashInput,
}: {
  onPaymentReady: (ready: boolean) => void
  paymentReady: boolean
  payMethod: 'cash' | 'card' | null
  setPayMethod: (method: 'cash' | 'card' | null) => void
  cashInput: Record<CashUnit, number>
  setCashInput: React.Dispatch<React.SetStateAction<Record<CashUnit, number>>>
}) {
  const { cash: cashHoldings, card: cardHolding } = useVendingStore()

  // 투입합계 계산
  const cashTotal = units.reduce((sum, unit) => sum + unit * cashInput[unit], 0)

  // 권종 증감
  const handleIncrement = (unit: CashUnit) => {
    if (cashInput[unit] < cashHoldings[unit]) {
      setCashInput(prev => ({ ...prev, [unit]: prev[unit] + 1 }))
      setPayMethod('cash')
      onPaymentReady(false) // 아직 결제 준비 상태 아님
    }
  }
  const handleDecrement = (unit: CashUnit) => {
    if (cashInput[unit] > 0) {
      setCashInput(prev => ({ ...prev, [unit]: prev[unit] - 1 }))
      setPayMethod('cash')
      onPaymentReady(false)
    }
  }

  // 현금 투입 버튼 클릭: 결제 준비
  const handleCashReady = () => {
    if (cashTotal > 0) {
      setPayMethod('cash')
      onPaymentReady(true)
    }
  }

  // 현금 입력 초기화
  const handleCashReset = () => {
    setCashInput({ 100: 0, 500: 0, 1000: 0, 5000: 0, 10000: 0 })
    setPayMethod(null)
    onPaymentReady(false)
  }

  // 카드 결제 준비
  const handleCardReady = () => {
    setPayMethod('card')
    setCashInput({ 100: 0, 500: 0, 1000: 0, 5000: 0, 10000: 0 })
    onPaymentReady(true)
  }

  // 각 방식 비활성화
  const cashDisabled = payMethod === 'card'
  const cardDisabled = payMethod === 'cash' && cashTotal > 0

  return (
    <div className="rounded-xl flex flex-col gap-5 mt-8">
      {/* 현금 영역 */}
      <div className="mb-2">
        <div className="font-bold text-gray-800 mb-2">현금 투입</div>
        <div className="flex gap-8 justify-center mt-2 mb-3">
          {units.map(unit => (
            <div key={unit} className="flex flex-col items-center">
              <span className="font-bold text-xs text-gray-700 mb-2">{unit.toLocaleString()}원</span>
              <div className="w-10 h-30 bg-gray-100 rounded-xl shadow flex flex-col justify-between items-center py-2">
                <button
                  className="w-2 h-2 flex items-center justify-center bg-gray-200 rounded-full text-xs font-bold hover:bg-red-200 disabled:opacity-40"
                  onClick={() => handleIncrement(unit)}
                  disabled={cashDisabled || cashInput[unit] >= cashHoldings[unit]}
                  type="button"
                >▲</button>
                <span className="text-2xl font-mono text-gray-600">{cashInput[unit]}</span>
                <button
                  className="w-2 h-2 flex items-center justify-center bg-gray-200 rounded-full text-xs font-bold hover:bg-red-200 disabled:opacity-40"
                  onClick={() => handleDecrement(unit)}
                  disabled={cashDisabled || cashInput[unit] === 0}
                  type="button"
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
            onClick={handleCashReset}
            disabled={cashDisabled && cashTotal === 0}
            type="button"
          >
            초기화
          </button>
          <button
            className="ml-2 px-4 py-1 rounded bg-green-500 hover:bg-green-600 text-white font-semibold shadow"
            onClick={handleCashReady}
            disabled={cashDisabled || cashTotal === 0 || paymentReady}
            type="button"
          >
            현금 투입
          </button>
        </div>
      </div>

      {/* 카드 영역 */}
      <div>
        <div className="font-bold text-gray-800 mb-2">카드 결제</div>
        <button
          className={`px-8 py-2 bg-blue-500 text-white font-bold rounded-xl shadow
            ${cardDisabled ? 'opacity-40 cursor-not-allowed' : 'hover:bg-blue-600'}`}
          onClick={handleCardReady}
          disabled={cardDisabled || paymentReady}
          type="button"
        >카드 결제</button>
        <span className="ml-3 text-gray-500 text-sm">보유잔액: {cardHolding.toLocaleString()}원</span>
      </div>
    </div>
  )
}