export interface MapboxPlacesResponse {
    type: string
    query: string[]
    features: MapFeature[]
    attribution: string
}

export interface MapFeature {
    id?: string
    type: string
    place_type?: string[]
    relevance?: number
    properties: MapFeatureProperties
    text?: string
    place_name?: string
    bbox?: number[]
    center: MapCoordinates
    geometry: MapFeatureGeometry
    context?: PlaceFeatureContext[]
}

export interface MapFeatureProperties {
    wikidata?: string
    iconSize?: MapCoordinates
    message?: string
}

export interface MapFeatureGeometry {
    type: string
    coordinates: MapCoordinates
}

export type MapCoordinates = [number, number]

export interface PlaceFeatureContext {
    id: string
    wikidata: string
    text: string
    short_code?: string
}