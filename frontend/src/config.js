

const truncateDescriptionHelper = (description) => {
    const words = description.split(' ')
    return words.length > 25 ? words.slice(0, 25).join(' ') + '...' : description
}

export {truncateDescriptionHelper}
