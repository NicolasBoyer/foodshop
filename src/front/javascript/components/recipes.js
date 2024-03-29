import { html, render } from '../thirdParty/litHtml.js'
import { Utils } from '../classes/utils.js'
import { Caches } from '../classes/caches.js'

export default class Recipes extends HTMLElement {
	#savedRecipes
	#recipes

	static get observedAttributes () { return ['choiceMode'] }

	get choiceMode () {
		return this.getAttribute('choiceMode')
	}

	set choiceMode (pValue) {
		if (pValue) this.setAttribute('choiceMode', pValue)
		else this.removeAttribute('choiceMode')
	}

	async connectedCallback () {
		this.#savedRecipes = await this.#getRecipes()
		this.#search()
		this.querySelector('input').addEventListener('keyup', (pEvent) => this.#search(pEvent.target.value))
	}

	attributeChangedCallback (name, oldValue, newValue) {
		if ((name === 'choiceMode') && oldValue !== newValue) this.#render()
	}

	async #getRecipes () {
		const recipes = Caches.get('recipes') || await Utils.request('/db', 'POST', { body: '{ "getRecipes": "" }' })
		Caches.set('recipes', recipes)
		return recipes
	}

	async #removeRecipe (pRecipe) {
		Utils.confirm(html`<h3>Voulez-vous vraiment supprimer ?</h3>`, async () => {
			this.#savedRecipes = await Utils.request('/db', 'POST', { body: `{ "removeRecipe": "${pRecipe._id}" }` })
			Caches.set('recipes', this.#savedRecipes)
			this.#search()
			Utils.toast('success', 'Recette supprimée')
		})
	}

	#search (pValue) {
		this.#recipes = (pValue && Array.isArray(this.#savedRecipes) ? this.#savedRecipes.filter((pRecipe) => pRecipe.title.toLowerCase().includes(pValue.toLowerCase())) : !Array.isArray(this.#savedRecipes) && Object.keys(this.#savedRecipes).length ? [this.#savedRecipes] : this.#savedRecipes).sort((a, b) => a.title.localeCompare(b.title))
		this.#render()
	}

	#render () {
		let choices = []
		render(html`
			${!this.choiceMode ? html`<h2>Liste des recettes</h2>` : ''}
			<label>
				<input type="search" name="search" placeholder="Rechercher"/>
			</label>
			<aside>
				<nav>
					<ul>
						${!this.#recipes.length ? html`
							<li>Aucun résultat</li>` : this.#recipes.map(
								(pRecipe) => html`
									<li>
										${this.choiceMode ? html`
											<label for="${pRecipe.slug}">
												<input type="${this.choiceMode}" id="${pRecipe.slug}" name="${this.choiceMode === 'checkbox' ? pRecipe.slug : 'recipe'}" value="${pRecipe.title}" @change="${(pEvent) => {
													const value = pRecipe._id
													if (pEvent.target.checked) choices.push(value)
													else choices = choices.filter((pChoice) => pChoice !== value)
													let detail = { choices }
													if (this.choiceMode === 'radio') {
														detail = { ...detail, title: pRecipe.title }
													}
													document.body.dispatchEvent(new CustomEvent('modalConfirm', { detail }))
												}}">
												${pRecipe.title}
											</label>
										` : html`
											<div>
												<span>${pRecipe.title}</span>
												<fs-link role="button" class="edit" href="/app/recipe/edit/${pRecipe.slug}">
													<svg class="edit">
														<use href="#edit"></use>
													</svg>
													<span>Éditer</span>
												</fs-link>
												<button type="button" class="remove" @click="${() => this.#removeRecipe(pRecipe)}">
													<svg class="remove">
														<use href="#remove"></use>
													</svg>
													<span>Supprimer</span>
												</button>
											</div>
											<div class="ingredients">
												${pRecipe.ingredients?.map((pIngredient, pIndex) => pIngredient.title + (pRecipe.ingredients.length - 1 === pIndex ? '' : ', '))}
											</div>
										`}
									</li>
								`
						)}
					</ul>
				</nav>
			</aside>
		`, this)
	}
}
