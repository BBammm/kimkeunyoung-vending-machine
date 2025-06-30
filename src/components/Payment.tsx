import { useVendingStore } from '../store/vendingStore'

const units = [100, 500, 1000, 5000, 10000] as const
type CashUnit = typeof units[number]

export default function Payment() {
  const {
    cash, card, cashInput, payMethod, paymentReady,
    setPayMethod, setPaymentReady, setCashInput, resetInput, resetAll
  } = useVendingStore()

  const cashTotal = units.reduce((sum, unit) => sum + unit * cashInput[unit], 0)

  const handleIncrement = (unit: CashUnit) => {
    if (cashInput[unit] < cash[unit]) {
      setCashInput(unit, cashInput[unit] + 1)
      setPayMethod('cash')
      setPaymentReady(false)
    }
  }
  const handleDecrement = (unit: CashUnit) => {
    if (cashInput[unit] > 0) {
      setCashInput(unit, cashInput[unit] - 1)
      setPayMethod('cash')
      setPaymentReady(false)
    }
  }
  const handleCashReady = () => {
    if (cashTotal > 0) {
      setPayMethod('cash')
      setPaymentReady(true)
    }
  }
  const handleCardReady = () => {
    setPayMethod('card')
    resetInput()
    setPaymentReady(true)
  }

  const cashDisabled = payMethod === 'card'
  const cardDisabled = payMethod === 'cash' && cashTotal > 0

  return (
    <div className="rounded-xl flex flex-col gap-5">
      {/* 전체 결제 초기화 */}
      <div className="flex justify-end mb-4">
        <button
          className="px-3 py-2 text-sm rounded bg-red-600 hover:bg-red-700 text-white font-bold shadow"
          onClick={resetAll}
          type="button"
        >
          결제 초기화
        </button>
      </div>
      <div className="font-bold text-gray-800 mb-2">현금 투입</div>
      <div className="flex gap-8 justify-center mt-2 mb-3">
        {units.map(unit => (
          <div key={unit} className="flex flex-col items-center">
            <span className="font-bold text-xs text-gray-700 mb-2">{unit.toLocaleString()}원</span>
            <div className="w-10 h-30 bg-gray-100 rounded-xl shadow flex flex-col justify-between items-center py-2">
              <button
                className="w-5 h-5 flex items-center justify-center bg-gray-500 rounded-full text-xs font-bold hover:bg-gray-800 disabled:opacity-40"
                onClick={() => handleIncrement(unit)}
                disabled={cashDisabled || cashInput[unit] >= cash[unit]}
                type="button"
              >▲</button>
              <span className="text-2xl font-mono text-gray-600">{cashInput[unit]}</span>
              <button
                className="w-5 h-5 flex items-center justify-center bg-gray-500 rounded-full text-xs font-bold hover:bg-gray-800 disabled:opacity-40"
                onClick={() => handleDecrement(unit)}
                disabled={cashDisabled || cashInput[unit] === 0}
                type="button"
              >▼</button>
            </div>
            <span className="text-xs text-gray-500 mt-1">{cash[unit]}장 보유</span>
          </div>
        ))}
      </div>
      <div className="mt-2 flex justify-end items-center gap-4">
        <span className="text-base font-semibold text-red-600">
          투입합계: {cashTotal.toLocaleString()}원
        </span>
        <button
          className="ml-2 px-4 py-1 rounded bg-green-500 hover:bg-green-600 text-white font-semibold shadow"
          onClick={handleCashReady}
          disabled={cashDisabled || cashTotal === 0 || paymentReady}
          type="button"
        >
          현금 투입
        </button>
      </div>
      <div>
        <div className="font-bold text-gray-800 mb-2">카드 결제</div>
        <button
          className={`px-8 py-2 bg-blue-500 text-white font-bold rounded-xl shadow
            ${cardDisabled ? 'opacity-40 cursor-not-allowed' : 'hover:bg-blue-600'}`}
          onClick={handleCardReady}
          disabled={cardDisabled || paymentReady}
          type="button"
        >카드 결제</button>
        <span className="ml-3 text-gray-500 text-sm">보유잔액: {card.toLocaleString()}원</span>
      </div>
    </div>
  )
}