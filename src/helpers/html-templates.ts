export const stringToHtml = (str: string): DocumentFragment =>
    document.createRange().createContextualFragment(str)
