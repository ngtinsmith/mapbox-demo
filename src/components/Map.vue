<template>
    <div class="map" id="map"></div>
</template>

<script lang="ts">
import { defineComponent, onMounted } from 'vue'

import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'

export default defineComponent({
    setup() {
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
    },
})
</script>

<style lang="scss" scoped>
.map {
    height: 100%;
}
</style>
