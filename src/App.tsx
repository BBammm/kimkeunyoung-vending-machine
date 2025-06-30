import './App.css'
import './index.css'
import VendingMachine from './components/VendingMachine'
import { useEffect } from 'react'
import { useVendingStore } from './store/vendingStore'
import { initialCash, initialCard } from './utils/cashUtils'

function App() {
  const reset = useVendingStore(s => s.reset)
  useEffect(() => {
    // 앱이 마운트될 때만 한번만 초기화
    reset(initialCash, initialCard)
  }, [reset])
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <div className="w-[720px] max-w-full p-10 bg-white rounded-3xl shadow-2xl mb-8">
        <VendingMachine/>
      </div>
    </div>
  )
}

export default App