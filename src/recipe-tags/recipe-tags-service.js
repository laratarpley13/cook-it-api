const RecipeTagsService = {
    getAllRecipeTags(knex) {
        return knex.from('recipetags').select('*')
    },
    getRecipeTagsByRecipe(knex, recipeid) {
        return knex.from('recipetags').select('*').where('recipeid', recipeid)
    },
    insertRecipeTag(knex, newRecipeTag) {
        return knex.insert(newRecipeTag).into('recipetags').returning('*').then(rows => {return rows[0]})
    },
    deleteRecipeTagsByRecipe(knex, recipeid) {
        return knex('recipetags').where('recipeid', recipeid).delete()
    }
}

module.exports = RecipeTagsService;
