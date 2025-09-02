import React from 'react'

import { Redirect, Switch } from "react-router-dom"

import AuthRoute from "common/auth/AuthRoute.js"

import UserProfile from "./profile/UserProfile.js"
import UserSecurity from "./security/UserSecurity.js"
import UserNotifications from "./UserNotifications.js"
import UserLeagues from "./leagues/UserLeagues.js"

export default function SettingsRouter() {
    return (
        <Switch>
            <AuthRoute
                path="/settings/profile"
                is="configured"
                auth="user"
                component={UserProfile} />

            <AuthRoute
                path="/settings/security"
                is="configured"
                auth="user"
                component={UserSecurity} />

            <AuthRoute
                path="/settings/notifications"
                is="configured"
                auth="user"
                component={UserNotifications} />

            <AuthRoute
                path="/settings/leagues"
                is="configured"
                auth="user"
                component={UserLeagues} />
            
            <Redirect
                from="/settings"
                to="/settings/profile" />
        </Switch>
    )
}