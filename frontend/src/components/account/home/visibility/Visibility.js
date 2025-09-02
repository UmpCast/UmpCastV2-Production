import React, { useState } from 'react'

import useUser, { useApi, useMountEffect } from "common/hooks.js"
import Loader from "common/components.js"
import { searchPks } from "common/Utils.js"

import LeagueCard from "./LeagueCard.js"
import VisTable from "./VisTable.js"

export default function Visibility() {

    const Api = useApi(requests)
    const { user } = useUser()

    const useUls = useState()

    const [uls, setUls] = useUls

    useMountEffect(() => {
        const leagues = user.accepted_leagues

        Api.fetchUls(user)
            .then(res =>
                setUls(
                    res.data.results.map(
                        status => ({
                            ...status,
                            league: searchPks(leagues, status.league.pk)
                        })
                    )
                )
            )
    })

    return (
        <Loader dep={uls}>
            <ListVis uls={uls} />
        </Loader>
    )
}

const ListVis = ({ uls }) => (
    uls.map(status =>
        <LeagueCard league={status.league} key={status.pk}>
            <VisTable
                status={status}
                key={status.pk} />
        </LeagueCard>
    )
)

const requests = {
    fetchUls: (user) => [
        "api/user-league-status/",
        {
            params: {
                user: user.pk,
                request_status: "accepted",
                page_size: 100
            }
        }
    ]
}
