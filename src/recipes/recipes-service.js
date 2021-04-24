const RecipesService = {
    getAllRecipes(knex) {
        return knex.from('recipes').select('*')
    },
    getRecipesByUser(knex, userid) {
        return knex.from('recipes').select('*').where('userid', userid)
    },
    getRecipesByCategory(knex, categoryid) {
        return knex.from('recipes').select('*').where('categoryid', categoryid)
    },
    getById(knex, id) {
        return knex.from('recipes').select('*').where('id', id).first()
    },
    insertRecipe(knex, newRecipe) {
        return knex.insert(newRecipe).into('recipes').returning('*').then(rows => {return rows[0]})
    },
    deleteRecipe(knex, id) {
        return knex('recipes').where('id', id).delete()
    }
}

module.exports = RecipesService