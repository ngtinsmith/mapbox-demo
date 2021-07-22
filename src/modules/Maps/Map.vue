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
                    :color="isTab(tab) ? 'white' : 'black'"
                    :text-color="isTab(tab) ? 'black' : 'white'"
                    :class="{ active: isTab(tab) }"
                    size="toggle"
                    :title="`${capitalize(tab)}`"
                    @click="() => handleChangeTab(tab)"
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
                    @focus-location="focusLocation"
                    @mark="addMarker"
                />
            </keep-alive>
        </div>

        <div class="toolbar-styling">
            <keep-alive>
                <component
                    :is="currentTabPropertiesComponent"
                    :current-tab="currentTabProperty"
                    @focus-text-marker="onTextMarkerFocus"
                    @focus-location="focusLocation"
                    @mark="addMarker"
                />
            </keep-alive>

            <div class="toolbar-actions">
                <BaseButton
                    v-for="tab in tabProperties"
                    :key="tab"
                    :color="currentTabProperty === tab ? 'white' : 'black'"
                    :text-color="currentTabProperty === tab ? 'black' : 'white'"
                    :class="{ active: currentTabProperty === tab }"
                    size="toggle"
                    :title="`${capitalize(tab)}`"
                    @click="changeTabProperty(tab)"
                >
                    <span style="font-size: 1.25rem; display: flex;">
                        <i :class="getToolbarIcon(tab)" />
                    </span>
                </BaseButton>
            </div>
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
    provide,
    ref,
} from 'vue'

import mapboxgl from 'mapbox-gl'
import MapboxDraw from '@mapbox/mapbox-gl-draw'

import 'mapbox-gl/dist/mapbox-gl.css'
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css'
import 'remixicon/fonts/remixicon.css'

import BaseButton from '@/components/BaseButton.vue'
import ToolbarSearch from '@/modules/Toolbars/ToolbarSearch.vue'
import ToolbarAdd from '@/modules/Toolbars/ToolbarAdd.vue'
import ToolbarScreenshot from '@/modules/Toolbars/ToolbarScreenshot.vue'
import ToolbarPropertiesLabel from '@/modules/Toolbars/ToolbarPropertiesLabel.vue'

import { TextMarker, TextMarkerElement } from '@/composables/use-text-marker'
import { useTab } from '@/composables/use-tab'

import { ToolbarTab } from '@/types/tab'
import { MapFeature, MapCoordinates } from '@/types/mapbox'
import { createMarkerElement, createRemoveMarkerElement } from '@/services/html'
import { fetchStaticMapImage } from '@/services/api'

