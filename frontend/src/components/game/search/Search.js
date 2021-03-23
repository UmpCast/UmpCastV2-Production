import React, { useState, useEffect, useCallback } from "react"
import dayjs from "dayjs"
import { Container, Button } from "react-bootstrap"

import useUser, { useApi } from "common/hooks"
import GamePagination from "./GamePagination"
import {
    LeagueFilter,
    DivisionFilter,
    DateFilter,
    LocationFilter
} from "./Filters"

const requests = {
    fetchGames: (page, filters) => [
        "api/games/",
        {
            params: {
                ...filters,
                page_size: 5, //TODO
                page: page
            }
        }
    ],
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

const list_pks = (list) => {
    return list
        .reduce(
            (arr, { pk, toggle }) => arr.concat(toggle === true ? pk : []),
            []
        )
        .join(", ")
}

export default function Search() {
    const Api = useApi(requests)

    const { user } = useUser()
    const { accepted_leagues } = user

    const [selectedLeague, setSelectedLeague] = useState(accepted_leagues?.[0])

    const [state, setState] = useState({
        filters: undefined,
        applied_filters: undefined,
        loading: true
    })

    useEffect(() => {
        ;(async () => {
            if (!selectedLeague) return

            const { pk: user_pk, account_type } = user
            const { pk: league_pk } = selectedLeague

            const isManager = account_type === "manager"

            const res = await Promise.all(
                [
                    Api.fetchLeague(league_pk),
                    Api.fetchLocations(league_pk)
                ].concat(isManager ? [] : Api.fetchUls(user_pk, league_pk))
            )

            const divisions = res[0].data.divisions
            const locations = res[1].data.results
            const visibilities = isManager
                ? []
                : res[2].data.division_visibilities

            const _divisions = divisions.map((division) => {
                const can_toggle = isManager
                    ? true
                    : visibilities.includes(division)
                return { ...division, toggle: can_toggle ? true : undefined }
            })

            const _locations = locations.map((location) => {
                return {
                    ...location,
                    toggle: true
                }
            })

            const filters = {
                divisions: _divisions,
                locations: _locations,
                start_date: dayjs(),
                end_date: dayjs().add(1, "M")
            }

            setState({
                filters,
                applied_filters: filters,
                loading: false
            })
        })()
    }, [selectedLeague, user, Api])

    const fetchPage = useCallback(
        async (page) => {
            const {
                divisions,
                locations,
                start_date,
                end_date
            } = state.applied_filters

            const division_pks = list_pks(divisions)
            const location_pks = list_pks(locations)

            const filters = {
                division__in: division_pks,
                location__in: location_pks,
                date_time_after: start_date.toISOString(),
                date_time_before: end_date.toISOString()
            }

            const {
                data: { count, page_size, results }
            } = await Api.fetchGames(page, filters)

            const items = results.map((game) => {
                return {
                    ...game,
                    division: divisions.find(
                        (item) => item.pk === game.division
                    ),
                    location: locations.find(
                        (item) => item.pk === game.location
                    )
                }
            })

            return {
                count,
                page_size,
                items
            }
        },
        [state.applied_filters, Api]
    )

    const onLeagueSelect = (league) => {
        if (league.pk !== selectedLeague.pk) setSelectedLeague(league)
    }

    const onDateSelect = (field) => (date) => {
        if (!date.isSame(state.filters[field]))
            setState({
                ...state,
                filters: {
                    ...state.filters,
                    [field]: date
                }
            })
    }

    const onListToggle = (field) => (pk) => {
        setState({
            ...state,
            filters: {
                ...state.filters,
                [field]: state.filters[field].map((item) =>
                    item.pk === pk ? { ...item, toggle: !item.toggle } : item
                )
            }
        })
    }

    const onApplyFilters = () => {
        setState({
            ...state,
            applied_filters: state.filters
        })
    }

    return (
        <>
            <div className="bg-light border-bottom mb-4 py-4">
                <div className="display-4 my-0 mr-2 text-center">
                    <strong>Game Signup</strong>
                </div>
                <h5 className="text-center text-primary mt-2">
                    Find your next Game
                </h5>
            </div>
            {!state.loading ? (
                <Container>
                    <div
                        className="d-inline-flex justify-content-between w-100 mb-3"
                    >
                        <LeagueFilter
                            allLeagues={accepted_leagues}
                            selectedLeague={selectedLeague}
                            onLeagueSelect={onLeagueSelect}
                        />
                        <DivisionFilter
                            className="d-none d-md-block"
                            allDivisions={state.filters.divisions}
                            onDivisionToggled={onListToggle("divisions")}
                        />
                        <LocationFilter
                            className="d-none d-md-block"
                            allLocations={state.filters.locations}
                            onLocationToggled={onListToggle("locations")}
                        />
                        <DateFilter
                            text="After"
                            selectedDate={state.filters.start_date}
                            onDateSelect={onDateSelect("start_date")}
                        />
                        <DateFilter
                            text="Before"
                            className="d-none d-sm-block"
                            selectedDate={state.filters.end_date}
                            onDateSelect={onDateSelect("end_date")}
                        />
                        <Button
                            className="mx-2 rounded"
                            variant="success"
                            onClick={onApplyFilters}
                        >
                            Apply
                        </Button>
                    </div>
                    {!state.loading ? (
                        <GamePagination fetchPage={fetchPage} />
                    ) : null}
                </Container>
            ) : null}
        </>
    )
}
