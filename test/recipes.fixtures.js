function makeRecipesArray() {
    return [
        {
            id: 1,
            userid: 1,
            categoryid: 1,
            title: "Test1",
            description: "A Test",
            imgurl: "https://i.imgur.com/Qa8cIZdb.jpg", 
            date_created: "1919-12-22T16:28:32.615Z"
        },
        {
            id: 2,
            userid: 2,
            categoryid: 2,
            title: "Test2",
            description: "A Test",
            imgurl: "https://i.imgur.com/Qa8cIZdb.jpg", 
            date_created: "1919-12-22T16:28:32.615Z"
        },
    ]
}

module.exports = {
    makeRecipesArray,
}