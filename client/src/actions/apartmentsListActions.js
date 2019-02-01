import { FETCH_APARTMENTS_LIST } from "./types";
import gql from "graphql-tag";
import client from './../ApolloClient'
import { fetchApartmentByLocation } from '../utils/queryHelper';

export const fetchApartmentsList = () => dispatch => {
  client.query({
    query: gql`
    {
      apartments(active: true) {
        items {
          _id
          owner {
          _id
            email
          } 
          title
          location {
            title
          }
          size
          price
          amenities
          details{
        rooms
        bedrooms
        floor
        bathrooms
      }
      services
          images
        }
      }
    }`
  })
    .then(({ data: payload }) => dispatch({
      type: FETCH_APARTMENTS_LIST,
      payload
    }));
};

export const fetchApartments = (locations = []) => dispatch => {
  let tasks = [];
  locations.forEach(location => {
    tasks.push(fetchApartmentByLocation(location));
  })
  Promise.all(tasks).then(results => {
    const payloadItems = results.reduce((acc, { data: { apartments } }) => {
      const { items = [] } = apartments;
      acc = [...acc, ...items];
      return acc;
    }, [])
    const payload = {
      apartments: {
        items: payloadItems
      }
    }
    dispatch({
      type: FETCH_APARTMENTS_LIST,
      payload
    })
  })
};

