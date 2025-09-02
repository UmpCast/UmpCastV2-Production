import React from 'react'
import { useParams } from "react-router-dom"

import { useFetchLeague } from "common/hooks.js"

import Loader from "common/components.js"
import SettingsContainer from "components/league/settings/SettingsContainer.js"

import SignupDefaults from "./signups/SignupDefaults.js"
import VisibilityLevels from "./levels/VisibilityLevels.js"


export default function LeagueUmpires() {

    const { pk } = useParams()

    const useLeague = useFetchLeague(pk)

    const [league] = useLeague

    return (
        <Loader dep={league}>
            <SettingsContainer league={league} active="umpires">
                    <h3>
                        <strong>Umpire Defaults</strong>
                    </h3>
                    <hr className="my-3" />
                    <SignupDefaults league={league} />
                    <VisibilityLevels league={league} />
            </SettingsContainer>
        </Loader>
    )
}