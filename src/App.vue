<template>
    <MapHeader />
    <Map :initial-location="initialLocation" />
</template>

<script lang="ts">
import { defineComponent, reactive } from 'vue'
import MapHeader from '@/modules/Maps/MapHeader.vue'
import Map from '@/modules/Maps/Map.vue'

import { MapFeature } from '@/types/mapbox'

export default defineComponent({
    name: 'App',
    components: {
        Map,
        MapHeader,
    },
    setup() {
        const locationPhilly: MapFeature = {
            type: 'Feature',
            text: 'Philadelphia',
            properties: {
                message: 'Foo',
                iconSize: [50, 50],
            },
            place_name: 'Philadelphia, Pennsylvania, United States',
            center: [-75.1327, 40.0115],
            geometry: {
                type: 'Point',
                coordinates: [-75.1327, 40.0115],
            },
        }

        const locationMaine: MapFeature = {
            type: 'Feature',
            text: 'Main',
            properties: {
                message: 'Foo',
                iconSize: [50, 50],
            },
            place_name: 'Philadelphia, Pennsylvania, United States',
            center: [-68.137343, 45.137451],
            geometry: {
                type: 'Point',
                coordinates: [-68.137343, 45.137451],
            },
        }

        const initialLocation = reactive<MapFeature>(locationPhilly)

        return { initialLocation }
    },
})
</script>

<style>
html {
    font-size: 16px;
}

body {
    padding: 0;
    margin: 0;
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
}

* {
    box-sizing: border-box;
}

#app {
    height: 100vh;
}
</style>
