import { Ref, ref, UnwrapRef } from 'vue'

export interface ComposableUseTab<T> {
    currentTab: Ref<UnwrapRef<T> | null>
    changeTab: (tab: UnwrapRef<T>) => void
    isTab: (tab: string) => boolean
}

export function useTab<T>(initialTab: T | null): ComposableUseTab<T> {
    const currentTab = ref<T | null>(initialTab)

    function changeTab(tab: UnwrapRef<T>): void {
        if (currentTab.value === tab) {
            currentTab.value = null
        } else {
            currentTab.value = tab
        }
    }
    const isTab = (tab: string): boolean => currentTab.value === tab

    return { currentTab, changeTab, isTab }
}
