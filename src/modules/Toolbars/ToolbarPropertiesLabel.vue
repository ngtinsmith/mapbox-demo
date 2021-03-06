<template>
    <TabContent :is-active="isActive">
        <div class="style-label">
            <h4>Text Marker</h4>
            <FormField
                v-model="textMarker"
                label="Text"
            />
            <BaseButton
                color="white"
                text-color="black"
                :weight="600"
                :disabled="textMarker.length === 0"
                uppercase
                @click="onUpdateTextMarker"
            >
                SET
            </BaseButton>
            <BaseButton
                color="white"
                text-color="black"
                :weight="600"
                :disabled="textMarker.length === 0"
                uppercase
                @click="removeTextMarker"
            >
                REMOVE
            </BaseButton>
        </div>
    </TabContent>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from 'vue'
import mapboxgl from 'mapbox-gl'

import BaseButton from '@/components/BaseButton.vue'
import TabContent from '@/components/TabContent.vue'
import FormField from '@/components/FormField.vue'

import { useInjectableTextMarker } from '@/composables/use-text-marker'
import { ToolbarTab } from '@/types/tab'

export default defineComponent({
    components: { TabContent, FormField, BaseButton },
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
        const isActive = computed(() => props.currentTab === ToolbarTab.LABEL)
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
