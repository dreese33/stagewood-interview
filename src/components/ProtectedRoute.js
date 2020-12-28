import React from 'react'
import { Redirect } from 'react-router-dom'
import Home from './HomeComponent.js'

class ProtectedRoute extends React.Component {

    render() {
        const Component = this.props.component;
        const isAuthenticated = localStorage.getItem('token');
       
        return isAuthenticated ? (
            <Home />
        ) : (
            <Redirect to={{ pathname: '/' }} />
        );
    }
}


export default ProtectedRoute;