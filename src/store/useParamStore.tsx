import { create } from "zustand";
import zukeeper from "zukeeper"

// interface paramState {
//     page: string,
//     offset: number,
//     order: string,
//     direction: string,
//     unread: boolean,
//     setPage: (by: string) => void,
//     setOffset: (by: number) => void,
//     setOrder: (by: string) => void,
//     setDirection: (by: string) => void,
//     setUnread: (by: boolean) => void,
//     reset: () => void
// }

type State = {
    // page: string,
    offset: number,
    order: string,
    direction: string,
    unread: boolean,
}

type Actions = {
    page: string,
    setPage: (by: string) => void,
    setOffset: (by: number) => void,
    setOrder: (by: string) => void,
    setDirection: (by: string) => void,
    setUnread: (by: boolean) => void,
    resetParams: (by: string) => void
}

const initialState: State = {
    offset: 0,
    order: 'published_at',
    direction: 'desc',
    unread: true
}

const paramStore = (set:any) => ({
    ...initialState,
    page: '',
    setPage: (value: string) => set({ page: value }),
    setOffset: (value:number) => set({ offset: value }),
    setOrder: (value:string) => set({ order: value }),
    setDirection: (value:string) => set({ direction: value }),
    setUnread: (value: boolean) => set({unread: value}),
    resetParams: (value: string) => set({
        ...initialState,
        page: value
    })
})

const useParamStore = create<State & Actions>()(
    zukeeper(paramStore)
)
// window.store = useParamStore

export default useParamStore