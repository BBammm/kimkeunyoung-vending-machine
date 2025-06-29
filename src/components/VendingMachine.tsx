import vendingCoke from '../assets/vending_coke.png'
import vendingWater from '../assets/vending_water.png'
import vendingCoffee from '../assets/vending_coffee.png'
import { useState } from 'react'
import { DrinkSelector } from './DrinkSelector'

const drinks = [
  { id: 'coke', name: '콜라', price: 1100, stock: 2, img: vendingCoke },
  { id: 'water', name: '물', price: 600, stock: 5, img: vendingWater },
  { id: 'coffee', name: '커피', price: 700, stock: 3, img: vendingCoffee },
]

export default function VendingMachine() {
  const [selectedId, setSelectedId] = useState<string | null>(null)

  return (
    <div className="min-h-screen flex justify-center bg-white py-10 px-10">
      <div className="w-[480px] max-w-full py-10 px-8 rounded-[2.5rem] flex flex-col items-center bg-red-600 relative">
        {/* 상단 라벨/마크 */}
        <div className="mb-4 text-3xl font-extrabold tracking-tight text-white">Vending Machine</div>
        {/* 음료 가로 카드 (흰색 카드에 라운드/그림자) */}
        <DrinkSelector
          drinks={drinks}
          selectedId={selectedId}
          onSelect={setSelectedId}
        />
        {/* 결제 등 UI */}
        <div className="text-gray-400 text-xs mt-6">※ 결제, 알림 등 아래에 UI 추가</div>
      </div>
    </div>
  )
}