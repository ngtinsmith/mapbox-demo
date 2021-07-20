<template>
    <TabContent :is-active="isActive">
        <div class="toolbar-actions">
            <BaseButton
                v-for="tab in addElementsTabs"
                :key="tab"
                :color="currentLocalTab === tab ? 'white' : 'black'"
                :text-color="currentLocalTab === tab ? 'black' : 'white'"
                size="toggle"
                :title="`${capitalize(tab)}s`"
                @click="changeTab(tab)"
            >
                <span style="font-size: 1.25rem; display: flex;">
                    <i
                        :class="isTab(tab)
                            ? 'ri-map-pin-2-fill'
                            : 'ri-text'"
                    />
                </span>
            </BaseButton>
        </div>

        <div class="toolbar-content">
            <TabContent :is-active="isTab('icon')">
                <div class="search-field">
                    <input
                        placeholder="Search icon"
                        :value="iconKeyword"
                        @input="searchIcon"
                    />
                </div>
                <div class="icons">
                    <BaseButton
                        v-for="icon in filteredIcons"
                        :key="icon"
                        color="black"
                        text-color="white"
                        size="toggle"
                        class="icon"
                        :title="icon.replace(/^(ri-)/, '')"
                        @click="addMark(icon)"
                    >
                        <span style="font-size: 24px; display: flex;">
                            <i :class="icon" />
                        </span>
                    </BaseButton>
                </div>
            </TabContent>
            <TabContent :is-active="isTab('text')">
                text
            </TabContent>
        </div>
    </TabContent>
</template>

<script lang="ts">
import { useTab } from '@/composables/use-tab'
import { remixIcons } from '@/constants/icons'
import { MapToolbarTab } from '@/types/tab'
import debounce from 'lodash/debounce'
import { capitalize, computed, defineComponent, PropType, ref } from 'vue'
import BaseButton from './BaseButton.vue'
import TabContent from './TabContent.vue'

export default defineComponent({
    components: { TabContent, BaseButton },
    props: {
        currentTab: {
            type: String as PropType<MapToolbarTab>,
            default: null,
        },
    },
    emits: ['mark'],
    setup(props, { emit }) {
        const isActive = computed(() => props.currentTab === MapToolbarTab.ADD)

        const iconKeyword = ref('')
        const icons = ref(remixIcons)
        const filteredIcons = computed(() =>
            icons.value.filter(icon =>
                icon.includes(iconKeyword.value.toLowerCase())
            )
        )
        const searchIcon = debounce(function (e) {
            iconKeyword.value = e.target.value
        }, 400)

        const {
            currentTab: currentLocalTab,
            changeTab,
            isTab,
        } = useTab<string>('icon')

        const addElementsTabs = computed((): string[] => {
            return ['icon', 'label']
        })

        function addMark(iconClass: string): void {
            emit('mark', iconClass)
        }

        return {
            isActive,
            addElementsTabs,
            currentLocalTab,
            changeTab,
            isTab,
            addMark,
            filteredIcons,
            iconKeyword,
            searchIcon,
            capitalize,
        }
    },
})
</script>

<style lang="scss" scoped>
.toolbar-actions {
    display: flex;
    border-bottom: 1px solid #fff;

    > :deep(*:not(:last-child)) {
        /* margin-right: 0.5rem; */
    }
}

.toolbar-content {
    background-color: #000;
    color: #fff;
}

.icons {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    max-height: 60vh;
    overflow-y: auto;
    padding: 0.5rem 1rem 1rem;

    > .icon {
        transition: 0.08s ease-out;
        border-radius: 0.25rem;

        &:hover {
            background-color: #fff;
            color: #000;
        }
    }
}

.search-field {
    padding: 0 1rem;
    background-color: #000;
    margin-bottom: 0.5rem;
    border-bottom: 1px solid #fff;

    input {
        height: 2.5rem;
        border: 0;
        background-color: unset;
        outline: 0;
        color: #fff;
    }
}
</style>
