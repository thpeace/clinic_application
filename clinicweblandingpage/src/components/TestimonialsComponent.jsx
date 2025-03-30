import PropTypes from "prop-types";
import { ImageComponent } from '../components/ImageComponent';

export const TestimonialsComponent = ({ imageSrc, altText, name, text, className }) => {
    return (
        <div className={`flex-col items-center p-6 space-y-6 rounded-lg bg-veryLightGray md:w-1/3 ${className}`}>
            <ImageComponent className="w-16 -mt-14" imageSrc={imageSrc} altText={altText} />
            <h5 className="text-lg font-bold">{name}</h5>
            <p className="text-sm text-darkGrayishBlue">
                {text}
            </p>
        </div>
    )
}

TestimonialsComponent.propTypes = {
    imageSrc: PropTypes.string,
    altText: PropTypes.string,
    name: PropTypes.string,
    text: PropTypes.string,
    className: PropTypes.string
}
