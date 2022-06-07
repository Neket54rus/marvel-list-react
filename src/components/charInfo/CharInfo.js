import React from "react";
import PropTypes from "prop-types";

import useMarvelService from "../../services/MarvelService";
import Spinner from "../Spinner/Spinner";
import ErrorMessage from "../errorMessage/errorMessage";
import Skeleton from "../skeleton/Skeleton";
import "./charInfo.scss";

const CharInfo = (props) => {
	const [char, setChar] = React.useState(null)

	const {loading, error, getCharacterById, clearError} = useMarvelService()

	React.useEffect(() => {
		updateChar()
	}, [props.charId])

	const updateChar = () => {
		clearError()

		const { charId } = props;

		if (!charId) {
			return;
		}

		getCharacterById(charId).then(onCharLoaded)
	};

	const onCharLoaded = (char) => {
		setChar(char)
	}

	const sceleton = char || loading || error ? null : <Skeleton />;
	const errorMessage = error ? <ErrorMessage /> : null;
	const spinner = loading ? <Spinner /> : null;
	const content = !error && !loading && char ? <View char={char} /> : null;

	return (
		<div className="char__info">
			{sceleton}
			{errorMessage}
			{spinner}
			{content}
		</div>
	);
}

const View = ({ char }) => {
	let comics;
	let styles = null;

	if (char.comics.length === 0) {
		comics = "There are no comics for this character.";
	} else {
		comics = char.comics.map((item, index) => {
			// if (index > 10) {
			// 	return;
			// }
			return (
				<li key={index} className="char__comics-item">
					{item}
				</li>
			);
		});
	}

	if (char.image.indexOf("image_not_available") !== -1) {
		styles = {
			objectFit: "contain",
		};
	}
	return (
		<>
			<div className="char__basics">
				<img style={styles} src={char.image} alt={char.name} />
				<div>
					<div className="char__info-name">{char.name}</div>
					<div className="char__btns">
						<a href={char.homepage} className="button button__main">
							<div className="inner">homepage</div>
						</a>
						<a href={char.wiki} className="button button__secondary">
							<div className="inner">Wiki</div>
						</a>
					</div>
				</div>
			</div>
			<div className="char__descr">{char.description}</div>
			<div className="char__comics">Comics:</div>
			<ul className="char__comics-list">{comics}</ul>
		</>
	);
};

CharInfo.propTypes = { charId: PropTypes.number };

export default CharInfo;
