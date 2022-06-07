import React from "react"
import { useParams, Link } from "react-router-dom"

import useMarvelService from "../../services/MarvelService"
import Spinner from "../Spinner/Spinner"
import ErrorMessage from "../errorMessage/errorMessage"

import "./singleComicPage.scss"

const SingleComicPage = () => {
	const [comic, setComic] = React.useState({})
	const { comicId } = useParams()

	const { loading, error, getComics, clearError } = useMarvelService()

	React.useEffect(() => {
		updateComic()
	}, [comicId])

	const updateComic = () => {
		clearError()
		getComics(comicId).then(setComic)
	}

	const spinner = loading ? <Spinner /> : null
	const errorMessage = error ? <ErrorMessage /> : null
	const content = !loading && !error ? <View comic={comic} /> : null
	return (
		<>
			{spinner}
			{errorMessage}
			{content}
		</>
	)
}

const View = ({ comic }) => {
	const { image, title, description, pageCount, language, price } = comic

	return (
		<div className="single-comic">
			<img src={image} alt={title} className="single-comic__img" />
			<div className="single-comic__info">
				<h2 className="single-comic__name">{title}</h2>
				<p className="single-comic__descr">{description}</p>
				<p className="single-comic__descr">{pageCount} pages</p>
				<p className="single-comic__descr">Language: {language}</p>
				<div className="single-comic__price">{price}</div>
			</div>
			<Link to="/comics" className="single-comic__back">
				Back to all
			</Link>
		</div>
	)
}

export default SingleComicPage
