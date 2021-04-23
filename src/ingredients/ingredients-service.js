const IngredientsService = {
    getAllIngredients(knex) {
        return knex.from('ingredients').select('*')
    },
    getIngredientsByRecipe(knex, recipeid) {
        return knex.from('ingredients').select('*').where('recipeid', recipeid)
    },
    getById(knex, id) {
        return knex.from('ingredients').select('*').where('id', id).first()
    },
    insertIngredient(knex, newIngredient) {
        return knex.insert(newIngredient).into('ingredients').returning('*').then(rows => {return rows[0]})
    },
    deleteIngredient(knex, id) {
        return knex('ingredients').where('id', id).delete()
    }
}

module.exports = IngredientsService;
