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
                    :color="currentTab === tab ? 'white' : 'black'"
                    :text-color="currentTab === tab ? 'black' : 'white'"
                    :class="{ active: currentTab === tab }"
                    size="toggle"
                    :title="`${capitalize(tab)}`"
                    @click="changeTab(tab)"
                >
                    <span style="font-size: 1.25rem; display: flex;">
                        <i :class="getToolbarIcon(tab)" />
                    </span>
                </BaseButton>
            </div>

            <keep-alive>
                <component
                    :is="currentTabComponent"
                    :current-tab="currentTab"
                    @focus-location="onFocusLocation"
                    @mark="addMarker"
                />
            </keep-alive>
        </div>
    </div>
</template>

<script lang="ts">
import {
    capitalize,
    computed,
    defineComponent,
    onMounted,
    PropType,
    ref,
} from 'vue'

import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import 'remixicon/fonts/remixicon.css'

import BaseButton from './BaseButton.vue'
import ToolbarSearch from './ToolbarSearch.vue'
import ToolbarAdd from './ToolbarAdd.vue'
import ToolbarExport from './ToolbarExport.vue'

import { MapToolbarTab } from '@/types/tab'
import { useTab } from '@/composables/use-tab'
import { MapFeature, MapCoordinates } from '@/types/mapbox'
import { stringToHtml } from '@/helpers/html-templates'

export default defineComponent({
    components: { BaseButton },
    props: {
        initialLocation: {
            type: Object as PropType<MapFeature>,
            default: null,
            required: true,
        },
    },
    setup(props) {
        const { currentTab, changeTab, isTab } = useTab<MapToolbarTab>(
            MapToolbarTab.SEARCH
        )

        const tabs = computed((): MapToolbarTab[] => {
            return [
                MapToolbarTab.SEARCH,
                MapToolbarTab.ADD,
                MapToolbarTab.EXPORT,
            ]
        })

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

        let map: mapboxgl.Map
        const activeLocation = ref<MapFeature>(props.initialLocation)

        onMounted(() => {
            createMap()
        })

        function createMap(): void {
            mapboxgl.accessToken = process.env.VUE_APP_MAPBOX_TOKEN
            map = new mapboxgl.Map({
                container: 'map', // container ID
                style: 'mapbox://styles/mapbox/streets-v11', // style URL
                center:
                    activeLocation.value?.center ??
                    props.initialLocation.center, // starting position [lng, lat]
                zoom: 9, // starting zoom
            })

            // Add zoom and rotation controls to the map.
            map.addControl(new mapboxgl.NavigationControl())

            // Events
            map.on('dragend', onDragEnd)
        }

        function onDragEnd(): void {
            const { lng, lat } = map.getCenter()
            const coordinates: MapCoordinates = [lng, lat]

            activeLocation.value = {
                ...activeLocation.value,
                center: coordinates,
                geometry: {
                    ...activeLocation.value.geometry,
                    coordinates,
                },
            }
        }

        function onFocusLocation(location: MapFeature): void {
            activeLocation.value = location
            map.jumpTo({ center: location.geometry.coordinates })
        }

        function addMarker(classMark: string): void {
            const location = activeLocation.value

            if (!location) return

            // Create a DOM element for each marker.
            const markerIconSize = location.properties.iconSize ?? [50, 50]
            const [lng, lat] = markerIconSize

            const svgFrag = stringToHtml(`<i class="${classMark}"></i>`)
            const el = document.createElement('div')

            el.classList.add('v-marker')
            el.setAttribute('title', classMark.replace(/^(ri-)/, ''))
            Object.assign(el.style, {
                fontSize: `${lng}px`,
                width: `${lng}px`,
                height: `${lat}px`,
                display: 'flex',
            })
            el.appendChild(svgFrag)

            let marker: mapboxgl.Marker

            const removeBtnDiv = document.createElement('div')
            const removeBtnFrag = stringToHtml(`
                <button
                    class="v-button black text-white size-toggle align-center"
                    title="Remove marker"
                >
                    Remove marker <i class="ri-delete-bin-line ri-xl"></i>
                </button>
            `)

            removeBtnFrag
                .querySelector('button')
                ?.addEventListener('click', function () {
                    marker.remove()
                })
            removeBtnDiv.appendChild(removeBtnFrag)

            const popup = new mapboxgl.Popup({ offset: 25 }).setDOMContent(
                removeBtnDiv
            )

            // Add markers to the map.
            marker = new mapboxgl.Marker({
                element: el,
                draggable: true,
            })
                .setLngLat(location.geometry.coordinates)
                .setPopup(popup)
                .addTo(map)
        }

        function getToolbarIcon(tab: MapToolbarTab): string {
            let classIcon = ''

            switch (tab) {
                case MapToolbarTab.SEARCH:
                    classIcon = 'ri-search-line'
                    break
                case MapToolbarTab.ADD:
                    classIcon = 'ri-add-fill'
                    break
                case MapToolbarTab.EXPORT:
                    classIcon = 'ri-upload-2-fill'
                    break
                default:
                    break
            }

            return classIcon
        }

        return {
            tabs,
            currentTab,
            isTab,
            currentTabComponent,
            changeTab,
            onFocusLocation,
            addMarker,
            getToolbarIcon,
            capitalize,
        }
    },
})
</script>

<style lang="scss" scoped>
.map {
    height: calc(100vh - 2.5rem); /* Minux header height */
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

    .toolbar-actions {
        display: flex;
        flex-direction: column;

        > :deep(*:not(:last-child)) {
            margin-bottom: 0.5rem;
        }
    }
}
</style>

<style lang="scss">
/**
 * Mapbox Style Overrides
 *
 * defined in this scope since this is where we import their static *.css file
 */
.mapboxgl-ctrl-top-right {
    position: absolute;
    right: 1rem;
    top: 50%;
    transform: translateY(-50%);

    .mapbox-ctrl {
        margin: 0;
        float: none;
    }
}

.v-marker {
    display: flex;
    align-items: center;
    justify-content: center;

    > {
        display: flex;
    }
}

.mapboxgl-popup-content {
    padding: 1.25rem 1rem 1rem;

    .v-button {
        display: flex;
        align-items: center;
        flex-shrink: 0;
        height: 2.5rem;
        white-space: nowrap;
        padding: 0.5rem 1rem;
        border: 0;

        &:not(:first-child) {
            margin-top: 0.5rem;
        }

        i {
            margin-left: 0.5rem;
        }
    }
}
</style>
