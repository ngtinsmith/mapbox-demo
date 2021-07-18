<template>
    <svg
        xmlns="http://www.w3.org/2000/svg"
        :width="width"
        :height="height"
        :viewBox="viewBox"
        :aria-labelledby="iconId"
        role="presentation"
    >
        <title :id="iconId" lang="en">{{ iconName }}</title>
        <g :fill="fillColor">
            <slot :fill-color="fillColor" :stroke-color="strokeColor" />
        </g>
    </svg>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { toCamelCase } from '@/helpers/string-casing'

export default defineComponent({
    props: {
        iconName: {
            type: String,
            default: 'icon',
        },
        width: {
            type: [Number, String],
            default: 14,
        },
        height: {
            type: [Number, String],
            default: 14,
        },
        viewBox: {
            type: String,
            default: '0 0 20 20',
        },
        fillColor: {
            type: String,
            default: 'currentColor',
        },
        strokeColor: {
            type: String,
            default: 'currentColor',
        },
    },
    setup(props) {
        // Convert name to camelCase for element ID and aria props
        const iconId = computed(() =>
            props.iconName.includes(' ')
                ? toCamelCase(props.iconName)
                : props.iconName
        )

        return {
            iconId,
        }
    },
})
</script>

<style lang="scss" scoped>
svg {
    flex-shrink: 0;
}
</style>
