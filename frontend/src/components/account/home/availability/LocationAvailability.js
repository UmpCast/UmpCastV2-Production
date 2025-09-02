import React from "react"

import useUser, { useApi } from "common/hooks.js"
import LeagueCard from "../visibility/LeagueCard.js"
import LocationToggle from "./LocationToggle.js"

export default function LocationAvailability({ user_locations, setLocation }) {
    const {
        leagues,
        locations,
        leagues_by_pk,
        locations_by_pk
    } = user_locations

    const Api = useApi(requests)
    const { user } = useUser()

    const renderLeagues = leagues_by_pk.map((league_pk) => {
        const league = leagues[league_pk]

        const league_locations = locations_by_pk.reduce((arr, location_pk) => {
            const location = locations[location_pk]

            if (location.league === league.pk) return arr.concat(location)
            return arr
        }, [])

        const onLocationToggled = (location_pk) => {
            const location = locations[location_pk]

            Api.patchLocationAvailability(
                user.pk,
                location_pk,
                !location.available
            )

            setLocation({
                ...location,
                available: !location.available
            })
        }

        const renderedLocations = league_locations.map((location) => (
            <LocationToggle
                key={location.pk}
                location={location}
                onLocationToggled={onLocationToggled}
            />
        ))

        return (
            <div className="mb-2" key={league_pk}>
                <LeagueCard league={league}>{renderedLocations}</LeagueCard>
            </div>
        )
    })

    return <div>{renderLeagues}</div>
}

const requests = {
    patchLocationAvailability(user_pk, location_pk, available) {
        return [
            `api/users/${user_pk}/toggle_location/`,
            {
                data: {
                    location: location_pk,
                    available
                }
            },
            "PATCH",
            false
        ]
    }
}
