import some from 'lodash/some';
import PropTypes from 'prop-types';
import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import asyncComponent from './Utilities/asyncComponent';

const Advisories = asyncComponent(() =>
    import(
        /* webpackChunkName: "Advisories" */ './SmartComponents/Advisories/Advisories'
    )
);
export const paths = {
    advisories: {
        title: 'Advisories',
        to: '/'
    }
};

type Props = {
    childProps: any
};

const InsightsRoute = ({ component: Component, rootClass, ...rest }) => {
    const root = document.getElementById('root');
    root.removeAttribute('class');
    root.classList.add(`page__${rootClass}`, 'pf-c-page__main');
    root.setAttribute('role', 'main');

    return <Route {...rest} component={Component} />;
};

InsightsRoute.propTypes = {
    component: PropTypes.func,
    rootClass: PropTypes.string
};

export const Routes = (props: Props) => {
    const path = props.childProps.location.pathname;

    return (
        <Switch>
            <InsightsRoute
                path={paths.advisories.to}
                component={Advisories}
                rootClass="Patchman"
            />

            {/* Finally, catch all unmatched routes */}
            <Route
                render={() =>
                    some(paths, p => p.to === path) ? null : (
                        <Redirect to={paths.advisories.to} />
                    )
                }
            />
        </Switch>
    );
};

Routes.propTypes = {
    childProps: PropTypes.shape({
        location: PropTypes.shape({
            pathname: PropTypes.string
        })
    })
};
