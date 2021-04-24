const StepsService = {
    getAllSteps(knex) {
        return knex.from('steps').select('*')
    },
    getStepsByRecipe(knex, recipeid) {
        return knex.from('steps').select('*').where('recipeid', recipeid)
    },
    getById(knex, id) {
        return knex.from('steps').select('*').where('id', id).first()
    },
    insertStep(knex, newStep) {
        return knex.insert(newStep).into('steps').returning('*').then(rows => {return rows[0]})
    },
    deleteStep(knex, id) {
        return knex('steps').where('id', id).delete()
    }
}

module.exports = StepsService;