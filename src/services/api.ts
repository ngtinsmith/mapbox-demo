import axios from 'axios'
import { GEOCODING_ENDPOINT, ENDPOINT_PLACES } from '@/constants/api'
import { MapboxPlacesResponse } from '@/types/mapbox'

export const searchLocation = async (
    keyword: string
): Promise<MapboxPlacesResponse> => {
    const transformedKeyword = encodeURIComponent(keyword)
    const mapBoxToken = process.env.VUE_APP_MAPBOX_TOKEN

    const url = `${GEOCODING_ENDPOINT}/v5/${ENDPOINT_PLACES}/${transformedKeyword}.json?access_token=${mapBoxToken}`
    const result = await axios.get(url)

    return result.data as MapboxPlacesResponse
}
