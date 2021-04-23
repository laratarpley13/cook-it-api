const CategoriesService = {
    getAllCategories(knex) {
        return knex.from('categories').select('*')
    },
    getById(knex, id) {
        return knex.from('categories').select('*').where('id', id).first()
    },
    insertCategory(knex, newCategory) {
        return knex.insert(newCategory).into('categories').returning('*').then(rows => {return rows[0]})
    },
    deleteCategory(knex, id) {
        return knex('categories').where('id', id).delete()
    }
}

module.exports = CategoriesService;