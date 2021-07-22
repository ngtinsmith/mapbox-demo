<template>
    <TabContent :is-active="isActive">
        export options
    </TabContent>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from 'vue'
import TabContent from './TabContent.vue'
import { ToolbarTab } from '@/types/tab'

export default defineComponent({
    components: { TabContent },
    props: {
        currentTab: {
            type: String as PropType<ToolbarTab>,
            default: null,
        },
    },
    setup(props) {
        const isActive = computed(() => props.currentTab === ToolbarTab.EXPORT)

        return { isActive }
    },
})
</script>
