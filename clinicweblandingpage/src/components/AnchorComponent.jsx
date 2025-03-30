import PropTypes from "prop-types";

export const AnchorComponent = ({ link, children, ...attrs }) => {
  return (
    <a href={link} {...attrs}>
      {children}
    </a>
  );
};

AnchorComponent.propTypes = {
  link: PropTypes.string,
  children: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
};
