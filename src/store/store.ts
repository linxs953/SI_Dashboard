import { create, StoreApi, UseBoundStore } from "zustand"

function createStore<T>(initialState: T, actions: any):UseBoundStore<StoreApi<T>> {
    return create<T>((set) => ({
      ...initialState,
      ...actions(set),
    }));
}

export default createStore