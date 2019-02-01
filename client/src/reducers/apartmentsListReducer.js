import {FETCH_APARTMENTS_LIST} from './../actions/types';

const initialState = {
  apartments: {}
};


export default (state = initialState, action) => {
    switch (action.type) {
        case FETCH_APARTMENTS_LIST:
            return {
                ...state,
                apartments: action.payload.apartments
            };
        default:
            return state;
    }
}
