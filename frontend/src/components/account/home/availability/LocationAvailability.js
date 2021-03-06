import React from "react"

import LeagueCard from "../visibility/LeagueCard"
import LocationToggle from "./LocationToggle"

export default function LocationAvailability({ user_locations, setLocation }) {
    const { leagues, locations, leagues_by_pk, locations_by_pk } = user_locations

    const renderLeagues = leagues_by_pk.map((league_pk) => {
        const league = leagues[league_pk]

        const league_locations = locations_by_pk.reduce((arr, location_pk) => {
            const location = locations[location_pk]

            if (location.league === league.pk) return arr.concat(location)
            return arr
        }, [])

        const onLocationToggled = (location_pk) => {
            const location = locations[location_pk]
            setLocation({
                ...location,
                available: !location.available
            })
        }

        const renderedLocations = league_locations.map((location) => (
            <LocationToggle
                location={location}
                onLocationToggled={onLocationToggled}
            />
        ))

        return (
            <div className="mb-2">
                <LeagueCard league={league}>{renderedLocations}</LeagueCard>
            </div>
        )
    })

    return <div>{renderLeagues}</div>
}
