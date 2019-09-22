export const bemFactory = block => (element, modifier) => {
    let className = block

    if (element) className = className + '__' + element
    if (modifier) className = className + '--' + modifier

    return className
}
