import { Utils } from './utils.js'
import { mimetype } from './server.js'
import Database from './database.js'

export default class Routes {
	constructor (pServer) {
		pServer.get('/', async (req, res) => {
			res.end(await Utils.fragments('home.html', 'home'))
		})

		pServer.get('/recipe/add', async (req, res) => {
			res.end(await Utils.fragments('recipe.html', 'recipe', 'Les recettes'))
		})

		pServer.get('/recipe/edit/:id', async (req, res) => {
			res.end(await Utils.fragments('recipe.html', 'recipe', 'Les recettes'))
		})

		pServer.get('/recipes', async (req, res) => {
			res.end(await Utils.fragments('recipes.html', 'recipes', 'Les recettes'))
		})

		pServer.get('/ingredients', async (req, res) => {
			res.end(await Utils.fragments('ingredients.html', 'ingredients', 'Les ingrédients'))
		})

		pServer.get('/categories', async (req, res) => {
			res.end(await Utils.fragments('categories.html', 'categories', 'Les catégories'))
		})

		pServer.get('/ingredients.json', async (req, res) => {
			res.end(JSON.stringify(await Database.request({ getIngredients: {} })))
		}, mimetype.JSON)

		pServer.get('/lists.json', async (req, res) => {
			res.end(JSON.stringify(await Database.request({ getListIngredients: {} })))
		}, mimetype.JSON)

		pServer.get('/recipes.json', async (req, res) => {
			res.end(JSON.stringify(await Database.request({ getRecipes: {} })))
		}, mimetype.JSON)

		pServer.get('/categories.json', async (req, res) => {
			res.end(JSON.stringify(await Database.request({ getCategories: {} })))
		}, mimetype.JSON)

		pServer.post('/db', async (req, res) => {
			let body = ''
			req.on('data', (pChunk) => {
				body += pChunk
			})
			req.on('end', async () => res.end(JSON.stringify(await Database.request(JSON.parse(body)))))
		})

		pServer.post('/auth', async (req, res) => {
			let body = ''
			req.on('data', (pChunk) => {
				body += pChunk
			})
			req.on('end', async () => {
				const json = JSON.parse(body)
				const credentials = `${json.id}:${json.password}`
				if (await Database.auth(credentials)) res.writeHead(200, { 'Set-Cookie': `_ma=${Utils.crypt(credentials)}; expires=Tue, 19 Jan 2038 03:14:07 GMT` })
				res.end(JSON.stringify('{}'))
			})
		})
	}
}
