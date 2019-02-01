import PropTypes from 'prop-types';
import React from 'react';
import InputRange from 'react-input-range';
import "react-input-range/lib/css/index.css";

const RangeSlider = ({ label, min, max, value, onSliderChange }) => {
    return (
        <div className="custom-slider">
            <span>{label}</span>
            <InputRange
                maxValue={max}
                minValue={min}
                value={value}
                onChange={onSliderChange}
            />
        </div>
    );
};
RangeSlider.propTypes = {
    label: PropTypes.string,
    min: PropTypes.number,
    max: PropTypes.number,
    value: PropTypes.object,
    onSliderChange: PropTypes.func.isRequired,
};

export default RangeSlider;
