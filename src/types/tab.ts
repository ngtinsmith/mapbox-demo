export enum MapToolbarTab {
    SEARCH = 'search',
    ADD = 'add',
    EXPORT = 'export',
}

export interface Tab<T = MapToolbarTab> {
    type: T
    isActive: boolean
}
