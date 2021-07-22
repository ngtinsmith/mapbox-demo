<template>
    <div class="form-field">
        <label v-text="label" />
        <input
            v-model="value"
            :placeholder="placeholder"
            @keydown.enter="onEnterSubmit"
        />
    </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'

export default defineComponent({
    props: {
        modelValue: {
            type: String,
            default: '',
        },
        label: {
            type: String,
            default: 'Field',
        },
        placeholder: {
            type: String,
            default: 'Field value',
        },
    },
    emits: ['update:modelValue', 'enter-submit'],
    setup(props, { emit }) {
        const value = computed({
            get: () => props.modelValue,
            set: (value: string) => emit('update:modelValue', value),
        })

        function onEnterSubmit(e: Event) {
            const target = e.target as HTMLInputElement
            emit('enter-submit', target.value)
        }

        return { value, onEnterSubmit }
    },
})
</script>

<style lang="scss" scoped>
.form-field {
    display: flex;
    flex-direction: column;
    padding: 0.5rem 0;
    border-bottom: 1px solid #fff;

    label {
        color: #fff;
        text-transform: capitalize;
        font-weight: 600;
        margin-bottom: 0.25rem;
    }

    input {
        border: 0;
        background-color: unset;
        color: #fff;
        outline: 0;
    }
}
</style>
