import React from "react"
import { Alert } from "react-bootstrap"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

const getEmptyLeagues = (user_locations) => {
    const {
        leagues,
        leagues_by_pk,
        locations,
        locations_by_pk
    } = user_locations
    return leagues_by_pk
        .filter(
            (pk) =>
                !locations_by_pk.some(
                    
                    (_pk) =>
                        locations[_pk].available && locations[_pk].league === pk
                )
        )
        .map((pk) => leagues[pk].title)
}

const ImportantAlert = ({ children }) => (
    <Alert variant="danger" className="my-3">
        <FontAwesomeIcon icon="exclamation-circle" className="mr-2" />
        {children}
    </Alert>
)

export default function AvailabilityStatus({ availability }) {
    const emptySchedule = availability.schedule.current.length === 0
    const emptyLeagues = getEmptyLeagues(availability.user_locations)

    return (
        <div>
            {emptySchedule ? (
                <ImportantAlert>
                    Your <strong>Time Availability</strong> is empty! You cannot
                    be auto-assigned games by any league.
                </ImportantAlert>
            ) : emptyLeagues.length ? (
                <ImportantAlert>
                    Your <strong>Location Availability</strong> for
                    {` ${emptyLeagues.join(", ")} `}
                    is empty!
                    {` ${
                        emptyLeagues.length === 1
                            ? "This league"
                            : "These leagues"
                    } `}
                    cannot auto-assign games to you.
                </ImportantAlert>
            ) : (
                <Alert variant="success" className=" my-3">
                    <FontAwesomeIcon icon="check-circle" className="mr-2" />
                    You've configured time and location availability for all
                    leagues. Game auto-assign is enabled!
                </Alert>
            )}
        </div>
    )
}
