import React from 'react'

import { Switch } from "react-router-dom"

import AuthRoute from "common/auth/AuthRoute.js"

import GamePage from "./page/GamePage.js"
import Search from "./search/Search.js"

export default function accountRouter() {
    return (
        <Switch>
            <AuthRoute
                path="/game/search"
                is="configured"
                auth="user"
                component={Search} />

            <AuthRoute
                path="/game/:pk"
                is="configured"
                auth="user"
                component={GamePage} />
        </Switch>
    )
}