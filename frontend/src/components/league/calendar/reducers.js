import dayjs from "dayjs"

export const gamesReducer = (week_start) => (state, action) => {
    switch (action.type) {
        case "set": {
            return action.payload
        }
        case "add": {
            const game = action.payload
            const game_time = dayjs(game.date_time)
            if (week_start < game_time && game_time < week_start.add(7, "days"))
                return state.concat(game)
            return state
        }
        case "edit": {
            const edited_game = action.payload
            return state.map((game) => {
                if (game.pk === edited_game.pk) return edited_game
                return game
            })
        }
        case "delete": {
            return state.filter((game) => game.pk !== action.payload.pk)
        }
        default:
            return state
    }
}

export const locationsReducer = (state, action) => {
    switch (action.type) {
        case "set": {
            return action.payload
        }
        case "add": {
            const new_locations = state
                .concat(action.payload)
                .sort((el1, el2) => el1.title.localeCompare(el2.title))

            return new_locations
        }
        case "delete": {
            return state.filter(({ pk }) => pk !== action.payload)
        }
        default:
            return state
    }
}
