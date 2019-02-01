import React from 'react';

const apartmentAmentityView = (props) => {
    let {apartment, limit = 3} = props;
    let amentities = [];
    apartment.amenities.forEach((item, index) => {
      if (index < limit) {
        amentities.push(<span className="_1h9l4w0vvX6d56ZnJ3NLod"><i></i><span>{item}</span></span>);
      }
    });
    return amentities
  }

  export default apartmentAmentityView
