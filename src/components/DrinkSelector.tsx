
import type { Drink } from '../types/vending';

interface Props {
  drinks: Drink[]
  selectedId: string | null
  onSelect: (id: string) => void
}

export function DrinkSelector({ drinks, selectedId, onSelect }: Props) {
  return (
    <div className="flex gap-4 justify-around bg-white py-5 rounded-2xl shadow-inner w-full">
      {drinks.map(drink => (
        <div
          key={drink.id}
          className={`flex flex-col items-center px-3 transition-all ${
            selectedId === drink.id ? 'scale-105' : ''
          } ${drink.stock === 0 && 'opacity-40 pointer-events-none'}`}
          onClick={() => onSelect(drink.id)}
          style={{ cursor: drink.stock > 0 ? 'pointer' : 'not-allowed' }}
        >
          <img
            src={drink.img}
            alt={drink.name}
            className="w-16 h-16 object-contain mb-2"
            draggable={false}
          />
          <div className="text-base font-bold text-gray-800 mb-1">{drink.name}</div>
          <div className="text-sm text-gray-600 mb-1">{drink.price.toLocaleString()}원</div>
          <div className="text-xs text-gray-400">
            {drink.stock > 0 ? `수량: ${drink.stock}` : '품절'}
          </div>
        </div>
      ))}
    </div>
  )
}