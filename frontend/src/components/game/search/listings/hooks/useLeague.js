import { useState, useEffect } from "react"
import dayjs from "dayjs"

import useUser, { useApi } from "common/hooks"

export default function useLeague(useFilters) {

    const [, setFilters] = useFilters

    const Api = useApi(requests)
    const User = useUser()

    const retLeague = useState(User.user.accepted_leagues[0].pk)
    const [league] = retLeague

    useEffect(() => {
        
        Promise.all([
            Api.fetchLeague(league),
            Api.fetchUls(User.user.pk, league),
            Api.fetchLocations(league)
        ]).then(res => {
            const isManager = User.user.account_type === "manager"

            const { divisions } =res[0].data

            const uls = res[1].data.results[0]
            const divVis = uls.division_visibilities

            const {results: locations} = res[2].data

            const divFilters = (
                divisions.map(div => {
                    const {pk} = div
                    const hasVis = divVis.includes(pk) || isManager

                    return ({
                        ...div,
                        enabled: hasVis,
                        hasVis,
                    })
                })
            )

            setFilters({
                divisions: divFilters,
                start_date: dayjs(),
                locations
            })
        })
    }, [league, Api, User, setFilters])

    return retLeague
}

const requests = {
    fetchLeague: (league_pk) => [
        "api/leagues/",
        {
            pk: league_pk
        },
        "GET",
        false
    ],
    fetchUls: (user_pk, league_pk) => [
        "api/user-league-status/",
        {
            params: {
                user: user_pk,
                league: league_pk,
                request_status: "accepted",
                page_size: 1
            }
        }
    ],
    fetchLocations: (league_pk) => [
        "api/locations/",
        {
            params: {
                league: league_pk,
                page: 1,
                page_size: 200
            }
        }
    ]
}