<template>
    <TabContent :is-active="isActive">
        <div class="search-field">
            <input
                :placeholder="placeholder"
                :value="searchKeyword"
                @input="onSearch"
            />
        </div>

        <div
            v-if="searchKeyword.length"
            class="search-results"
        >
            <BaseButton
                v-for="mapFeature of searchedMaps"
                :key="mapFeature.id"
                class="map-feature"
                align="left"
                @click="selectLocation(mapFeature)"
            >
                {{ mapFeature.place_name }}
            </BaseButton>
        </div>
    </TabContent>
</template>

<script lang="ts">
import { MapToolbarTab } from '@/types/tab'
import { computed, defineComponent, PropType, ref } from 'vue'
import TabContent from './TabContent.vue'
import debounce from 'lodash/debounce'
import mapboxgl from 'mapbox-gl'
import axios, { AxiosResponse } from 'axios'
import { GEOCODING_ENDPOINT } from '@/constants/api'
import BaseButton from './BaseButton.vue'
import { MapFeature } from '@/types/mapbox'

export default defineComponent({
    components: { TabContent, BaseButton },
    props: {
        map: {
            type: Object as PropType<mapboxgl.Map>,
            default: null,
        },
        currentTab: {
            type: String as PropType<MapToolbarTab>,
            default: null,
        },
        placeholder: {
            type: String,
            default: 'Search location',
        },
        debounceTimer: {
            type: Number,
            default: 500,
        },
    },
    emits: ['search', 'focus-location'],
    setup(props, { emit }) {
        const searchKeyword = ref('')
        const searchedMaps = ref<MapFeature[]>([])

        const isActive = computed(
            () => props.currentTab === MapToolbarTab.SEARCH
        )

        async function searchHandler(e: Event) {
            const target = e.target as HTMLInputElement

            if (target.value === '') {
                searchedMaps.value = []
            } else {
                const transformedKeyword = encodeURIComponent(target.value)
                const mapBoxToken = process.env.VUE_APP_MAPBOX_TOKEN
                const mapBoxEndpoint = 'mapbox.places'

                const geocodingUrl = `${GEOCODING_ENDPOINT}/v5/${mapBoxEndpoint}/${transformedKeyword}.json?access_token=${mapBoxToken}`
                // TODO: move to services/api
                const results: AxiosResponse = await axios.get(geocodingUrl)

                console.log(results.data.features)
                searchedMaps.value = results.data.features
            }

            // Set and emit
            searchKeyword.value = target.value
        }

        const onSearch = debounce(searchHandler, props.debounceTimer)

        function selectLocation(location: MapFeature): void {
            emit('focus-location', location)
        }

        return {
            isActive,
            searchKeyword,
            onSearch,
            searchedMaps,
            selectLocation,
        }
    },
})
</script>

<style lang="scss" scoped>
.search-field {
    padding: 0 1rem;
    background-color: #000;
    margin-bottom: 0.5rem;

    input {
        height: 2.5rem;
        border: 0;
        background-color: unset;
        outline: 0;
        color: #fff;
    }
}

.search-results {
    display: flex;
    flex-direction: column;

    .map-feature {
        display: flex;
        background-color: #000;
        color: #fff;
        padding: 0.5rem 0.5rem;
        height: 2.5rem;

        &:not(:last-child) {
            margin-bottom: 0.5rem;
        }
    }
}
</style>
