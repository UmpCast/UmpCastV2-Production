import React from "react"

import { Switch } from "react-router-dom"

import AuthRoute from "common/auth/AuthRoute.js"

import Announcements from "./announcements/Announcements.js"
import JoinLeague from "./join/JoinLeague.js"
import Calendar from "./calendar/Calendar.js"
import AutoAssign from "./assignment/Assignment.js"
import Urgent from "./urgent/Urgent.js"

import UmpiresRouter from "./umpires/UmpiresRouter.js"
import SettingsRouter from "./settings/SettingsRouter.js"

export default function LeagueRouter() {
    return (
        <Switch>
            <AuthRoute
                path="/league/:pk/join"
                is="configured"
                not="league_member"
                component={JoinLeague}
            />

            <AuthRoute
                path="/league/:pk/announcements"
                is="league_member"
                auth="league"
                component={Announcements}
            />

            <AuthRoute
                path="/league/:pk/calendar/:date"
                is="league_member"
                auth="league"
                component={Calendar}
            />

            <AuthRoute
                path="/league/:pk/calendar"
                is="league_member"
                auth="league"
                component={Calendar}
            />
            
            <AuthRoute
                path="/league/:pk/assignment"
                is="league_manager"
                auth="league"
                component={AutoAssign}
            />

            <AuthRoute
                path="/league/:pk/urgent"
                is="league_member"
                auth="league"
                component={Urgent}
            />

            <AuthRoute
                path="/league/:pk/umpires"
                is="league_member"
                auth="league"
                component={UmpiresRouter}
            />

            <AuthRoute
                path="/league/:pk/settings"
                is="league_manager"
                auth="league"
                component={SettingsRouter}
            />

            <AuthRoute
                path="/league/:pk"
                is="league_member"
                not="league_member"
                component={null}
            />
        </Switch>
    )
}
