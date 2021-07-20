export const capitalizeSingle = (str: string): string =>
    str.charAt(0).toUpperCase() + str.slice(1)

export const capitalize = (str: string): string => {
    if (typeof str !== 'string') return ''

    return str.includes('-')
        ? str
              .split('-')
              .map(w => capitalizeSingle(w))
              .join('')
        : capitalizeSingle(str)
}
