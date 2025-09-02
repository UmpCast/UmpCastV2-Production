import React from 'react'

import { Switch, Route, Redirect } from "react-router-dom"

import AuthRoute from "common/auth/AuthRoute.js"

import LeagueProfile from "./profile/LeagueProfile.js"
import UmpireDefaults from "./umpires/UmpireDefaults.js"
import DivisionSettings from "./divisions/DivisionsSettings.js"
import Payouts from "./report/Payouts.js"

export default function settingsRouter() {

    return (
        <Switch>
            <AuthRoute
                path="/league/:pk/settings/profile"
                is="league_manager"
                auth="league"
                component={LeagueProfile} />

            <AuthRoute
                path="/league/:pk/settings/umpires"
                is="league_manager"
                auth="league"
                component={UmpireDefaults} />

            <AuthRoute
                path="/league/:pk/settings/divisions"
                is="league_manager"
                auth="league"
                component={DivisionSettings} />

            <AuthRoute
                path="/league/:pk/settings/payouts"
                is="league_manager"
                auth="league"
                component={Payouts} />
        
            <Route
                path="/league/:pk/settings"
                render={props => (
                    <Redirect
                        to={`/league/${props.match.params.pk}/settings/profile`} />
                )} />

        </Switch>
    )
}