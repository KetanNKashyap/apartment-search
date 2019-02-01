import PropTypes from 'prop-types';
import React from 'react';

const SearchField = ({ inputValue, placeholder, onFieldChange, searchData, onSelect, }) => {
    return (
        <div className="">
            <input
                type="text"
                className="searchInput form-control"
                value={inputValue}
                onChange={onFieldChange}
                placeholder={placeholder}
                title="Type in a name"
            />
            <ul className="searchList">
                {searchData.map(location => {
                    const { _id, title } = location;
                    return <li onClick={() => onSelect(location)} key={_id} ><a>{title}</a></li>
                })}
            </ul>
        </div>
    );
};
SearchField.propTypes = {
    inputValue: PropTypes.string,
    onFieldChange: PropTypes.func.isRequired,
    onSelect: PropTypes.func.isRequired,
    placeholder: PropTypes.string,
};

export default SearchField;
