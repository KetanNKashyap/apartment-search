import React, { Component } from 'react';
import { ApolloProvider } from 'react-apollo';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import HomeView from './views/HomeView';
import client from './ApolloClient';
import store from './store';
import ApartmentView from "./views/ApartmentView";
import LocationApartmentsView from "./views/LocationApartmentsView";
import LocationsSearchView from "./views/LocationsSearchView";

class App extends Component {
  render() {
    return (
      <ApolloProvider client={client}>
        <Provider store={store}>
          <Router>
            <div className="container-fluid">
              <Route exact path="/" component={HomeView} />
              <Route exact path="/apartments/:apartmentId" component={ApartmentView} />
              <Route exact path="/locations" component={LocationApartmentsView} />
              <Route exact path="/search" component={LocationsSearchView} />
            </div>
          </Router>
        </Provider>
      </ApolloProvider>
    );
  }
}

export default App;
