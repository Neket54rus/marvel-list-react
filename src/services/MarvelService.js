import { useHttp } from "../hooks/http.hook"

const useMarvelService = () => {
	const { loading, error, request, clearError } = useHttp()

	const _apiBase = "https://gateway.marvel.com:443/v1/public/"
	const _apiKey = "apikey=00605de03a203a7a47f52a3da3e5e1c0"
	const _baseOffset = 210

	const getAllCharacters = async (offset = _baseOffset) => {
		const res = await request(`${_apiBase}characters?limit=9&offset=${offset}&${_apiKey}`)

		return res.data.results.map(_transformCharacter)
	}

	const getCharacterById = async id => {
		const res = await request(`${_apiBase}characters/${id}?${_apiKey}`)

		return _transformCharacter(res.data.results[0])
	}

	const _transformCharacter = char => {
		if (char.description === "") {
			char.description = "There is no description for this character."
		}

		if (char.description.length >= 211) {
			char.description = char.description.substr(0, 210) + "..."
		}

		return {
			id: char.id,
			name: char.name,
			description: char.description,
			image: char.thumbnail.path + "." + char.thumbnail.extension,
			homepage: char.urls[0].url,
			wiki: char.urls[1].url,
			comics: char.comics.items.map(item => item.name),
		}
	}

	const getAllComics = async offset => {
		const res = await request(`${_apiBase}comics?limit=8&offset=${offset}&${_apiKey}`)

		return res.data.results.map(_transformComics)
	}

	const getComics = async id => {
		const res = await request(`${_apiBase}comics/${id}?${_apiKey}`)

		return _transformComics(res.data.results[0])
	}

	const _transformComics = comics => {
		if (comics.prices[0].price === 0) {
			comics.prices[0].price = "NOT AVAILABLE"
		} else {
			comics.prices[0].price = `${comics.prices[0].price}$`
		}

		return {
			id: comics.id,
			title: comics.title,
			price: comics.prices[0].price,
			image: `${comics.thumbnail.path}.${comics.thumbnail.extension}`,
			description: comics.description || "There is no description",
			pageCount: comics.pageCount
				? `${comics.pageCount}`
				: "No information about the number of pages",
			language: comics.textObjects.language || "en-us",
		}
	}

	return {
		loading,
		error,
		getAllCharacters,
		getCharacterById,
		getAllComics,
		getComics,
		clearError,
	}
}

export default useMarvelService
