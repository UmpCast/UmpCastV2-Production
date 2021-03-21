import React, { useState, useEffect, useCallback } from "react"
import dayjs from "dayjs"
import { Container, Col } from "react-bootstrap"

import useUser, { useApi } from "common/hooks"
import usePagination from "./usePagination"
import GamePagination from "./GamePagination"
import { LeagueFilter, DivisionFilter, DateFilter } from "./Filters"

const requests = {
    fetchGames: (page, filters) => [
        "api/games/",
        {
            params: {
                ...filters,
                page_size: 5,
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

export default function Search() {
    const Api = useApi(requests)

    const { user } = useUser()
    const { accepted_leagues } = user

    const [selectedLeague, setSelectedLeague] = useState(accepted_leagues?.[0])

    const [state, setState] = useState({
        filters: {
            divisions: undefined,
            start_date: undefined
        },
        loading: true
    })

    useEffect(() => {
        ;(async () => {
            if (!selectedLeague) return

            const { pk: user_pk, account_type } = user
            const { pk: league_pk } = selectedLeague

            const isManager = account_type === "manager"

            const res = await Promise.all(
                [Api.fetchLeague(league_pk)].concat(
                    isManager ? [] : Api.fetchUls(user_pk, league_pk)
                )
            )

            const divisions = res[0].data.divisions
            const visibilities = isManager
                ? []
                : res[1].data.division_visibilities

            const _divisions = divisions.map((division) => {
                const can_toggle = isManager
                    ? true
                    : visibilities.includes(division)
                return { ...division, toggle: can_toggle ? true : undefined }
            })

            setState({
                filters: {
                    divisions: _divisions,
                    start_date: dayjs()
                },
                loading: false
            })
        })()
    }, [selectedLeague, user, Api])

    const fetchPage = useCallback(
        async (page) => {
            const { divisions, start_date } = state.filters

            const division_pks = divisions
                .reduce(
                    (arr, { pk, toggle }) =>
                        arr.concat(toggle === true ? pk : []),
                    []
                )
                .join(", ")

            const filters = {
                division__in: division_pks,
                date_time_after: start_date.toISOString()
            }

            const {
                data: { count, page_size, results }
            } = await Api.fetchGames(page, filters)

            const items = results.map((game) => {
                return {
                    ...game,
                    division: divisions.find(
                        (item) => item.pk === game.division
                    )
                }
            })

            return {
                count,
                page_size,
                items
            }
        },
        [state.filters, Api]
    )

    const {
        items,
        itemCount,
        pageCount,
        pageNumber,
        loading: page_loading,
        nextPage
    } = usePagination(state.loading ? null : fetchPage)

    const onLeagueSelect = (league) => {
        if (league.pk !== selectedLeague.pk) setSelectedLeague(league)
    }

    const onDateSelect = (date) => {
        if (!date.isSame(state.filters.start_date))
            setState({
                ...state,
                filters: {
                    ...state.filters,
                    start_date: date
                }
            })
    }

    const onDivisionToggled = ({ pk: division_pk }) => {
        setState({
            ...state,
            filters: {
                ...state.filters,
                divisions: state.filters.divisions.map((item) =>
                    item.pk === division_pk
                        ? { ...item, toggle: !item.toggle }
                        : item
                )
            }
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
                    <div className="d-inline-flex justify-content-between w-100 mb-3">
                        <LeagueFilter
                            allLeagues={accepted_leagues}
                            selectedLeague={selectedLeague}
                            onLeagueSelect={onLeagueSelect}
                        />
                        <DivisionFilter
                            allDivisions={state.filters.divisions}
                            onDivisionToggled={onDivisionToggled}
                        />
                        <DateFilter
                            selectedDate={state.filters.start_date}
                            onDateSelect={onDateSelect}
                        />
                    </div>
                    <Col>
                        {!page_loading ? (
                            <GamePagination
                                items={items}
                                canNextPage={pageNumber < pageCount}
                                nextPage={nextPage}
                            />
                        ) : null}
                    </Col>
                </Container>
            ) : null}
        </>
    )
}

// {
//     /* <ListGroup.Item>
// <strong>{games.count} </strong>
// games found
// </ListGroup.Item> */
// }
