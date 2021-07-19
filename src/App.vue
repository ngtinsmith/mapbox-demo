<template>
    <MapHeader />
    <Map />
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import MapHeader from './components/MapHeader.vue'
import Map from './components/Map.vue'

export default defineComponent({
    name: 'App',
    components: {
        Map,
        MapHeader,
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
