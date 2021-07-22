import { TextMarker } from '@/composables/use-text-marker'
import { stringToHtml } from '@/helpers/html-templates'

export interface CreateTextMarkerOptions {
    text: string
    onClick: (marker: TextMarker) => void
}

export const createMarkerElement = (
    mark: string,
    iconSize: [number, number],
    onClick?: () => void
): HTMLElement => {
    const [lng, lat] = iconSize
    const el = document.createElement('div')
    const svgFrag = stringToHtml(`<i class="${mark}"></i>`)

    el.classList.add('v-marker')
    el.setAttribute('title', mark.replace(/^(ri-)/, ''))
    onClick && el.addEventListener('click', onClick)

    Object.assign(el.style, {
        display: 'flex',
        width: `${lng}px`,
        height: `${lat}px`,
        fontSize: `${lng}px`, // for remix size
    })

    el.appendChild(svgFrag)

    return el
}

export const createRemoveMarkerElement = (
    onRemove: () => void
): HTMLElement => {
    const el = document.createElement('div')
    const removeBtnFragment = stringToHtml(`
        <button class="v-button" title="Remove marker">
            Remove marker <i class="ri-delete-bin-line ri-xl"></i>
        </button>
    `)

    removeBtnFragment
        .querySelector('button')
        ?.addEventListener('click', onRemove)
    el.appendChild(removeBtnFragment)

    return el
}

export const createTextMarkerElement = (
    options: CreateTextMarkerOptions
): HTMLElement => {
    const el = document.createElement('div')
    const textFrag = stringToHtml(`<p>${options.text}</p>`)

    el.classList.add('v-text-marker')
    el.addEventListener('click', () =>
        options.onClick({
            text: options.text,
            element: el,
        })
    )
    el.appendChild(textFrag)

    return el
}
