import React from "react"
import { Link } from "react-router-dom"

import useMarvelService from "../../services/MarvelService"
import Spinner from "../Spinner/Spinner"
import ErrorMessage from "../errorMessage/errorMessage"

import "./comicsList.scss"

const ComicsList = () => {
	const [comics, setComics] = React.useState([]),
		[offset, setOffset] = React.useState(210),
		[newItemLoading, setNewItemLoading] = React.useState(false),
		[comicsEnded, setComicsEnded] = React.useState(false)

	const { loading, error, getAllComics } = useMarvelService()

	React.useEffect(() => {
		getComics(offset, true)
	}, [])

	const getComics = (offset, initial) => {
		initial ? setNewItemLoading(false) : setNewItemLoading(true)
		getAllComics(offset).then(onComicsListLoaded)
	}

	const onComicsListLoaded = list => {
		let ended = false
		if (list.length < 8) {
			ended = true
		}

		setComics(comics => [...comics, ...list])
		setOffset(offset => offset + 8)
		setNewItemLoading(false)
		setComicsEnded(ended)
	}

	const renderItems = arr => {
		const list = arr.map((item, index) => {
			const styles =
				item.image.indexOf("image_not_available") !== -1 ? { objectFit: "contain" } : null
			return (
				<li key={index} className="comics__item">
					<Link to={`/comics/${item.id}`}>
						<img
							style={styles}
							src={item.image}
							alt="ultimate war"
							className="comics__item-img"
						/>
						<div className="comics__item-name">{item.title}</div>
						<div className="comics__item-price">{item.price}</div>
					</Link>
				</li>
			)
		})

		return <ul className="comics__grid">{list}</ul>
	}

	const items = renderItems(comics)
	const spinner = loading && !newItemLoading ? <Spinner /> : null
	const errorMessage = error ? <ErrorMessage /> : null
	return (
		<div className="comics__list">
			{spinner}
			{errorMessage}
			{items}
			<button
				disabled={newItemLoading}
				onClick={() => getComics(offset)}
				className="button button__main button__long"
			>
				<div className="inner">load more</div>
			</button>
		</div>
	)
}

export default ComicsList
