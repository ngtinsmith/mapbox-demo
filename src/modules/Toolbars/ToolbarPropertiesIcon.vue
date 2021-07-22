<template>
    <TabContent :is-active="isActive">
        <div class="style-icon">
            <!--
                <h4 v-text="iconLabel" />
            -->
            <BaseButton
                color="white"
                text-color="black"
            >
                icon style
            </BaseButton>
        </div>
    </TabContent>
</template>

<script lang="ts">
import { computed, defineComponent, PropType, ref } from 'vue'
import mapboxgl from 'mapbox-gl'

import TabContent from './TabContent.vue'
import BaseButton from './BaseButton.vue'
import { TabComponentStyle } from '@/types/tab'

export default defineComponent({
    components: { TabContent, BaseButton },
    props: {
        map: {
            type: Object as PropType<mapboxgl.Map>,
            default: null,
        },
        currentTab: {
            type: String as PropType<TabComponentStyle>,
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
    setup(props, { emit }) {
        const searchKeyword = ref('')

        const isActive = computed(
            () => props.currentTab === TabComponentStyle.ICON
        )

        return {
            isActive,
            searchKeyword,
        }
    },
})
</script>

<style lang="scss" scoped>
.style-icon {
    display: flex;
    flex-direction: column;
    background-color: #000;
    padding: 1rem;
}
</style>
