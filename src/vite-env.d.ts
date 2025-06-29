/// <reference types="vite/client" />
interface ImportMetaEnv {
  readonly VITE_CASH_100: string
  readonly VITE_CASH_500: string
  readonly VITE_CASH_1000: string
  readonly VITE_CASH_5000: string
  readonly VITE_CASH_10000: string
  readonly VITE_CARD: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}