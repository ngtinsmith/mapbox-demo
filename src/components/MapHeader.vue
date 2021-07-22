<template>
    <header class="header">
        <PopUp align="right">
            <template #toggle="{ onToggle }">
                <BaseButton
                    size="toggle"
                    title="User dropdown"
                    @click="onToggle"
                >
                    <i class="ri-user-fill ri-xl"></i>
                </BaseButton>
            </template>
            <template #content-heading>
                <p class="user-name">
                    John Doe
                </p>
            </template>
            <template #content>
                <BaseButton
                    align="left"
                    @click="createNew"
                >
                    New
                </BaseButton>
                <BaseButton
                    align="left"
                    @click="save"
                >
                    Save
                </BaseButton>
                <BaseButton
                    align="left"
                    @click="signOut"
                >
                    Sign out
                </BaseButton>
            </template>
        </PopUp>
    </header>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import BaseButton from './BaseButton.vue'
import PopUp from './PopUp.vue'

export default defineComponent({
    components: { BaseButton, PopUp },
    setup() {
        function createNew() {
            //
        }
        function save() {
            //
        }
        function signOut() {
            //
        }

        return { createNew, save, signOut }
    },
})
</script>

<style lang="scss" scoped>
.header {
    position: relative;
    z-index: 20;
    display: flex;
    justify-content: flex-end;
    background-color: #000;
    min-height: 2.5rem;
    padding: 0 0.5rem;

    .user-name {
        font-size: 0.875rem;
        font-weight: 600;
        color: #fff;
        margin: 0.5rem 1rem;
        white-space: nowrap;
    }
}
</style>
