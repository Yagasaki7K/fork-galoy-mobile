import { DataStoreModel, DataStore, FiatAccount, FiatAccountModel, CryptoAccountModel, CryptoAccount, Rates, RatesModel } from "./data-store"
import { defaultDataStore } from "../root-store/default-state"
import { AccountType } from "../../screens/accounts-screen/AccountType"
import { CurrencyType } from "./CurrencyType"

test("can be created", () => {
  const instance: DataStore = DataStoreModel.create({})

  expect(instance).toBeTruthy()
})


test("fiat accounts have balance and currency", () => {
  const instance: FiatAccount = FiatAccountModel.create({balance: 100})
  
  expect(instance.type).toBe(AccountType.Checking)
  expect(instance.currency).toBe(CurrencyType.USD)
  expect(instance.balance).toBe(100)
})

test("btc accounts have balance and currency", () => {
  const instance: CryptoAccount = CryptoAccountModel.create({balance: 100})
  
  expect(instance.type).toBe(AccountType.Bitcoin)
  expect(instance.currency).toBe(CurrencyType.BTC)
  expect(instance.balance).toBe(100)
})


test("rates returns value with last_price", () => {
  const instance: Rates = RatesModel.create({})
  
  expect(instance[CurrencyType.USD]).toBe(1)
  expect(instance[CurrencyType.BTC]).toBe(0.0001)
})


test("default state can be instanciate", () => {
  const instance: DataStore = DataStoreModel.create(defaultDataStore)

  expect(instance.accounts).toHaveLength(3)
  expect(instance.total_usd_balance).toBe(1854.5674)
  expect(instance.usd_balances).toEqual(
      { Checking: 1245.12, Bitcoin: 609.4474, Saving: 0 }
  )

})