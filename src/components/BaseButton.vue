<template>
    <component
        :is="component"
        :class="classes"
        :target="useTarget"
        :title="title"
    >
        <slot />
    </component>
</template>

<script lang="ts">
import { Alignment } from '@/types/alignment'
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
            default: Colors.TRANSPARENT,
        },
        textColor: {
            type: String as PropType<Colors>,
            default: Colors.WHITE,
        },
        textAlign: {
            type: String as PropType<Alignment>,
            default: Alignment.CENTER,
        },
        href: {
            type: String,
            default: null,
        },
        target: {
            type: String as PropType<AnchorTarget>,
            default: AnchorTarget.BLANK,
        },
        title: {
            type: String,
            default: null,
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
            props.color,
            `text-${props.textColor}`,
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
    flex-shrink: 0;
    height: 2.5rem;
    white-space: nowrap;
    padding: 0.5rem 1rem;
    border: 0;

    /* Color */

    &.transparent {
        background-color: transparent;
    }

    &.black {
        background-color: #000;
    }

    &.white {
        background-color: #fff;
    }

    /* Text Color */

    &.text-black {
        color: #000;
    }

    &.text-white {
        color: #fff;
    }

    /* Sizes */

    &.size-auto {
        width: auto;
    }

    &.size-full-width {
        width: 100%;
    }

    &.size-icon {
        width: 1rem;
        height: 1rem;
        padding: 0;
    }

    &.size-toggle {
        width: 2.5rem;
        height: 2.5rem;
        padding: 0.5rem;
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
