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
                    @focus-location="focusLocation"
                    @mark="addMarker"
                />
            </keep-alive>
        </div>

        <div class="toolbar-styling">
            <keep-alive>
                <component
                    :is="currentTabComponentStyle"
                    :current-tab="currentTabStyle"
                    @focus-location="focusLocation"
                    @mark="addMarker"
                />
            </keep-alive>

            <div class="toolbar-actions">
                <BaseButton
                    v-for="tab in tabsStyle"
                    :key="tab"
                    :color="currentTabStyle === tab ? 'white' : 'black'"
                    :text-color="currentTabStyle === tab ? 'black' : 'white'"
                    :class="{ active: currentTabStyle === tab }"
                    size="toggle"
                    :title="`${capitalize(tab)}`"
                    @click="changeTabStyle(tab)"
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
import 'mapbox-gl/dist/mapbox-gl.css'
import 'remixicon/fonts/remixicon.css'

import BaseButton from './BaseButton.vue'
import ToolbarSearch from './ToolbarSearch.vue'
import ToolbarAdd from './ToolbarAdd.vue'
import ToolbarExport from './ToolbarExport.vue'

import ToolbarStyleIcon from './ToolbarStyleIcon.vue'
import ToolbarStyleLabel from './ToolbarStyleLabel.vue'
import ToolbarStyleLayer from './ToolbarStyleLayer.vue'

import { TextMarker, TextMarkerElement } from '@/composables/use-text-marker'
import { useTab } from '@/composables/use-tab'

import { MapToolbarTab, TabComponentStyle } from '@/types/tab'
import { MapFeature, MapCoordinates } from '@/types/mapbox'
import { stringToHtml } from '@/helpers/html-templates'
import axios, { AxiosResponse } from 'axios'

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
        // Text Marker

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

        // Tabs

        const { currentTab, changeTab, isTab } = useTab<MapToolbarTab>(null)
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

        const {
            currentTab: currentTabStyle,
            changeTab: changeTabStyle,
            isTab: isTabStyle,
        } = useTab<TabComponentStyle>(null)

        const tabsStyle = computed((): TabComponentStyle[] => {
            return [
                TabComponentStyle.ICON,
                TabComponentStyle.LABEL,
                TabComponentStyle.LAYER,
            ]
        })

        const currentTabComponentStyle = computed(() => {
            let component

            switch (currentTabStyle.value) {
                case TabComponentStyle.ICON:
                    component = ToolbarStyleIcon
                    break
                case TabComponentStyle.LABEL:
                    component = ToolbarStyleLabel
                    break
                case TabComponentStyle.LAYER:
                    component = ToolbarStyleLayer
                    break
                default:
                    break
            }

            return component
        })

        // Map

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
                zoom: 9, // starting zoom
            })

            // Add zoom and rotation controls to the map.
            map.addControl(new mapboxgl.NavigationControl())

            // Events
            map.on('dragend', onDragEnd)
            map.on('click', onClickMap)
            map.on('load', onLoad)
        }

        function onLoad(): void {
            // Add a data source containing GeoJSON data.
            map.addSource('maine', {
                type: 'geojson',
                data: {
                    type: 'Feature',
                    properties: {
                        iconSize: [50, 50],
                    },
                    geometry: {
                        type: 'Polygon',
                        // These coordinates outline Maine.
                        coordinates: [
                            [
                                [-67.13734, 45.13745],
                                [-66.96466, 44.8097],
                                [-68.03252, 44.3252],
                                [-69.06, 43.98],
                                [-70.11617, 43.68405],
                                [-70.64573, 43.09008],
                                [-70.75102, 43.08003],
                                [-70.79761, 43.21973],
                                [-70.98176, 43.36789],
                                [-70.94416, 43.46633],
                                [-71.08482, 45.30524],
                                [-70.66002, 45.46022],
                                [-70.30495, 45.91479],
                                [-70.00014, 46.69317],
                                [-69.23708, 47.44777],
                                [-68.90478, 47.18479],
                                [-68.2343, 47.35462],
                                [-67.79035, 47.06624],
                                [-67.79141, 45.70258],
                                [-67.13734, 45.13745],
                            ],
                        ],
                    },
                },
            })

            // Add a new layer to visualize the polygon.
            map.addLayer({
                id: 'maine',
                type: 'fill',
                source: 'maine', // reference the data source
                layout: {},
                paint: {
                    'fill-color': '#0080ff', // blue color fill
                    'fill-opacity': 0.5,
                },
            })
            // Add a black outline around the polygon.
            map.addLayer({
                id: 'outline',
                type: 'line',
                source: 'maine',
                layout: {},
                paint: {
                    'line-color': '#000',
                    'line-width': 3,
                },
            })
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

        async function onClickMap(
            e: mapboxgl.MapMouseEvent & mapboxgl.EventData
        ): Promise<void> {
            changeTab(null)
            changeTabStyle(null)

            const { lng, lat } = e.lngLat

            const token = process.env.VUE_APP_MAPBOX_TOKEN
            const queryUrl = `https://api.mapbox.com/v4/mapbox.enterprise-boundaries-a0-v2/tilequery/${lng},${lat}.json?access_token=${token}`

            const results: AxiosResponse = await axios.get(queryUrl)

            console.log(results.data)
        }

        function focusLocation(location: MapFeature): void {
            activeLocation.value = location
            map.jumpTo({ center: location.geometry.coordinates })
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
                () => {
                    return
                }
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

        function createMarkerElement(
            mark: string,
            iconSize: MapCoordinates,
            onClick?: () => void
        ) {
            const [lng, lat] = iconSize
            const el = document.createElement('div')
            const svgFrag = stringToHtml(`<i class="${mark}"></i>`)

            el.classList.add('v-marker')
            el.setAttribute('title', mark.replace(/^(ri-)/, ''))
            onClick && el.addEventListener('click', onClick)

            Object.assign(el.style, {
                display: 'flex',
                width: `${lng}px`,
                height: `${lat}px`,
                fontSize: `${lng}px`, // for remix size
            })

            el.appendChild(svgFrag)

            return el
        }

        function createRemoveMarkerElement(onRemove: () => void) {
            const el = document.createElement('div')
            const removeBtnFragment = stringToHtml(`
                <button class="v-button" title="Remove marker">
                    Remove marker <i class="ri-delete-bin-line ri-xl"></i>
                </button>
            `)

            removeBtnFragment
                .querySelector('button')
                ?.addEventListener('click', onRemove)
            el.appendChild(removeBtnFragment)

            return el
        }

        function getToolbarIcon(
            tab: MapToolbarTab | TabComponentStyle
        ): string {
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
                case TabComponentStyle.ICON:
                    classIcon = 'ri-tools-fill'
                    break
                case TabComponentStyle.LABEL:
                    classIcon = 'ri-text'
                    break
                case TabComponentStyle.LAYER:
                    classIcon = 'ri-stack-fill'
                    break
                default:
                    break
            }

            return classIcon
        }

        return {
            tabs,
            currentTab,
            changeTab,
            isTab,
            currentTabComponent,

            tabsStyle,
            currentTabStyle,
            changeTabStyle,
            isTabStyle,
            currentTabComponentStyle,

            focusLocation,
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
