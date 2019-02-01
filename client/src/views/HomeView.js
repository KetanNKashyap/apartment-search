import React, {Component} from 'react';
import { connect } from 'react-redux';
import { fetchApartmentsList } from './../actions/apartmentsListActions';

import ApartmentTileView from "./ApartmentTileView";

class HomeView extends Component {
  componentDidMount() {
    const { fetchApartmentsList } = this.props;
    fetchApartmentsList();
  }

  render() {
    const { apartmentsList } = this.props;
    if (!Object.keys(apartmentsList).length) {
      return <div>Loading...</div>
    }

    return (
      <div className="container-list container-lg clearfix">
        <div className="col-12 float-left">
          <div className="view-apartment-list">
            {apartmentsList.items.map((item, index) => (
              <ApartmentTileView key={index} apartment={item} />
            ))}
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  apartmentsList: state.apartmentsList.apartments,
});

export default connect(mapStateToProps, { fetchApartmentsList })(HomeView)
