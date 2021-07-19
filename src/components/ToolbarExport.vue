<template>
    <TabContent :is-active="isActive">
        export options
    </TabContent>
</template>

<script lang="ts">
import { MapToolbarTab } from '@/types/tab'
import { computed, defineComponent, PropType } from 'vue'
import TabContent from './TabContent.vue'

export default defineComponent({
    components: { TabContent },
    props: {
        currentTab: {
            type: String as PropType<MapToolbarTab>,
            default: null,
        },
    },
    setup(props) {
        const isActive = computed(
            () => props.currentTab === MapToolbarTab.EXPORT
        )

        return { isActive }
    },
})
</script>

