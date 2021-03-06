import Toast from './components/toast.js'
import Propose from './components/propose.js'
import { Dom, Utils } from './utils.js'
import Confirm from './components/confirm.js'
import Recipes from './components/recipes.js'
import Ingredients from './components/ingredients.js'
import Recipe from './components/recipe.js'
import Lists from './components/lists.js'
import Header from './components/header.js'
import Login from './components/login.js'
import Categories from './components/categories.js'

class App {
	constructor () {
		this.setBackButton()
		Utils.confirm('', null, true)
		this.wakeLock()
	}

	async wakeLock () {
		let wakeLock = null
		const requestWakeLock = async () => {
			try {
				wakeLock = await navigator.wakeLock.request()
			} catch (err) {
				console.error(`${err.name}, ${err.message}`)
			}
		}
		document.addEventListener('visibilitychange', async () => {
			if (wakeLock !== null && document.visibilityState === 'visible') {
				await requestWakeLock()
			}
		})
		await requestWakeLock()
	}

	setBackButton () {
		if (location.pathname.split('/').filter((pPart) => pPart).length && history.length > 2) {
			const bd = Dom.newDom(document.querySelector('fs-header > div:first-child'))
			bd.elt('a', 'back').att('role', 'button').att('href', '#').listen('pointerup', () => history.back())
			bd.svg('back').up()
			bd.elt('span').text('Retour').up()
			bd.up()
		}
	}
}

customElements.define('fs-header', Header)
customElements.define('fs-toast', Toast)
customElements.define('fs-confirm', Confirm)
customElements.define('fs-propose', Propose)
customElements.define('fs-recipes', Recipes)
customElements.define('fs-recipe', Recipe)
customElements.define('fs-lists', Lists)
customElements.define('fs-ingredients', Ingredients)
customElements.define('fs-categories', Categories)
customElements.define('fs-login', Login)
new App()
