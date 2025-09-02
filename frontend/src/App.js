import React, { useState } from "react"
import { BrowserRouter as Router, Route, Switch } from "react-router-dom"

import AuthContainer from "global/AuthContainer.js"
import DisplayContainer from "global/DisplayContainer.js"
import Header from "global/header/Header.js"

import { UserContext, DisplayContext } from "global/Context.js"

import AccountRouter from "components/account/AccountRouter.js"
import CallbackRouter from "components/callback/CallbackRouter.js"
import GameRouter from "components/game/GameRouter.js"
import LeagueRouter from "components/league/LeagueRouter.js"

import "styles/Styles.js"

import { library } from "@fortawesome/fontawesome-svg-core"
import * as icons from "global/Icons.js"

library.add(...Object.values(icons))

const App = () => {

    const [user, setUser] = useState({
        user: {},
        isAuthenticated: false,
        isConfigured: false,
        token: null
    })

    const [display, setDisplay] = useState({
        loading: 0,
        alert: null
    })

    return (
        <Router>
            <UserContext.Provider value={[user, setUser]}>
                <DisplayContext.Provider value={[display, setDisplay]}>
                    <AuthContainer>
                        <Header />
                        <DisplayContainer>
                            <Switch>
                                <Route path="/league/:pk" component={LeagueRouter} />
                                <Route path="/game" component={GameRouter} />
                                <Route path="/callback" component={CallbackRouter} />
                                <Route path="/" component={AccountRouter} />
                            </Switch>
                        </DisplayContainer>
                    </AuthContainer>
                </DisplayContext.Provider >
            </UserContext.Provider>
        </Router >
    )
}

export default App;
