import React, { Fragment, useState, useReducer } from "react"
import { useParams } from "react-router-dom"
import dayjs from "dayjs"
import localizedFormat from "dayjs/plugin/localizedFormat"
import customParseFormat from "dayjs/plugin/customParseFormat"

import useUser, { useApi, useMountEffect } from "common/hooks"
import Loader from "common/components"
import { expandGames } from "common/Utils"

import { gamesReducer, locationsReducer } from "./reducers"
import Header from "./Header"
import Week from "./Week"
import CalendarGame from "./Game"
import EditGameIcon from "./EditGameIcon"

dayjs.extend(customParseFormat, localizedFormat)

export default function Calendar() {
    const params = useParams()

    const { pk, date } = params

    const week_start = getWeekStart(date)

    const Api = useApi(requests)
    const User = useUser()

    const { user } = User

    const [league, setLeague] = useState()

    const [games, dispatchGames] = useReducer(gamesReducer(week_start))
    const [locations, dispatchLocations] = useReducer(locationsReducer)

    const [handleGames, setHandleGames] = useState(() =>
        basicHandleGames(Api, dispatchGames)
    )

    useMountEffect(() => {
        ;(async () => {
            const [
                { data: myLeague },
                {
                    data: { results: myLocations }
                }
            ] = await Promise.all([Api.fetchLeague(pk), Api.fetchLocations(pk)])

            setLeague(myLeague)
            dispatchLocations({
                type: "set",
                payload: myLocations.sort((el1, el2) =>
                    el1.title.localeCompare(el2.title)
                )
            })

            const divVis =
                user.account_type === "umpire"
                    ? (await Api.fetchUls(user.pk, pk)).data.results[0]
                          .division_visibilities
                    : myLeague.divisions.map((div) => div.pk)

            const newHandleGames = handleGames(divVis)

            setHandleGames(() => newHandleGames)
            newHandleGames(week_start)
        })()
    })

    let formattedGames
    if (games) {
        formattedGames = expandGames(
            games.map((game) => {
                const loc = locations.find((loc) => loc.pk === game.location)
                return {
                    ...game,
                    location: loc,
                    
                }
            }),
            league.divisions
        )
    }

    return (
        <Fragment>
            <Loader dep={[league]}>
                <Header
                    week_start={week_start}
                    handleGames={handleGames}
                    dispatchGames={dispatchGames}
                    dispatchLocations={dispatchLocations}
                    locations={locations}
                    league={league}
                />
            </Loader>
            <Loader dep={[league, games]}>
                <div className="px-5 mt-3">
                    <Week
                        start={week_start}
                        games={formattedGames?.map((game) => {
                            return {
                                component: (
                                    <CalendarGame
                                        game={game}
                                        EditGameIcon={
                                            <EditGameIcon
                                                locations={locations}
                                                dispatchGames={dispatchGames}
                                                dispatchLocations={
                                                    dispatchLocations
                                                }
                                                league={league}
                                                game={game}
                                            />
                                        }
                                    />
                                ),
                                ...game
                            }
                        })}
                        locations={locations}
                        league={league}
                        dispatchGames={dispatchGames}
                    />
                </div>
            </Loader>
        </Fragment>
    )
}

const getWeekStart = (date) => {
    let day = dayjs(date, "M-D-YYYY")

    if (!day.isValid()) {
        day = dayjs()
    }
    return day.startOf("week")
}

const basicHandleGames = (Api, dispatchGames) => (vis) => (week_start) => {
    if (vis.length > 0) {
        return Api.fetchGames(
            week_start,
            week_start.endOf("week"),
            vis
        ).then((res) =>
            dispatchGames({ type: "set", payload: res.data.results })
        )
    } else {
        return dispatchGames({ type: "set", payload: [] })
    }
}

const requests = {
    fetchLeague: (league_pk) => [
        "api/leagues/",
        {
            pk: league_pk
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
    fetchGames: (start, end, div_vis) => [
        "api/games/",
        {
            params: {
                division__in: div_vis.toString(),
                date_time_after: start.toISOString(),
                date_time_before: end.toISOString(),
                page_size: 100
            }
        }
    ]
}
