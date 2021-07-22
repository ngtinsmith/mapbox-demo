import { Ref, ref, UnwrapRef } from 'vue'

export interface ComposableUseTab<T> {
    currentTab: Ref<UnwrapRef<T> | null>
    changeTab: (tab: UnwrapRef<T> | null) => void
    isTab: (tab: UnwrapRef<T>) => boolean
}

export function useTab<T>(initialTab: T | null): ComposableUseTab<T> {
    const currentTab = ref<T | null>(initialTab)

    function changeTab(tab: UnwrapRef<T> | null): void {
        if (currentTab.value === tab) {
            currentTab.value = null
        } else {
            currentTab.value = tab
        }
    }
    const isTab = (tab: UnwrapRef<T> | null | string): boolean =>
        currentTab.value === tab

    return { currentTab, changeTab, isTab }
}
