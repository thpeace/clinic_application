import PropTypes from "prop-types";

export const ImageComponent = ({ imageSrc, altText, className, ...attrs }) => {
    return (
        <img src={imageSrc} alt={altText} className={`${className}`} {...attrs} />
    )
}

ImageComponent.propTypes = {
    imageSrc: PropTypes.string,
    altText: PropTypes.string,
    className: PropTypes.string
}