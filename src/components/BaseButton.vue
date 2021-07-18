<template>
    <component :is="component" :target="useTarget">
        <slot />
    </component>
</template>

<script lang="ts">
import {
    AnchorTarget,
    ButtonAlignment,
    ButtonSize,
    ButtonType,
} from '@/types/buttons'
import { Colors } from '@/types/colors'
import { computed, defineComponent, PropType } from 'vue'

export default defineComponent({
    props: {
        size: {
            type: String as PropType<ButtonSize>,
            default: ButtonSize.AUTO,
        },
        align: {
            type: String as PropType<ButtonAlignment>,
            default: ButtonAlignment.CENTER,
        },
        color: {
            type: String as PropType<Colors>,
            default: Colors.BLACK,
        },
        href: {
            type: String,
            default: null,
        },
        target: {
            type: String as PropType<AnchorTarget>,
            default: AnchorTarget.BLANK,
        },
    },
    setup(props) {
        const component = computed(() => {
            return props.href?.length > 0
                ? ButtonType.ANCHOR
                : ButtonType.BUTTON
        })
        const classes = computed(() => [
            'v-button',
            `size-${props.size}`,
            `align-${props.align}`,
        ])
        const isAnchor = computed(() => component.value === ButtonType.ANCHOR)
        const useTarget = computed(() => (isAnchor.value ? props.target : null))

        return { component, classes, isAnchor, useTarget }
    },
})
</script>

<style lang="scss" scoped>
.v-button {
    display: flex;
    align-items: center;
    height: 2.5rem;

    /* Sizes */

    &.size-auto {
        width: auto;
    }

    &.size-full-width {
        width: auto;
    }

    &.size-icon {
        width: auto;
    }

    &.size-toggle {
        width: auto;
    }

    /* Alignments */

    &.align-center {
        justify-content: center;
    }

    &.align-left {
        justify-content: flex-start;
    }

    &.align-right {
        justify-content: flex-end;
    }

    &.align-space-between {
        justify-content: space-between;
    }
}
</style>
