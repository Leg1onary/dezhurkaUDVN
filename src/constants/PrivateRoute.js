import React  from "react";
import { Route, Redirect } from "react-router-dom";
import {useFirebase} from "../Firebase";

// eslint-disable-next-line react/prop-types
const PrivateRoute = ({ component: RouteComponent, ...rest }) => {
    const firebase = useFirebase();
    const user = firebase.getCurrentUser();
    return (
        <Route
            {...rest}
            render={routeProps =>
                user ? (
                    <RouteComponent {...routeProps} />
                ) : (
                    <Redirect to={"/login"} />
                )
            }
        />
    );
};


export default PrivateRoute