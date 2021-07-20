<template>
    <MapHeader />
    <Map :initial-location="initialLocation" />
</template>

<script lang="ts">
import { defineComponent, reactive } from 'vue'
import MapHeader from './components/MapHeader.vue'
import Map from './components/Map.vue'
import { MapFeature } from './types/mapbox'

export default defineComponent({
    name: 'App',
    components: {
        Map,
        MapHeader,
    },
    setup() {
        const initialLocation = reactive<MapFeature>({
            type: 'Feature',
            properties: {
                message: 'Foo',
                iconSize: [50, 50],
            },
            /* center: [-74.5, 40], */
            center: [-73.9866, 40.7306],
            geometry: {
                type: 'Point',
                coordinates: [-73.9866, 40.7306],
            },
        })

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
