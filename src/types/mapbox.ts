LangL

export interface PlaceFeatureContext {
    id: string
    wikidata: string
    text: string
    short_code?: string
}

export interface MapboxPlaceFeature {
    id: string
    type: string
    place_type: string[]
    relevance: number
    properties: { wikidata: string }
    text: string
    place_name: string
    bbox: number[]
    center: number[]
    geometry: {
        type: string
        coordinates: [number, number]
    }
    context: PlaceFeatureContext[]
}

export interface MapboxPlacesResponse {
    type: string
    query: string[]
    features: MapboxPlaceFeature[]
    attribution: string
}
