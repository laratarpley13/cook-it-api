const TagsService = {
    getAllTags(knex) {
        return knex.from('tags').select('*')
    },
    getById(knex, id) {
        return knex.from('tags').select('*').where('id', id).first()
    },
    insertTag(knex, newTag) {
        return knex.insert(newTag).into('tags').returning('*').then(rows => {return rows[0]})
    },
    deleteTag(knex, id) {
        return knex('tags').where('id', id).delete()
    }
}

module.exports = TagsService;