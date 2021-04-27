function makeIngredientsArray() {
    return [
        {
            id: 1,
            recipeid: 1,
            title: "Ing 1",
            amount: "1 pinch"
        },
        {
            id: 2,
            recipeid: 1,
            title: "Ing 2",
            amount: "1 pinch"
        },
        {
            id: 3,
            recipeid: 2,
            title: "Ing 1",
            amount: "1 pinch"
        },
        {
            id: 4,
            recipeid: 2,
            title: "Ing 2",
            amount: "1 pinch"
        },
    ]
}

module.exports = {
    makeIngredientsArray,
}