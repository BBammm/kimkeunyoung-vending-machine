import './App.css'
import './index.css'
import VendingMachine from './components/VendingMachine'
import Payment from './components/Payment'
import { useEffect } from 'react'
import { useVendingStore } from './store/vendingStore'
import { initialCash, initialCard } from './utils/cashUtils'

function App() {
  const reset = useVendingStore(s => s.reset)
  useEffect(() => {
    reset(initialCash, initialCard)
  }, [reset])
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <div className="w-[640px] max-w-full p-10 bg-white rounded-3xl shadow-2xl mb-8">
        <VendingMachine/>
      </div>
      <div className="w-[720px] max-w-full p-8 bg-white rounded-2xl shadow-lg">
        <Payment/>
      </div>
    </div>
  )
}
export default App