import SpinnerGif from "./Spinner.gif";
import "./Spinner.scss";

const Spinner = () => {
	return (
		<div className="spinner">
			<img src={SpinnerGif} alt="Spinner" className="spinner__img" />
		</div>
	);
};

export default Spinner;
