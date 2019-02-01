import React, {Component} from 'react';
import { connect } from 'react-redux';
import { fetchApartmentsList, fetchApartments } from './../actions/apartmentsListActions';
import { fetchLocationsList } from "../actions/locationActions";
import ApartmentTileView from "./ApartmentTileView";
import SearchField from '../common/search.component';
import RangeSlider from '../common/range.component';
import { AMENITIES, SERVICES, ROOMS, BEDROOMS, FLOOR, BATHROOMS, SIZE, PRICE } from '../constants/filters';

class LocationsSearchView extends Component {

    state = {
        searchValue: "",
        searchData: [],
        filterMenu: false,
        filters: {
            size: {
                min: 1,
                max: 100
            },
            price: {
                min: 300,
                max: 1500
            },
            amenities: [],
            details: {
                rooms: [],
                bedrooms: [],
                floor: [],
                bathrooms: [],
            },
            services: [],
        },
        apartments: [],     // only required for now, as we are not getting apartments again and again from back-end
    }

    componentDidMount() {
        const { fetchApartmentsList, fetchLocationsList } = this.props;
        fetchLocationsList();
        fetchApartmentsList();
    }

    componentDidUpdate(prevProps, prevState) {
        const { apartmentsList, fetchApartmentsList } = this.props;
        const { searchValue } = this.state;
        if (prevProps.apartmentsList !== apartmentsList) {
            this.setState({ apartments: apartmentsList.items || [] })
        }
        if (prevState.searchValue !== searchValue) {
            if (!searchValue) {
                fetchApartmentsList();
                this.setState({ filterMenu: false })
            }
        }
    }

    setSearchData = () => {
        const { searchValue } = this.state;
        if (searchValue.length < 3) this.setState({ searchData: [] });
        else {
            const { locations } = this.props;
            const matches = locations.items.filter(l => {
                if (l.title.toLowerCase().startsWith(searchValue)) {
                    return true;
                }
                return false
            });
            this.setState({ searchData: matches });
        }
    }

    // get from client side itself (as we have all data)
    getLocationApartments = (_id) => {
        const { fetchApartments } = this.props;
        const selectedLocations = [_id];
        fetchApartments(selectedLocations);
        this.setState({ searchData: [] })
    }

    isAmenityPresent = (filterAmenities, apartmentAmenities) => {
        let amenity = false;
        for (let a of filterAmenities) {
            if (apartmentAmenities.includes(a)) {
                amenity = true;
            }
            else {
                amenity = false;
                break;
            }
        }
        return amenity;
    }

    isServicePresent = (filterServices, apartmentServices) => {
        let service = false;
        for (let s of filterServices) {
            if (apartmentServices.includes(s)) {
                service = true;
            }
            else {
                service = false;
                break;
            }
        }
        return service;
    }

    isDetailAvailable = (detailKey, apartmentDetails, detailArray) => {
        let detail = false;
        for (let d of detailArray) {
            if (apartmentDetails[detailKey] === d) {
                detail = true;
            }
        }
        return detail;
    }

    isAvailableInRange = (type, apartmentRangeValue) => {
        const { filters } = this.state;
        const { size, price } = filters;
        if (type === 'size') {
            const { min, max } = size;
            return (apartmentRangeValue >= min && apartmentRangeValue <= max);
        }
        else if (type === 'price') {
            const { min, max } = price;
            return (apartmentRangeValue >= min && apartmentRangeValue <= max);
        }
    }

    getFilteredApartments = () => {
        const { filters, apartments } = this.state;
        const { amenities, services,
            details: { bathrooms, bedrooms, floor, rooms },
            size, price } = filters;
        return apartments.reduce((acc, apartment) => {
            const filterByAmenities = amenities.length ? this.isAmenityPresent(amenities, apartment.amenities) : true;
            const filterByServices = services.length ? this.isServicePresent(services, apartment.services) : true;
            const filterByBedrooms = bedrooms.length ? this.isDetailAvailable('bedrooms', apartment.details, bedrooms) : true;
            const filterByRooms = rooms.length ? this.isDetailAvailable('rooms', apartment.details, rooms) : true;
            const filterByFloor = floor.length ? this.isDetailAvailable('floor', apartment.details, floor) : true;
            const filterByBathrooms = bathrooms.length ? this.isDetailAvailable('bathrooms', apartment.details, bathrooms) : true;
            const filterBySize = size ? this.isAvailableInRange('size', apartment.size) : true;
            const filterByPrice = price ? this.isAvailableInRange('price', apartment.price) : true;
            if (filterByAmenities &&
                filterByServices &&
                filterByBedrooms &&
                filterByRooms &&
                filterByFloor &&
                filterByBathrooms &&
                filterBySize &&
                filterByPrice
            ) {
                acc.push(apartment);
            }
            return acc;
        }, [])
    }