export default defineComponent({
    components: { BaseButton },
    props: {
        initialLocation: {
            type: Object as PropType<MapFeature>,
            default: null,
            required: true,
        },
        zoom: {
            type: Number,
            default: 8,
        },
        bearing: {
            type: Number,
            default: 0,
        },
    },
    setup(props) {
        // -- Injectables

        const textMarker = ref<TextMarker['text']>('')
        const textMarkerElement = ref<TextMarkerElement>()

        provide('textMarker', textMarker)
        provide('setTextMarker', setTextMarker)
        provide('textMarkerElement', textMarkerElement)
        provide('setTextMarkerElement', setTextMarkerElement)

        function setTextMarker(text: string): void {
            textMarker.value = text
        }

        function setTextMarkerElement(element: TextMarkerElement): void {
            textMarkerElement.value = element
        }

        // -- Tabs

        const { currentTab, changeTab, isTab } = useTab<ToolbarTab>(null)
        const tabs = computed((): ToolbarTab[] => {
            return [ToolbarTab.SEARCH, ToolbarTab.ADD, ToolbarTab.SCREENSHOT]
        })

        const currentTabComponent = computed(() => {
            let component

            switch (currentTab.value) {
                case ToolbarTab.SEARCH:
                    component = ToolbarSearch
                    break
                case ToolbarTab.ADD:
                    component = ToolbarAdd
                    break
                case ToolbarTab.SCREENSHOT:
                    component = ToolbarScreenshot
                    break
                default:
                    break
            }

            return component
        })

        const {
            currentTab: currentTabProperty,
            changeTab: changeTabProperty,
            isTab: isTabProperty,
        } = useTab<ToolbarTab>(null)

        const tabProperties = computed((): ToolbarTab[] => {
            return [ToolbarTab.LABEL]
        })

        const currentTabPropertiesComponent = computed(() => {
            let component

            switch (currentTabProperty.value) {
                case ToolbarTab.LABEL:
                    component = ToolbarPropertiesLabel
                    break
                default:
                    break
            }

            return component
        })

        // -- Map

        let map: mapboxgl.Map = {} as mapboxgl.Map
        const activeLocation = ref<MapFeature>(props.initialLocation)

        provide('getMapInstance', () => map)

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
                zoom: props.zoom, // starting zoom
            })

            // Add zoom and rotation controls to the map.
            map.addControl(new mapboxgl.NavigationControl())

            // Events
            map.on('dragend', onDragEnd)
            map.on('click', onClickMap)
            map.on('load', onLoad)
        }

        function onLoad(): void {
            const draw = new MapboxDraw({
                displayControlsDefault: false,
                controls: {
                    polygon: true,
                    trash: true,
                },
            })

            map.addControl(draw)
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

        async function onClickMap(): Promise<void> {
            /* e: mapboxgl.MapMouseEvent & mapboxgl.EventData */
            changeTab(null)

            if (textMarker.value.length === 0) {
                changeTabProperty(null)
            }
        }

        function focusLocation(location: MapFeature): void {
            activeLocation.value = location
            map.jumpTo({ center: location.geometry.coordinates })
        }

        function onTextMarkerFocus(): void {
            changeTab(ToolbarTab.LABEL)
        }

        function addMarker(classMark: string): void {
            const location = activeLocation.value

            if (!location) return

            let marker: mapboxgl.Marker
            const iconSize = location.properties.iconSize ?? [50, 50]

            // Create a DOM element for each marker.
            const markerElement = createMarkerElement(
                classMark,
                iconSize,
                () => undefined
            )

            // Create marker PopUp with remove button
            const markerRemoveElement = createRemoveMarkerElement(() =>
                marker.remove()
            )

            // Marker PopUp
            const popup = new mapboxgl.Popup({
                offset: 25,
            }).setDOMContent(markerRemoveElement)

            // Add markers to the map.
            marker = new mapboxgl.Marker({
                element: markerElement,
                draggable: true,
            })
                .setLngLat(location.geometry.coordinates)
                .setPopup(popup)
                .addTo(map)
        }

        function getToolbarIcon(tab: ToolbarTab): string {
            let classIcon = ''

            switch (tab) {
                case ToolbarTab.SEARCH:
                    classIcon = 'ri-search-line'
                    break
                case ToolbarTab.ADD:
                    classIcon = 'ri-add-fill'
                    break
                case ToolbarTab.EXPORT:
                    classIcon = 'ri-upload-2-fill'
                    break
                case ToolbarTab.ICON:
                    classIcon = 'ri-tools-fill'
                    break
                case ToolbarTab.LABEL:
                    classIcon = 'ri-text'
                    break
                case ToolbarTab.LAYER:
                    classIcon = 'ri-stack-fill'
                    break
                case ToolbarTab.SCREENSHOT:
                    classIcon = 'ri-camera-fill'
                    break
                default:
                    break
            }

            return classIcon
        }

        function handleChangeTab(tab: ToolbarTab) {
            if (tab === ToolbarTab.SCREENSHOT) {
                changeTab(null)
                screenshot()
            } else {
                changeTab(tab)
            }
        }

        async function screenshot() {
            const { lng, lat } = map.getCenter()

            let w = document.getElementById('map')?.clientWidth ?? 1280
            let h = document.getElementById('map')?.clientHeight ?? 1280

            // Mapbox max-dimension: Height/Width must be between 1-1280
            w = w > 1280 ? 1280 : w
            h = h > 1280 ? 1280 : h

            const imageBlob: Blob = await fetchStaticMapImage({
                lng,
                lat,
                width: w,
                height: h,
                zoom: props.zoom,
                bearing: props.bearing,
            })

            download(imageBlob)
        }

        function download(image: Blob, filename = 'image'): void {
            const blob = new Blob([image], { type: 'image/png' })
            const reader = new FileReader()

            const link = document.createElement('a')
            link.setAttribute('download', `${filename}.png`)

            reader.readAsDataURL(blob)
            reader.onload = function () {
                link.href = reader.result as string
                link.click()
            }
        }

        return {
            tabs,
            currentTab,
            changeTab,
            isTab,
            currentTabComponent,

            tabProperties,
            currentTabProperty,
            changeTabProperty,
            isTabProperty,
            currentTabPropertiesComponent,

            focusLocation,
            onTextMarkerFocus,
            addMarker,
            getToolbarIcon,
            capitalize,
            handleChangeTab,
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

    .toolbar-styling {
        position: absolute;
        top: 1rem;
        right: 1rem;
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
 * Mapbox Style Overrides / Globals
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

.v-marker {
    display: flex;
    align-items: center;
    justify-content: center;

    > {
        display: flex;
    }
}

.v-text-marker {
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgba(0, 0, 0, 0.5);
    padding: 0.25rem 0.5rem;
    border-radius: 0.25rem;

    > {
        display: flex;
    }

    p {
        margin: 0;
        color: #fff;
        font-size: 1rem;
    }
}

.calculation-box {
    height: 75px;
    width: 150px;
    position: absolute;
    bottom: 40px;
    left: 10px;
    background-color: rgba(255, 255, 255, 0.9);
    padding: 15px;
    text-align: center;
}
</style>
