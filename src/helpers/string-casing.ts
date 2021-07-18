/**
 * Transform strings to camelCase
 *
 * input: `--the_quick brown-fox_jumps`
 * match: [ "the", "quick", "brown", "fox", "jumps" ]
 */
export const toCamelCase = (str: string): string => {
    const regex = /[a-zA-Z]+[^\s_-]/g
    const camelCased = str
        .match(regex)
        ?.map((str, i) => {
            return i > 0 ? str.charAt(0).toUpperCase() + str.slice(1) : str
        })
        .join('')

    return camelCased ?? str
}
