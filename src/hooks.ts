import { AsyncLocalStorage } from "node:async_hooks";
import { StoreTransaction } from "./store";
import { HookType } from "./typings/store";

const stores: AsyncLocalStorage<StoreTransaction | undefined>[] = []

export const addStoreToHooks = (store: AsyncLocalStorage<StoreTransaction | undefined>) => {
  stores.push(store)
}

export const runOnTransactionCommit = (callback: HookType) => {
  stores.forEach((store) => store.getStore()?.onCommit.push(callback))
}

export const runOnTransactionRollback = (callback: HookType) => {
  stores.forEach((store) => store.getStore()?.onRollback.push(callback))
}

export const runOnTransactionComplete = (callback: HookType) => {
  stores.forEach((store) => store.getStore()?.onComplete.push(callback))
}

export const emitTransactionCommit = () => {
  stores.forEach((store) => {
    store.getStore()?.onCommit.forEach((callback) => { callback() })
  })
}

export const emitTransactionRollback = () => {
  stores.forEach((store) => {
    store.getStore()?.onRollback.forEach((callback) => { callback() })
  })
}

export const emitTransactionComplete = () => {
  stores.forEach((store) => {
    store.getStore()?.onComplete.forEach((callback) => { callback() })
  })
}