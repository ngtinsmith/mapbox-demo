<template>
    <div :class="classes">
        <slot />
    </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'

export default defineComponent({
    props: {
        isActive: {
            type: Boolean,
            default: false,
        },
    },
    setup(props) {
        const classes = computed(() => [
            'tab-content',
            { active: props.isActive },
        ])

        return { classes }
    },
})
</script>

<style lang="scss" scoped>
.tab-content {
    display: none;
    flex-direction: column;
    border: 1px solid magenta;

    &.active {
        display: flex;
    }
}
</style>
