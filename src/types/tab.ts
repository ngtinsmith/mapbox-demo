export enum MapToolbarTab {
    SEARCH = 'search',
    ADD = 'add',
    EXPORT = 'export',
}

export enum TabComponentStyle {
    ICON = 'icon',
    LABEL = 'label',
    LAYER = 'layer',
}

export interface Tab<T = MapToolbarTab> {
    type: T
    isActive: boolean
}
