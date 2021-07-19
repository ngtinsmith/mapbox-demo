<template>
    <div
        id="map"
        class="map"
    >
        <div class="toolbar-main">
            <div class="toolbar-actions">
                <BaseButton
                    v-for="tab in tabs"
                    :key="tab"
                    color="black"
                    text-color="white"
                    :class="{ active: currentTab === tab.type }"
                    @click="changeTab(tab)"
                >
                    {{ tab.type }}
                </BaseButton>
            </div>

            <keep-alive>
                <component
                    :is="currentTabComponent"
                    :current-tab="currentTab"
                />
            </keep-alive>
        </div>
        <div class="toolbar-left">
            <div class="toolbar-actions">
                <BaseButton
                    color="black"
                    text-color="white"
                    size="toggle"
                >
                    +
                </BaseButton>
                <BaseButton
                    color="black"
                    text-color="white"
                    size="toggle"
                >
                    -
                </BaseButton>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref } from 'vue'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'

import BaseButton from './BaseButton.vue'
import ToolbarSearch from './ToolbarSearch.vue'
import ToolbarAdd from './ToolbarAdd.vue'
import ToolbarExport from './ToolbarExport.vue'

import { MapToolbarTab, Tab } from '@/types/tab'

const staticTabs = [
    MapToolbarTab.SEARCH,
    MapToolbarTab.ADD,
    MapToolbarTab.EXPORT,
]

export default defineComponent({
    components: { BaseButton },
    setup() {
        const currentTab = ref<MapToolbarTab | null>(MapToolbarTab.SEARCH)
        const currentTabComponent = computed(() => {
            let component

            switch (currentTab.value) {
                case MapToolbarTab.SEARCH:
                    component = ToolbarSearch
                    break
                case MapToolbarTab.ADD:
                    component = ToolbarAdd
                    break
                case MapToolbarTab.EXPORT:
                    component = ToolbarExport
                    break
                default:
                    break
            }

            return component
        })

        const tabs = computed((): Tab[] => {
            return staticTabs.map(tab => {
                return {
                    type: tab,
                    isActive: tab === currentTab.value,
                }
            })
        })

        function changeTab(tab: Tab): void {
            if (currentTab.value === tab.type) {
                currentTab.value = null
            } else {
                currentTab.value = tab.type
            }
        }

        onMounted(() => {
            mapboxgl.accessToken = process.env.VUE_APP_MAPBOX_TOKEN

            const map = new mapboxgl.Map({
                container: 'map', // container ID
                style: 'mapbox://styles/mapbox/streets-v11', // style URL
                center: [-74.5, 40], // starting position [lng, lat]
                zoom: 9, // starting zoom
            })

            console.log(map)
        })

        return { tabs, currentTab, currentTabComponent, changeTab }
    },
})
</script>

<style lang="scss" scoped>
.map {
    height: calc(100vh - 2.5rem);
    position: relative;

    .toolbar-main {
        position: absolute;
        top: 1rem;
        left: 1rem;
        z-index: 10;
        display: flex;

        > :deep(*:not(:last-child)) {
            margin-right: 0.5rem;
        }
    }

    .toolbar-left {
        position: absolute;
        top: 50%;
        right: 1rem;
        transform: translateY(-50%);
        z-index: 10;
    }

    .toolbar-actions {
        display: flex;
        flex-direction: column;

        > :deep(*:not(:last-child)) {
            margin-bottom: 0.5rem;
        }
    }
}
</style>
