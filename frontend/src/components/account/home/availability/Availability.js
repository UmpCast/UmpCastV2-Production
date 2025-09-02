import React, { useState } from "react"

import useUser, { useMountEffect, useApi } from "common/hooks.js"

import { Accordion, Card, Button, Tab, Nav } from "react-bootstrap"

import TimeAvailability from "./TimeAvailability.js"
import LocationAvailability from "./LocationAvailability.js"
import AvailabilityStatus from "./AvailabilityStatus.js"

const requests = {
    getTimeRanges(user_pk) {
        return [
            "api/schedule-timeranges/",
            {
                params: {
                    user: user_pk,
                    page_size: 200
                }
            }
        ]
    },
    getUserLocations(user_pk) {
        return [`api/users/${user_pk}/locations/`, {}]
    }
}

export default function Availability() {
    const { user } = useUser()
    const Api = useApi(requests)

    const [state, setState] = useState({
        location: null,
        schedule: null,
        type: "time",
        loading: true
    })

    const setSchedule = (schedule) =>
        setState({
            ...state,
            schedule
        })

    const setLocation = (location) =>
        setState({
            ...state,
            user_locations: {
                ...state.user_locations,
                locations: {
                    ...state.user_locations.locations,
                    [location.pk]: {
                        ...location
                    }
                }
            }
        })

    const setType = (type) =>
        setState({
            ...state,
            type
        })

    const to_object = (arr, values) =>
        arr.reduce(
            (obj, item) => ({
                ...obj,
                [item.pk]: {
                    ...item,
                    ...values
                }
            }),
            {}
        )

    useMountEffect(() => {
        Promise.all([
            Api.getTimeRanges(user.pk),
            Api.getUserLocations(user.pk)
        ]).then(([res1, res2]) => {
            const current = res1.data.results
            
            // The API already filters by user, so we should trust the results
            const userTimeRanges = current
            const user_locations = res2.data.results.reduce(
                (
                    obj,
                    { league, available_locations, not_available_locations }
                ) => {
                    const available = to_object(available_locations, {
                        available: true,
                        league: league.pk
                    })
                    const unavailable = to_object(not_available_locations, {
                        available: false,
                        league: league.pk
                    })

                    const all_pks = available_locations
                        .concat(not_available_locations)
                        .sort((el1, el2) => el1.title.localeCompare(el2.title))
                        .map((item) => item.pk)

                    return {
                        leagues: {
                            ...obj.leagues,
                            [league.pk]: league
                        },
                        locations: {
                            ...obj.locations,
                            ...available,
                            ...unavailable
                        },
                        leagues_by_pk: obj.leagues_by_pk.concat(league.pk),
                        locations_by_pk: [...obj.locations_by_pk, ...all_pks]
                    }
                },
                {
                    leagues: {},
                    locations: {},
                    leagues_by_pk: [],
                    locations_by_pk: []
                }
            )

            setState({
                ...state,
                schedule: {
                    current: userTimeRanges,
                    adding: false
                },
                user_locations,
                loading: false
            })
        }).catch((err) => {
            console.warn('Error loading availability data:', err)
            setState({
                ...state,
                loading: false,
                error: true
            })
        })
    })

    return (
        <Tab.Container id="tab-container">
            <Accordion>
                <Card className="mt-3">
                    <Card.Header className="d-flex justify-content-between border-0">
                        <Accordion.Toggle
                            as={Button}
                            variant="link"
                            eventKey="0"
                        >
                            What is Availability?
                        </Accordion.Toggle>
                        <Nav variant="pills">
                            <Nav.Item>
                                <Nav.Link
                                    active={state.type === "time"}
                                    onClick={() => setType("time")}
                                >
                                    Time
                                </Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link
                                    active={state.type === "location"}
                                    onClick={() => setType("location")}
                                >
                                    Location
                                </Nav.Link>
                            </Nav.Item>
                        </Nav>
                    </Card.Header>
                    {!state.loading ? (
                        <Accordion.Collapse eventKey="0">
                            <Card.Body>
                                By providing what times you are available
                                throughout the week, your manager will be able
                                to automatically assign you games.
                                <AvailabilityStatus availability={state} />
                            </Card.Body>
                        </Accordion.Collapse>
                    ) : null}
                </Card>
            </Accordion>
            {!state.loading ? (
                <Tab.Content>
                    <Tab.Pane active={state.type === "time"}>
                        <TimeAvailability
                            schedule={state.schedule}
                            setSchedule={setSchedule}
                        />
                    </Tab.Pane>
                    <Tab.Pane active={state.type === "location"}>
                        <LocationAvailability
                            user_locations={state.user_locations}
                            setLocation={setLocation}
                        />
                    </Tab.Pane>
                </Tab.Content>
            ) : null}
        </Tab.Container>
    )
}
