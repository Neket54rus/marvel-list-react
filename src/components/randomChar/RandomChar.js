import React, { useEffect } from "react";
import Spinner from "../Spinner/Spinner";
import ErrorMessage from "../errorMessage/errorMessage";
import useMarvelService from "../../services/MarvelService";

import "./randomChar.scss";
import mjolnir from "../../resources/img/mjolnir.png";

const RandomChar = () => {
	const [char, setChar] = React.useState({});
	const {loading, error, getCharacterById, clearError} = useMarvelService();

	useEffect(() => {
		updateCharacter();

		const timerId = setInterval(updateCharacter, 60000);

		return () => {
			clearInterval(timerId);
		};
	}, []);

	const onCharLoaded = (char) => {
		setChar(char);
	};

	const updateCharacter = () => {
		clearError()
		
		const id = Math.floor(Math.random() * (1011400 - 1011000) + 1011000);
		getCharacterById(id).then(onCharLoaded);
	};

	const onRandomCharacter = () => {
		updateCharacter();
	};

	const errorMessage = error ? <ErrorMessage /> : null;
	const spinner = loading ? <Spinner /> : null;
	const content = !error && !loading ? <View char={char} /> : null;

	return (
		<div className="randomchar">
			{errorMessage}
			{spinner}
			{content}
			<div className="randomchar__static">
				<p className="randomchar__title">
					Random character for today!
					<br />
					Do you want to get to know him better?
				</p>
				<p className="randomchar__title">Or choose another one</p>
				<button className="button button__main">
					<div onClick={onRandomCharacter} className="inner">
						try it
					</div>
				</button>
				<img src={mjolnir} alt="mjolnir" className="randomchar__decoration" />
			</div>
		</div>
	);
};

const View = ({ char }) => {
	const { image, name, description, homepage, wiki } = char;

	let styles = null;
	if (image === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
		styles = {
			objectFit: "contain",
		};
	}

	return (
		<div className="randomchar__block">
			<img style={styles} src={image} alt="Random character" className="randomchar__img" />
			<div className="randomchar__info">
				<p className="randomchar__name">{name}</p>
				<p className="randomchar__descr">{description}</p>

				<div className="randomchar__btns">
					<a href={homepage} className="button button__main">
						<div className="inner">homepage</div>
					</a>
					<a href={wiki} className="button button__secondary">
						<div className="inner">Wiki</div>
					</a>
				</div>
			</div>
		</div>
	);
};

export default RandomChar;
