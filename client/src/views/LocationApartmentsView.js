import React, {Component} from 'react';
import { connect } from "react-redux";
import { fetchLocationsList } from "../actions/locationActions";
import { fetchApartmentsList, fetchApartments } from './../actions/apartmentsListActions';
import ApartmentTileView from "./ApartmentTileView";
import './styleSheet.css';

export class LocationApartmentView extends Component {

    state = {
        checkedLocations: [],
        all: true
    }

    componentDidMount() {
        const { fetchLocationsList, fetchApartmentsList } = this.props;
        fetchLocationsList();
        fetchApartmentsList();
    }

    fetchListAsPerFilter = () => {
        const { fetchApartments, fetchApartmentsList } = this.props;
        const { checkedLocations, all } = this.state;
        if (all) {
            fetchApartmentsList();
        } else if (checkedLocations.length) {
            fetchApartments(checkedLocations);
        }
    }

    resetToAll = () => {
        const { checkedLocations } = this.state;
        this.setState({
            all: checkedLocations.length ? false : true
        }, () => this.fetchListAsPerFilter());
    }

    handleLocationChange = (e) => {
        const { checkedLocations, all } = this.state;
        const { target: { checked, value } } = e;
        if (value === 'all') {
            this.setState({
                all: checkedLocations.length ? !all : true,
                checkedLocations: checked ? [] : [...checkedLocations]
            }, () => this.resetToAll())
        }
        else {
            this.setState({
                checkedLocations: checked ?
                    [...checkedLocations, value] :
                    checkedLocations.filter(l => l !== value),
            }, () => this.resetToAll())
        }
    }

    isChecked = (locationId) => {
        const { checkedLocations, all } = this.state;
        return checkedLocations.find(l => l === locationId) && !all ? true : false;
    }

    renderLocationChecks = () => {
        const { all } = this.state;
        const { locations } = this.props;
        if (!Object.keys(locations).length) {
            return <div>Loading...</div>
        }
        return (<div className="col-2 leftPanel">
            <div className="checkbox">
                <label class="check">
                    <input 
                        onChange={this.handleLocationChange}
                        type="checkbox"
                        value={'all'}
                        checked={all}
                    />All
                    <span class="checkmark"></span>
                </label>
            </div>
            {locations.items.map(location => {
                const { _id, title } = location;
                return <div key={_id} className="checkbox">
                    <label class="check"
                    ><input
                            onChange={this.handleLocationChange}
                            type="checkbox"
                            value={_id}
                            checked={this.isChecked(_id)}
                        />
                        {title}
                        <span class="checkmark"></span>
                    </label>
                </div>
            })}
        </div>)
    }

    renderApartments = () => {
        const { apartmentsList } = this.props;
        if (!Object.keys(apartmentsList).length) {
            return <div>Loading...</div>
        }
        return (
            <div className="col-10">
                <div className="view-apartment-list">
                    {apartmentsList.items.map((item, index) => (
                        <ApartmentTileView key={index} apartment={item} />
                    ))}
                </div>
            </div>
        )
    }

    render() {
        return (
                <div className='row'>
                    {this.renderLocationChecks()}
                    {this.renderApartments()}
                </div>
        )
    }
}

const mapStateToProps = state => ({
    locations: state.locationsList.locations,
    apartmentsList: state.apartmentsList.apartments,
});

export default connect(mapStateToProps, { fetchLocationsList, fetchApartmentsList, fetchApartments })(LocationApartmentView)
