export enum ToolbarTab {
    SEARCH = 'search',
    ADD = 'add',
    EXPORT = 'export',
    SCREENSHOT = 'screenshot',
    LABEL = 'label',
    ICON = 'icon',
    LAYER = 'layer',
}

export interface Tab<T = ToolbarTab> {
    type: T
    isActive: boolean
}
