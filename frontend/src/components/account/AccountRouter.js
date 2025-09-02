import React from 'react'
import { Route, Switch } from "react-router-dom"

import AuthRoute from "common/auth/AuthRoute.js"

import Login from "./auth/login/Login.js"
import Register from "./auth/register/Register.js"
import Configure from "./auth/register/Configure.js"
import ResetPassword from './auth/login/ResetPassword.js'
import ResetSuccess from './auth/login/ResetSuccess.js'
import Home from "./home/Home.js"

import SettingsRouter from "./settings/SettingsRouter.js"

export default function AccountRouter() {
    return (
        <Switch>
            <AuthRoute
                path="/register/configure"
                is="authenticated"
                not="configured"
                component={Configure} />

            <AuthRoute
                path="/login"
                is="public"
                not="authenticated"
                component={Login} />

            <AuthRoute
                path="/register"
                is="public"
                not="authenticated"
                component={Register} />
            
            <AuthRoute
                path={"/reset-password/success"}
                is="public"
                not="authenticated"
                component={ResetSuccess} />

            <AuthRoute
                path="/reset-password"
                is="public"
                not="authenticated"
                component={ResetPassword} />

            <Route
                path="/settings"
                component={SettingsRouter} />

            <AuthRoute
                path="/"
                is="configured"
                auth="user"
                component={Home} />
        </Switch>
    )
}