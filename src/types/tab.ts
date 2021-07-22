export enum MapToolbarTab {
    SEARCH = 'search',
    ADD = 'add',
    EXPORT = 'export',
    SCREENSHOT = 'screenshot',
    LABEL = 'label',
}

export enum TabComponentStyle {
    ICON = 'icon',
    LABEL = 'label',
    LAYER = 'layer',
    SCREENSHOT = 'screenshot',
}

export interface Tab<T = MapToolbarTab> {
    type: T
    isActive: boolean
}
