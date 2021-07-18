<template>
    <div class="container">
        <Map />
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Map from './components/Map.vue'

export default defineComponent({
    name: 'App',
    components: {
        Map,
    },
})
</script>

<style>
body {
    padding: 0;
    margin: 0;
}

* {
    box-sizing: border-box;
}

#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
}

.container {
    height: 100vh;
    border: 4px solid red;
}
</style>
