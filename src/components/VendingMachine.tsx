import vendingCoke from '../assets/vending_coke.png'
import vendingWater from '../assets/vending_water.png'
import vendingCoffee from '../assets/vending_coffee.png'
import { useEffect } from 'react'
import { DrinkSelector } from './DrinkSelector'
import Payment from './Payment'
import { useVendingStore} from '../store/vendingStore'
import type { Drink } from '../types/vending'
import { toast } from 'react-toastify'

const drinksSeed = [
  { id: 'coke', name: '콜라', price: 1100, stock: 2, img: vendingCoke },
  { id: 'water', name: '물', price: 600, stock: 5, img: vendingWater },
  { id: 'coffee', name: '커피', price: 700, stock: 3, img: vendingCoffee },
]

export default function VendingMachine() {
  const { drinks, setDrinks, buyDrink, paymentReady, payMethod, cashInput } = useVendingStore()
  useEffect(() => {
    setDrinks(drinksSeed)
  }, [setDrinks])

  // 현금 투입 합계
  const cashTotal = Object.entries(cashInput).reduce(
    (sum, [unit, count]) => sum + Number(unit) * Number(count), 0
  )

  const handleBuy = (drink: Drink) => {
    const result = buyDrink(drink.id)
    if (result) toast[result.type](result.message)
  }

  return (
    <div className="min-h-screen flex justify-center bg-white py-10 px-10">
      <div className="w-[720px] max-w-full py-10 px-8 rounded-[2.5rem] flex flex-col items-center bg-red-600 relative">
        <div className="mb-4 text-3xl font-extrabold tracking-tight text-white">Vending Machine</div>
        <DrinkSelector
          drinks={drinks}
          paymentReady={paymentReady}
          onBuy={handleBuy}
          payMethod={payMethod}
          cashTotal={cashTotal}
        />
        <div className="w-full mt-4 p-8 bg-white rounded-2xl shadow-lg">
          <Payment />
        </div>
      </div>
    </div>
  )
}