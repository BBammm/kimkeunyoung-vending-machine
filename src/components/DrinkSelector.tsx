import type { Drink } from "../types/vending"

interface Props {
  drinks: Drink[]
  paymentReady: boolean
  onBuy: (drink: Drink) => void
  payMethod: 'cash' | 'card' | null
  cashTotal: number
}

export function DrinkSelector({
  drinks, paymentReady, onBuy, payMethod, cashTotal
}: Props) {
  return (
    <div className="flex gap-4 justify-around bg-white py-5 rounded-2xl shadow-inner w-full">
      {drinks.map(drink => {
        let canBuy = false
        if (paymentReady && drink.stock > 0) {
          if (payMethod === 'cash' && cashTotal >= drink.price) canBuy = true
          if (payMethod === 'card') canBuy = true
        }
        return (
          <div key={drink.id} className={`flex flex-col items-center px-3 transition-all ${drink.stock === 0 && 'opacity-40 pointer-events-none'}`}>
            <img src={drink.img} alt={drink.name} className="w-16 h-16 object-contain mb-2" draggable={false} />
            <div className="text-base font-bold text-gray-800 mb-1">{drink.name}</div>
            <div className="text-sm text-gray-600 mb-1">{drink.price.toLocaleString()}원</div>
            <div className="text-xs text-gray-400">
              {drink.stock > 0 ? `수량: ${drink.stock}` : '품절'}
            </div>
            <button
              className={`
                mt-3 px-3 py-1 rounded-xl text-sm font-bold shadow
                ${canBuy
                  ? 'bg-gray-600 hover:bg-gray-800 text-white'
                  : 'bg-gray-300 text-gray-400 cursor-not-allowed'
                }
              `}
              onClick={() => canBuy && onBuy(drink)}
              type="button"
              disabled={!canBuy}
            >
              구매
            </button>
          </div>
        )
      })}
    </div>
  )
}