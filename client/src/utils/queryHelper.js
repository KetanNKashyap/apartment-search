import gql from "graphql-tag";
import client from './../ApolloClient'

export const fetchApartmentByLocation = (location) => {
    return client.query({
        query: gql`
        {
          apartments(active: true,location:"${location}") {
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
              details{
              rooms
              bedrooms
              floor
              bathrooms
              }
              amenities
              services
              images
            }
          }
        }`
      })
}

