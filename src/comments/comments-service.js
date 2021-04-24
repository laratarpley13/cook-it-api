const CommentsService = {
    getAllComments(knex) {
        return knex.from('comments').select('*')
    },
    getCommentsByRecipe(knex, recipeid) {
        return knex.from('comments').select('*').where('recipeid', recipeid)
    },
    getCommentsByUser(knex, userid) {
        return knex.from('comments').select('*').where('userid', userid)
    },
    getById(knex, id) {
        return knex.from('comments').select('*').where('id', id).first()
    },
    insertComment(knex, newComment) {
        return knex.insert(newComment).into('comments').returning('*').then(rows => {return rows[0]})
    },
    deleteComment(knex, id) {
        return knex('comments').where('id', id).delete()
    }
}

module.exports = CommentsService;
