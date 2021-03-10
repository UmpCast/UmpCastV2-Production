import React, { Fragment, useState } from "react"
import { useParams } from "react-router-dom"
import dayjs from "dayjs"
import localizedFormat from "dayjs/plugin/localizedFormat"
import customParseFormat from "dayjs/plugin/customParseFormat"

import useUser, { useApi, useMountEffect } from "common/hooks"

import Loader from "common/components"

import Header from "./Header"
import Week from "./Week"

dayjs.extend(customParseFormat, localizedFormat)

export default function Calendar() {
    const params = useParams()

    const { pk, date } = params

    const week_start = getWeekStart(date)

    const Api = useApi(requests)
    const User = useUser()

    const { user } = User

    const [league, setLeague] = useState()
    const [games, setGames] = useState()
    const [locations, setLocations] = useState()

    const [handleGames, setHandleGames] = useState(() =>
        basicHandleGames(Api, setGames)
    )

    const handleNewGame = (game) => {
        const game_time = dayjs(game.date_time)
        if (week_start < game_time && game_time < week_start.add(7, "days")) {
            setGames(games.concat(game))
        }
    }

    const handleNewLocation = (location) => {
        setLocations(locations.concat(location))
    }

    const handleDeleteLocation = (location_pk) => {
        setLocations(locations.filter(({ pk }) => pk !== location_pk))
    }

    const handleDeleteGame = ({ pk }) => {
        setGames(games.filter((game) => game.pk !== pk))
    }

    useMountEffect(() => {
        ;(async () => {
            const [
                { data: myLeague },
                { data: {results: myLocations }}
            ] = await Promise.all([Api.fetchLeague(pk), Api.fetchLocations(pk)])

            setLeague(myLeague)
            setLocations(myLocations)

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

    return (
        <Fragment>
            <Loader dep={[league]}>
                <Header
                    week_start={week_start}
                    handleGames={handleGames}
                    handleNewGame={handleNewGame}
                    handleNewLocation={handleNewLocation}
                    handleDeleteLocation={handleDeleteLocation}
                    locations={locations}
                    league={league}
                />
            </Loader>
            <Loader dep={[league, games]}>
                <div className="px-5 mt-3">
                    <Week
                        start={week_start}
                        games={games}
                        locations={locations}
                        league={league}
                        handleDeleteGame={handleDeleteGame}
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

const basicHandleGames = (Api, setGames) => (vis) => (week_start) => {
    if (vis.length > 0) {
        return Api.fetchGames(
            week_start,
            week_start.endOf("week"),
            vis
        ).then((res) => setGames(res.data.results))
    } else {
        return setGames([])
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
