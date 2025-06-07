import React from 'react';
import { PropTypes } from 'prop-types';

import LazyLoadComponent from './LazyLoadComponent.jsx';

class LazyLoadImage extends React.Component {
	constructor(props) {
		super(props);

		this.imgRef = props.ref ?? React.createRef();

		this.state = {
			loaded: false,
		};
	}

	componentDidMount() {
		if (this.imgRef
			&& this.imgRef.current
			&& this.imgRef.current.complete
			&& !this.state.loaded
		) {
			this.setState({
				loaded: true
			})
		}
	}

	onImageLoad() {
		if (this.state.loaded) {
			return null;
		}

		return e => {
			// We keep support for afterLoad for backwards compatibility,
			// but `onLoad` is the preferred prop.
			this.props.onLoad(e);
			this.props.afterLoad();

			this.setState({
				loaded: true,
			});
		};
	}

	getImg() {
		const {
			afterLoad,
			beforeLoad,
			delayMethod,
			delayTime,
			effect,
			placeholder,
			placeholderSrc,
			scrollPosition,
			threshold,
			useIntersectionObserver,
			visibleByDefault,
			wrapperClassName,
			wrapperProps,
			...imgProps
		} = this.props;

		return <img {...imgProps} onLoad={this.onImageLoad()} ref={this.imgRef} />;
	}

	getLazyLoadImage() {
		const {
			beforeLoad,
			className,
			delayMethod,
			delayTime,
			height,
			placeholder,
			scrollPosition,
			style,
			threshold,
			useIntersectionObserver,
			visibleByDefault,
			width,
		} = this.props;

		return (
			<LazyLoadComponent
				beforeLoad={beforeLoad}
				className={className}
				delayMethod={delayMethod}
				delayTime={delayTime}
				height={height}
				placeholder={placeholder}
				scrollPosition={scrollPosition}
				style={style}
				threshold={threshold}
				useIntersectionObserver={useIntersectionObserver}
				visibleByDefault={visibleByDefault}
				width={width}
			>
				{this.getImg()}
			</LazyLoadComponent>
		);
	}

	getWrappedLazyLoadImage(lazyLoadImage) {
		const {
			effect,
			height,
			placeholderSrc,
			width,
			wrapperClassName,
			wrapperProps,
		} = this.props;
		const { loaded } = this.state;

		const loadedClassName = loaded ? ' lazy-load-image-loaded' : '';
		const wrapperBackground =
			!placeholderSrc
				? {}
				: {
					backgroundImage: `url(${placeholderSrc})`,
					backgroundSize: '100% 100%',
				};

		const wrapperStyle = !!wrapperProps && "style" in wrapperProps ? wrapperProps.style : {};

		return (
			<span
				className={
					wrapperClassName +
					' lazy-load-image-background ' +
					effect +
					loadedClassName
				}
				style={{
					...wrapperBackground,
					color: 'transparent',
					display: 'inline-block',
					height: height,
					width: width,
					...wrapperStyle
				}}
				{...wrapperProps}
			>
				{lazyLoadImage}
			</span>
		);
	}

	render() {
		const {
			effect,
			placeholderSrc,
			visibleByDefault,
			wrapperClassName,
			wrapperProps,
			alwaysWrap
		} = this.props;

		const lazyLoadImage = this.getLazyLoadImage();
		const needsWrapper = alwaysWrap || ((effect || placeholderSrc) && !visibleByDefault);

		if (!needsWrapper && !wrapperClassName && !wrapperProps) {
			return lazyLoadImage;
		}

		return this.getWrappedLazyLoadImage(lazyLoadImage);
	}
}

LazyLoadImage.propTypes = {
	onLoad: PropTypes.func,
	afterLoad: PropTypes.func, // Deprecated, use onLoad instead
	beforeLoad: PropTypes.func,
	delayMethod: PropTypes.string,
	delayTime: PropTypes.number,
	effect: PropTypes.string,
	placeholderSrc: PropTypes.string,
	threshold: PropTypes.number,
	useIntersectionObserver: PropTypes.bool,
	visibleByDefault: PropTypes.bool,
	wrapperClassName: PropTypes.string,
	wrapperProps: PropTypes.object,
	alwaysWrap: PropTypes.bool
};

LazyLoadImage.defaultProps = {
	onLoad: () => { },
	afterLoad: () => ({}), // Deprecated, use onLoad instead
	beforeLoad: () => ({}),
	delayMethod: 'throttle',
	delayTime: 300,
	effect: '',
	placeholderSrc: null,
	threshold: 100,
	useIntersectionObserver: true,
	visibleByDefault: false,
	wrapperClassName: '',
	alwaysWrap: false
};

export default LazyLoadImage;
