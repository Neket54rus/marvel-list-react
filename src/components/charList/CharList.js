import React from "react"
import PropTypes from "prop-types"

import Spinner from "../Spinner/Spinner"
import ErrorMessage from "../errorMessage/errorMessage"
import useMarvelService from "../../services/MarvelService"
import "./charList.scss"

const CharList = (props) => {
	const [charList, setCharList] = React.useState([]),
		[newItemLoading, setNewItemLoading] = React.useState(false),
		[offset, setOffset] = React.useState(210),
		[charEnded, setCharEnded] = React.useState(false)

	const {loading, error, getAllCharacters} = useMarvelService()

	React.useEffect(() => {
		onRequest(offset, true)
	}, [])

	const onRequest = (offset, initial) => {
		initial ? setNewItemLoading(false) : setNewItemLoading(true)
		getAllCharacters(offset).then(onCharListLoaded)
	}

	const onCharListLoaded = (char) => {
		let ended = false
		if (char.length < 9) {
			ended = true
		}

		setCharList(charList => [...charList, ...char])
		setNewItemLoading(false)
		setOffset(offset => offset + 9)
		setCharEnded(ended)
	}

	const itemList = React.useRef([])

	const setActive = (id) => {
		itemList.current.forEach((item) => item.classList.remove("char__item_selected"))
		itemList.current[id].classList.add("char__item_selected")
	}

	const renderItems = (arr) => {			
		const { onCharSelected, data } = props
		const list = arr.map((char, index) => {
			let styles = null
			if (char.image.indexOf("image_not_available") !== -1) {
				styles = {
					objectFit: "unset",
				}
			}
			return (
				<li
					ref={el => itemList.current[index] = el}
					onClick={() => {
						onCharSelected(char.id)
						setActive(index)
					}}
					key={char.id}
					className={`char__item`}
				>
					<img style={styles} src={char.image} alt={char.name} />
					<div className="char__name">{char.name} </div>
				</li>
			)
		})

		return (
			<ul className='char__grid'>
				{list}
			</ul>
		)
	}

	const items = renderItems(charList)
	const errorMessage = error ? <ErrorMessage /> : null
	const spinner = loading && !newItemLoading ? <Spinner /> : null

	return (
		<div className="char__list">
			{errorMessage}
			{spinner}
			{items}
			<button
				onClick={() => onRequest(offset)}
				className="button button__main button__long"
				disabled={newItemLoading}
				style={charEnded ? { display: "none" } : null}
			>
				<div className="inner">load more</div>
			</button>
		</div>
	)
}

CharList.propTypes = {
	onCharSelected: PropTypes.func,
}

export default CharList
