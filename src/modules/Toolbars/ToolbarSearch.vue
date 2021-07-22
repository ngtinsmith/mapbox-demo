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
import { computed, defineComponent, PropType, ref } from 'vue'
import mapboxgl from 'mapbox-gl'

import TabContent from '@/components/TabContent.vue'
import BaseButton from '@/components/BaseButton.vue'

import debounce from 'lodash/debounce'
import { ToolbarTab } from '@/types/tab'
import { MapFeature } from '@/types/mapbox'
import { searchLocation } from '@/services/api'

export default defineComponent({
    components: { TabContent, BaseButton },
    props: {
        map: {
            type: Object as PropType<mapboxgl.Map>,
            default: null,
        },
        currentTab: {
            type: String as PropType<ToolbarTab>,
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

        const isActive = computed(() => props.currentTab === ToolbarTab.SEARCH)

        async function searchHandler(e: Event) {
            const target = e.target as HTMLInputElement

            if (target.value === '') {
                searchedMaps.value = []
            } else {
                const response = await searchLocation(target.value)

                searchedMaps.value = response.features
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
