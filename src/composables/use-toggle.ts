import { Ref, ref } from 'vue'

export interface ComposableUseToggle {
    isActive: Ref<boolean>
    setIsActive: (activeState: boolean) => void
    toggleIsActive: () => void
}

export function useToggle(initialState = false): ComposableUseToggle {
    const isActive = ref(initialState)
    function setIsActive(activeState: boolean): void {
        isActive.value = activeState
    }
    function toggleIsActive(): void {
        isActive.value = !isActive.value
    }

    return { isActive, setIsActive, toggleIsActive }
}