    handleLocationSelect = (location) => {
        const { _id, title } = location;
        this.setState({
            searchValue: title,
            filterMenu: true
        }, () => this.getLocationApartments(_id))
    }

    handleSearchChange = (e) => {
        this.setState({
            searchValue: e.target.value
        }, () => this.setSearchData())
    }

    renderSearchBox = () => {
        const { searchValue, searchData } = this.state;
        return (
            <SearchField
                inputValue={searchValue}
                placeholder="Search for location..."
                onFieldChange={this.handleSearchChange}
                searchData={searchData}
                onSelect={this.handleLocationSelect}
            />
        )
    }

    handleFilterChange = (e, type) => {
        const { filters } = this.state;
        const { details } = filters;
        if (type === 'Amenities') {
            const { checked, value } = e.target;
            if (checked) {
                this.setState({
                    filters: {
                        ...filters,
                        amenities: [...filters.amenities, value]
                    }
                })
            } else {
                this.setState({
                    filters: {
                        ...filters,
                        amenities: [...filters.amenities.filter(a => a !== value)]
                    }
                })
            }
        };
        if (type === 'Services') {
            const { checked, value } = e.target;
            if (checked) {
                this.setState({
                    filters: {
                        ...filters,
                        services: [...filters.services, value]
                    }
                })
            } else {
                this.setState({
                    filters: {
                        ...filters,
                        services: [...filters.services.filter(s => s !== value)]
                    }
                })
            }
        };
        if (type === 'rooms' || type === 'bedrooms' || type === 'floor' || type === 'bathrooms') {
            const { checked, value } = e.target;
            if (checked) {
                this.setState({
                    filters: {
                        ...filters,
                        details: {
                            ...details,
                            [type]: [...details[type], value]
                        }
                    }
                })
            } else {
                this.setState({
                    filters: {
                        ...filters,
                        details: {
                            ...details,
                            [type]: [...details[type].filter(s => s !== value)]
                        }
                    }
                })
            }
        }
    }

    handleSliderChange = (type, value) => {
        const { filters } = this.state;
        this.setState({
            filters: {
                ...filters,
                [type]: value
            }
        })
    }

    renderSlider = (type, range) => {
        let value = 0;
        const { filters: { size, price } } = this.state;
        switch (type) {
            case 'size':
                value = size;
                break;
            case 'price':
                value = price;
                break;
            default:
                value = 0;
        }
        const { min, max } = range;
        return (
            <RangeSlider
                label={type}
                min={min}
                max={max}
                value={value}
                onSliderChange={(value) => this.handleSliderChange(type, value)}
            />
        )
    }

    renderCheckFilters = (FilterArray, FilterLabel) => {
        return (
            <div className="filterCheckbox">
                <label>{FilterLabel}</label>
                <ul>
                    {FilterArray.map(value =>
                        <li key={value}>
                            <label class="check">
                            <input
                                type="checkbox"
                                value={value}
                                onChange={(e) => this.handleFilterChange(e, FilterLabel)}
                            />{value}
                            <span class="checkmark"></span>
                            </label>
                        </li>)}
                </ul>
            </div>
        )
    }

    render() {
        const { apartments } = this.state;
        if (!apartments.length) {
            return <div>Loading...</div>
        }
        const filteredApartments = this.getFilteredApartments();

        return (
            <div className="row">
                <div className="col-md-3 leftPanel">
                    {this.renderSearchBox()}
                    {this.renderSlider('size', SIZE)}
                    {this.renderSlider('price', PRICE)}
                    {this.renderCheckFilters(AMENITIES, 'Amenities')}
                    {this.renderCheckFilters(SERVICES, 'Services')}
                    {this.renderCheckFilters(ROOMS, 'rooms')}
                    {this.renderCheckFilters(BEDROOMS, 'bedrooms')}
                    {this.renderCheckFilters(FLOOR, 'floor')}
                    {this.renderCheckFilters(BATHROOMS, 'bathrooms')}
                </div>
                <div className="col-md-9">
                    <div className="container-list container-lg clearfix">
                        <div className="col-12 float-left">
                            <div className="view-apartment-list">
                                {filteredApartments.map((item, index) => (
                                    <ApartmentTileView key={index} apartment={item} />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    locations: state.locationsList.locations,
    apartmentsList: state.apartmentsList.apartments,
});

export default connect(mapStateToProps, {
    fetchApartmentsList,
    fetchLocationsList,
    fetchApartments,
})(LocationsSearchView)
