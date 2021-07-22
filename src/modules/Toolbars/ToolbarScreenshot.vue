<template>
    <BaseButton
        color="black"
        text-color="white"
        size="toggle"
        class="icon"
    >
        <span style="font-size: 24px; display: flex;">
        </span>
    </BaseButton>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from 'vue'
import mapboxgl from 'mapbox-gl'

import BaseButton from '@/components/BaseButton.vue'
import { ToolbarTab } from '@/types/tab'
import { useInjectableTextMarker } from '@/composables/use-text-marker'

export default defineComponent({
    components: { BaseButton },
    props: {
        map: {
            type: Object as PropType<mapboxgl.Map>,
            default: null,
        },
        currentTab: {
            type: String as PropType<ToolbarTab>,
            default: null,
        },
        placeholder: {
            type: String,
            default: 'Search location',
        },
        activeLabel: {
            type: String,
            default: 'ri-marker-label',
        },
        element: {
            type: HTMLElement,
            default: null,
        },
    },
    setup(props) {
        const isActive = computed(
            () => props.currentTab === ToolbarTab.SCREENSHOT
        )
        const { textMarker, setTextMarker, textMarkerElement } =
            useInjectableTextMarker()

        function onUpdateTextMarker() {
            if (!textMarker.value || !textMarkerElement.value) return

            const markerText = textMarkerElement.value.querySelector('p')

            if (markerText) {
                markerText.textContent = textMarker.value
            }
        }

        function removeTextMarker() {
            if (!textMarkerElement.value) return

            const markerEl = textMarkerElement.value

            if (markerEl) {
                markerEl.parentElement?.removeChild(markerEl)
                setTextMarker('')
            }
        }

        return {
            isActive,
            textMarker,
            onUpdateTextMarker,
            removeTextMarker,
        }
    },
})
</script>

<style lang="scss" scoped>
.style-label {
    display: flex;
    flex-direction: column;
    background-color: #000;
    padding: 1.5rem;

    > :deep(*:not(:last-child)) {
        margin-bottom: 0.5rem;
    }

    h4 {
        margin: 0 0 0.5rem;
        color: #fff;
    }
}
</style>
