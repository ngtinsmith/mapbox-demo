import { computed, inject, ref, Ref, WritableComputedRef } from 'vue'

export interface UseInjectableTextMarker {
    textMarker: WritableComputedRef<string>
    textMarkerElement: WritableComputedRef<TextMarkerElement>
    setTextMarker: SetTextMarker
    setTextMarkerElement: SetTextMarkerElement
}

export interface TextMarker {
    text: string
    element: TextMarkerElement
}

export type TextMarkerElement = Element
export type SetTextMarker = (text: string) => void
export type SetTextMarkerElement = (element: TextMarkerElement) => void

/**
 * Ref's passed by provider to keep reactivity
 */
export function useInjectableTextMarker(
    initialTextMarker?: TextMarker
): UseInjectableTextMarker {
    //
    const _textMarker = inject<Ref<string>>(
        'textMarker',
        ref(initialTextMarker?.text ?? '')
    )
    const setTextMarker = inject<SetTextMarker>(
        'setTextMarker',
        () => undefined
    )

    const _textMarkerElement = inject<Ref<TextMarkerElement>>(
        'textMarkerElement',
        ref(initialTextMarker?.element ?? document.createElement('div'))
    )
    const setTextMarkerElement = inject<SetTextMarkerElement>(
        'setTextMarkerElement',
        () => undefined
    )

    const textMarker = computed({
        get: () => _textMarker.value,
        set: (label: string) => {
            setTextMarker(label)
        },
    })

    const textMarkerElement = computed({
        get: () => _textMarkerElement.value,
        set: (element: TextMarkerElement) => {
            setTextMarkerElement(element)
        },
    })

    return {
        textMarker,
        textMarkerElement,
        setTextMarker,
        setTextMarkerElement,
    }
}
