import React, { useState } from "react"

import useUser, { useMountEffect, useApi } from "common/hooks"

import { Accordion, Card, Button, Alert, Tab, Nav } from "react-bootstrap"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

import TimeAvailability from "./TimeAvailability"
import LocationAvailability from "./LocationAvailability"

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
            location
        })

    const setType = (type) =>
        setState({
            ...state,
            type
        })

    useMountEffect(() => {
        Promise.all([
            Api.getTimeRanges(user.pk),
            Api.getUserLocations(user.pk)
        ]).then(([res1, res2]) => {
            const current = res1.data.results
            const leagues = res2.data

            setState({
                ...state,
                schedule: {
                    current,
                    adding: false
                },
                locations: {
                    locations
                },
                loading: false
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
                                {state.schedule.current.length === 0 ? (
                                    <Alert variant="danger" className="mt-4">
                                        <FontAwesomeIcon
                                            icon="exclamation-circle"
                                            className="mr-2"
                                        />
                                        Your location availability is empty. Managers
                                        cannot auto-assign games to you.
                                    </Alert>
                                ) : null}
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
                            locations={state.locations}
                            setLocations={setLocations}
                        />
                    </Tab.Pane>
                </Tab.Content>
            ) : null}
        </Tab.Container>
    )
}

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
        return [`api/users/${user_pk}/locations`, {}]
    }
}
