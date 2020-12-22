import React, { useState, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import VisibilitySensor from 'react-visibility-sensor';

const ProgressiveImage = ({ render, uri, placeholder, initialBlur, timingFunction, transitionTime }) => {
	const [blur, setBlur] = useState(initialBlur);
	const [src, setSrc] = useState(
		'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAAEAAQMAAABmvDolAAAAA1BMVEXMzMzKUkQnAAAAH0lEQVRoQ+3BAQ0AAADCoPdPbQ43oAAAAAAAAAAAvg0hAAABy+M9HgAAAABJRU5ErkJggg=='
	);

	const fetch = useCallback(() => {
		const image = new Image();
		image.src = uri;
		image.addEventListener(
			'load',
			() => {
				setSrc(uri);
				setBlur(0);
			},
			false
		);
	}, [uri]);

	const getStyle = () => {
		return {
			filter: `blur(${blur}px)`,
			transition: `filter ${transitionTime}ms ${timingFunction}`,
		};
	};
	
	useEffect(()=>{
		setSrc(uri);
	}, [uri]);

	return (
		<VisibilitySensor offset={{ bottom: -300, top: -300, left: -300, right: -300 }} partialVisibility={true}>
			{({ isVisible }) => {
				if (isVisible && blur) {
					setSrc(placeholder);
					fetch();
				}

				return render(src, getStyle());
			}}
		</VisibilitySensor>
	);
};

ProgressiveImage.defaultProps = {
	transitionTime: 500,
	timingFunction: 'ease',
	initialBlur: 5,
};

ProgressiveImage.propTypes = {
	transitionTime: PropTypes.number,
	timingFunction: PropTypes.string,
	initialBlur: PropTypes.number,
	uri: PropTypes.string.isRequired,
	placeholder: PropTypes.string.isRequired,
};

export default ProgressiveImage;
