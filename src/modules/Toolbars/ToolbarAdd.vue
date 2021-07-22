<template>
    <TabContent :is-active="isActive">
        <div class="toolbar-actions">
            <BaseButton
                v-for="tab in addElementsTabs"
                :key="tab"
                :color="isTab(tab) ? 'white' : 'black'"
                :text-color="isTab(tab) ? 'black' : 'white'"
                size="toggle"
                :title="`${capitalize(tab)}s`"
                @click="changeTab(tab)"
            >
                <span style="font-size: 1.25rem; display: flex;">
                    <i
                        :class="tab === 'icon'
                            ? 'ri-map-pin-2-fill'
                            : 'ri-text'"
                    />
                </span>
            </BaseButton>
        </div>

        <div class="toolbar-content">
            <TabContent :is-active="isTabIcon">
                <div class="search-field">
                    <input
                        placeholder="Search icon"
                        :value="iconKeyword"
                        @input="searchIcon"
                    />
                </div>
                <div class="icons">
                    <BaseButton
                        v-for="icon in filteredIcons"
                        :key="icon"
                        color="black"
                        text-color="white"
                        size="toggle"
                        class="icon"
                        :title="icon.replace(/^(ri-)/, '')"
                        @click="addMark(icon)"
                    >
                        <span style="font-size: 24px; display: flex;">
                            <i :class="icon" />
                        </span>
                    </BaseButton>
                </div>
            </TabContent>

            <TabContent :is-active="isTabLabel">
                <div class="add-text">
                    <FormField
                        v-model="newText"
                        label="New Text"
                        @enter-submit="addTextToMap"
                    />
                    <BaseButton
                        color="white"
                        text-color="black"
                        :weight="600"
                        uppercase
                        @click="addTextToMap"
                    >
                        Add
                    </BaseButton>
                </div>
            </TabContent>
        </div>
    </TabContent>
</template>

<script lang="ts">
import {
    capitalize,
    computed,
    defineComponent,
    inject,
    PropType,
    ref,
} from 'vue'
import mapboxgl from 'mapbox-gl'

import { useTab } from '@/composables/use-tab'
import {
    TextMarker,
    useInjectableTextMarker,
} from '@/composables/use-text-marker'

import BaseButton from '@/components/BaseButton.vue'
import FormField from '@/components/FormField.vue'
import TabContent from '@/components/TabContent.vue'

import { remixIcons } from '@/constants/icons'
import { GetMapInstance } from '@/types/mapbox'
import { ToolbarTab } from '@/types/tab'

import debounce from 'lodash/debounce'
import { createTextMarkerElement } from '@/services/html'

export default defineComponent({
    components: { TabContent, BaseButton, FormField },
    props: {
        map: {
            type: {} as PropType<mapboxgl.Map>,
            default: undefined,
        },
        currentTab: {
            type: String as PropType<ToolbarTab>,
            default: null,
        },
    },
    emits: ['mark', 'focus-text-marker'],
    setup(props, { emit }) {
        const isActive = computed(() => props.currentTab === ToolbarTab.ADD)

        // Inject properties

        const { setTextMarker, setTextMarkerElement } =
            useInjectableTextMarker()
        const getMapInstance = inject<GetMapInstance>(
            'getMapInstance',
            () => new mapboxgl.Map()
        )
        const newText = ref('')

        // Marker actions

        function addTextToMap() {
            const map = getMapInstance()

            const textMarker = createTextMarkerElement({
                text: newText.value,
                onClick: (marker: TextMarker) => {
                    setTextMarker(marker.text)
                    setTextMarkerElement(marker.element)
                    emit('focus-text-marker')
                },
            })

            // Add text markers to the map
            new mapboxgl.Marker({
                element: textMarker,
                draggable: true,
            })
                .setLngLat(map.getCenter())
                .addTo(map)

            newText.value = ''
        }

        // Icons search

        const iconKeyword = ref('')
        const icons = ref(remixIcons)
        const filteredIcons = computed(() =>
            icons.value.filter(icon =>
                icon.includes(iconKeyword.value.toLowerCase())
            )
        )
        const searchIcon = debounce(function (e) {
            iconKeyword.value = e.target.value
        }, 400)

        const {
            currentTab: currentLocalTab,
            changeTab,
            isTab,
        } = useTab<ToolbarTab>(null)

        const addElementsTabs = computed((): ToolbarTab[] => {
            return [ToolbarTab.ICON, ToolbarTab.LABEL]
        })
        const isTabIcon = computed(() => isTab(ToolbarTab.ICON))
        const isTabLabel = computed(() => isTab(ToolbarTab.LABEL))

        function addMark(iconClass: string): void {
            emit('mark', iconClass)
        }

        return {
            isActive,
            isTabIcon,
            isTabLabel,
            newText,

            addElementsTabs,
            currentLocalTab,
            changeTab,
            isTab,

            addMark,
            filteredIcons,
            iconKeyword,
            searchIcon,
            capitalize,
            addTextToMap,
        }
    },
})
</script>

<style lang="scss" scoped>
.toolbar-actions {
    display: flex;
    border-bottom: 1px solid #fff;
}

.toolbar-content {
    background-color: #000;
    color: #fff;
}

.icons {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    max-height: 60vh;
    overflow-y: auto;
    padding: 0.5rem 1rem 1rem;

    > .icon {
        transition: 0.08s ease-out;
        border-radius: 0.25rem;

        &:hover {
            background-color: #fff;
            color: #000;
        }
    }
}

.search-field {
    padding: 0 1rem;
    background-color: #000;
    margin-bottom: 0.5rem;
    border-bottom: 1px solid #fff;

    input {
        height: 2.5rem;
        border: 0;
        background-color: unset;
        outline: 0;
        color: #fff;
    }
}

.add-text {
    display: flex;
    flex-direction: column;
    background-color: #000;
    padding: 1.5rem;

    > :deep(*:not(:last-child)) {
        margin-bottom: 0.5rem;
    }
}
</style>
