function makeCommentsArray() {
    return [
        {
            id: 1,
            userid: 2,
            recipeid: 1,
            comment: "A Test",
            imgurl: "https://i.imgur.com/Qa8cIZdb.jpg"
        },
        {
            id: 2,
            userid: 2,
            recipeid: 2,
            comment: "A Test",
            imgurl: "https://i.imgur.com/Qa8cIZdb.jpg"
        },
        {
            id: 3,
            userid: 1,
            recipeid: 1,
            comment: "A Test",
            imgurl: "https://i.imgur.com/Qa8cIZdb.jpg"
        },
        {
            id: 4,
            userid: 1,
            recipeid: 2,
            comment: "A Test",
            imgurl: "https://i.imgur.com/Qa8cIZdb.jpg"
        },
    ]
}

module.exports = {
    makeCommentsArray,
}