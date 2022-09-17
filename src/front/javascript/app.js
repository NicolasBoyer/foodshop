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
import AnimatedSection from './components/animatedSection.js'
import Loader from './components/loader.js'
import LoadingBlock from './components/loadingBlock.js'

class App {
	// TODO images pour la page de home
	// TODO size dans recette (transformer size avec une unité)
	// TODO Liste des plats de la semaine
	// TODO Liste de ce qui est présent dans le congelé
	// TODO Choix pour activer les fonctionnalités
	// TODO différencier swipe et appui sur bouton comme quand on raye
	// TODO Bug si on choisi dans liste alors qu'un bouton est en dessous
	// TODO section animée pour gérer la page de présentation
	// TODO permettre qu'il existe plusieurs sessions différentes pour que plusieurs personnes puissent l'utiliser sans être sur le même compte
	// TODO permettre de rendre payant
	// TODO supprimer la possibilité de mettre un seul espace
	// TODO minifier et combiner les fichiers js clients dans app.js
	// TODO faire en sorte de mettre en cache certaines requetes pour ne pas à avoir les faire à chaque fois ...

	constructor () {
		this.setBackButton()
		Utils.helpers()
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

// TODO définir le js que si c utile ou plutot à charger en arrière plan
new App()
customElements.define('fs-loader', Loader)
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
customElements.define('fs-loading-block', LoadingBlock)
customElements.define('fs-animated-section', AnimatedSection)
