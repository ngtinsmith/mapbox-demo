import axios, { AxiosResponse } from 'axios'
import { GEOCODING_ENDPOINT, ENDPOINT_PLACES } from '@/constants/api'
import { MapboxPlacesResponse, MapboxStaticImageAPIProps } from '@/types/mapbox'

export const searchLocation = async (
    keyword: string
): Promise<MapboxPlacesResponse> => {
    const transformedKeyword = encodeURIComponent(keyword)
    const mapBoxToken = process.env.VUE_APP_MAPBOX_TOKEN

    const url = `${GEOCODING_ENDPOINT}/v5/${ENDPOINT_PLACES}/${transformedKeyword}.json?access_token=${mapBoxToken}`
    const result = await axios.get(url)

    return result.data as MapboxPlacesResponse
}

export const fetchStaticMapImage = async (
    options: MapboxStaticImageAPIProps
): Promise<Blob> => {
    const { lng, lat, zoom, bearing, width, height } = options
    const token = process.env.VUE_APP_MAPBOX_TOKEN

    const url = `https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/${lng},${lat},${zoom},${bearing}/${width}x${height}?access_token=${token}`

    const result: AxiosResponse = await axios({
        url,
        method: 'GET',
        responseType: 'blob',
    })

    return result.data
}
