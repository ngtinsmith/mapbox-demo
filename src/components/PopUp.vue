<template>
    <div :class="classes">
        <slot
            name="toggle"
            :on-toggle="toggleIsActive"
        />
        <div
            v-if="isActive"
            class="popup-menu"
        >
            <slot name="content-heading" />
            <slot name="content" />
        </div>
    </div>
</template>

<script lang="ts">
import { useToggle } from '@/composables/use-toggle'
import { Alignment } from '@/types/alignment'
import { computed, defineComponent, PropType } from 'vue'

enum PopUpAlignment {
    LEFT = 'left',
    RIGHT = 'right',
    TOP = 'top',
    BOTTOM = 'bottom',
    BOTTOM_LEFT = 'bottom-left',
    BOTTOM_RIGHT = 'bottom-right',
    BOTTOM_CENTER = 'bottom-center',
    RELATIVE_LEFT = 'relative-right',
    RELATIVE_RIGHT = 'relative-right',
}

export default defineComponent({
    props: {
        align: {
            type: String as PropType<Alignment>,
            default: Alignment.LEFT,
        },
    },
    setup(props) {
        const { isActive, toggleIsActive } = useToggle(true)
        const classes = computed(() => ['popup', `align-${props.align}`])

        return { classes, isActive, toggleIsActive }
    },
})
</script>

<style lang="scss" scoped>
.popup {
    position: relative;
    flex-shrink: 0;

    &.align-left {
        .popup-menu {
            left: 0.5rem;
        }
    }
    &.align-center {
        .popup-menu {
            left: 50%;
            transform: translateX(-50%);
        }
    }
    &.align-right {
        .popup-menu {
            right: 0.5rem;
        }
    }

    .popup-menu {
        display: flex;
        flex-direction: column;
        position: absolute;
        top: 3.5rem;
        background-color: #000;
        padding: 0.5rem 0;
    }
}
</style>
