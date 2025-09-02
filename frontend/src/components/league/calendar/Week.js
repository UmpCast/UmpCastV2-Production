import React, { Fragment, createElement } from "react"
import dayjs from "dayjs"
import localizedFormat from "dayjs/plugin/localizedFormat.js"

import Loader from "common/components.js"

import ListDay from "./ListDay.js"
import ColumnDay from "./ColumnDay.js"
import NoGame from "./NoGame.js"

import { Row, Col } from "react-bootstrap"

dayjs.extend(localizedFormat)

export default function Week(props) {
    const { start, games } = props

    const weekGames = binByDay(games)

    const weekViews = [ColumnDay, ListDay].map((component) =>
        weekGames.map((day_games, index) =>
            createElement(component, {
                games: day_games,
                date: start.add(index, "day"),
                key: index,
            })
        )
    )

    const now = dayjs()
    const end = start.add(7, "days")
    const thisWeek = start <= now && now < end

    return (
        <Fragment>
            <div className="d-none d-lg-block">
                <Row>{weekViews[0]}</Row>
            </div>
            <div className="d-lg-none">
                <Col>{weekViews[1]}</Col>
                <Loader dep={!thisWeek && games.length === 0}>
                    <NoGame>No Games This Week</NoGame>
                </Loader>
            </div>
        </Fragment>
    )
}

const binByDay = (games) => {
    const days = new Array(7)
    for (let i = 0; i < 7; i++) {
        days[i] = []
    }

    for (const game of games) {
        const game_time = dayjs(game.date_time)
        days[game_time.day()].push(game)
    }

    return days
}
