# CookIt

Link to live app: [https://cook-it-rho.vercel.app](https://cook-it-rho.vercel.app)

![Alt text](https://github.com/laratarpley13/cook-it-api/blob/master/screenshots/explore-view.png)
![Alt text](https://github.com/laratarpley13/cook-it-api/blob/master/screenshots/recipe-view.png)
![Alt text](https://github.com/laratarpley13/cook-it-api/blob/master/screenshots/user-view.png)

## Motivation

Cooking is one of my biggest hobbies and in my free time you will often find me in the kitchen creating new recipes and experimenting in the kitchen. I've always wanted an easy way to share recipes I've created and recieve feedback in return without the pressure of maintaining and delivering recipe content through a blog of sorts. I created this app with the vision of creating a platform for other cooks to share their recipe creations and recieve constructive feedback in the form of pictures of the recipes attempts in turn, since food can be a very visual experience as well.

## How it works 

Users create accounts and post their own recipe creations for others to view. Users can browse through the explore page looking for different recipes to try, with the ability to sort by category and/or dietary needs. Once a user attempts someone else's recipe, in order to leave a comment they need to post a picture of their attempt in return, so we really get an idea of how the recipe turned out.

### Technologies Used

Client: React, ReactRouter, HTML, CSS

API: Node.js, Express, PostgreSQL

### API Used

Link to API repo: [https://github.com/laratarpley13/cook-it-api.git](https://github.com/laratarpley13/cook-it-api.git)

(NOTE: all routes except for account creation and initial sign-in require authorization)

/auth route: to allow user to sign-in to their account

/users route: post - to create a new user, get - to get specific user and their credentials, get all users - to get all users

/categories: get all categories, post category, delete category

/tags: get all tags, post new tag, delete tag

/recipes route: get all recipes, get recipe by user, get recipe by category, get individual recipe, delete individual recipe, post recipe

/ingredients: get all ingredients, get ingredients by recipe, post new ingredient, delete ingredient by id

/steps: get all steps, get steps by recipe, post new step, delete step by id

/comments: get all comments, get comments by recipe, get comments by recipe, delete comment

/recipetags: get all recipe-tag pairings, get recipe-tag pairings by recipe

### Features to include in future versions

Rating features to up-vote or down-vote recipes/comments

Sort recipes by date-added, likes, etc.

Ability to edit recipe ingredients/steps by drag and drop option

Confirm delete or cancel delete option when deleting recipes/comments
