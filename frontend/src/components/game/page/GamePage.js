import React, { useState } from "react"
import { useParams } from "react-router-dom"
import dayjs from "dayjs"

import useUser, { useApi, useMountEffect } from "common/hooks.js"

import Loader from "common/components.js"

import GameBanner from "./GameBanner.js"
import Post from "./Post.js"

import { Row, Col, Tabs, Tab } from "react-bootstrap"

export default function GamePage() {
    const { pk } = useParams()

    const Api = useApi(requests)
    const { user } = useUser()

    const useGame = useState()
    const [division, setDivision] = useState()
    const [league, setLeague] = useState()

    const [game, setGame] = useGame

    useMountEffect(() => {
        ;(async () => {
            const myGame = (await Api.fetchGame(pk)).data

            const [
                { data: myLeague },
                {
                    data: { results: myLocations }
                }
            ] = await Promise.all([
                Api.fetchLeague(myGame.league),
                Api.fetchLocations(myGame.league)
            ])

            myGame.location = myLocations.find(
                (loc) => loc.pk === myGame.location
            ).title
            setGame(myGame)

            const { divisions } = myLeague
            const myDivision = divisions.find(
                (division) => division.pk === myGame.division
            )

            setDivision(myDivision)

            delete myLeague.divisions
            setLeague(myLeague)
        })()
    })

    return (
        <div className="m-3 mx-xl-5 mt-xl-5 mb-xl-0">
            <Loader dep={[game, division, league]}>
                <GameBanner game={game} division={division} />
                
                <Row>
                    <Col>
                        <ListPosts
                            useGame={useGame}
                            division={division}
                            league={league}
                            user={user}
                        />
                    </Col>
                </Row>
            </Loader>
        </div>
    )
}

const ListPosts = (props) => {
    const { useGame, division, league, user } = props

    const [game] = useGame

    const roles = getRolesDict(division)
    const posts = getDetailedPosts(game, roles)

    const userApp = findUserApp(user.pk, posts)
    const gameStatus = getGameStatus(game, league, userApp)

    const list_posts = posts.map((post) => (
        <Tab title={post.role.title} eventKey={post.pk} key={post.pk}>
            <Post post={post} useGame={useGame} game_status={gameStatus} league={league}/>
        </Tab>
    ))

    return <Tabs>{list_posts}</Tabs>
}

const getRolesDict = (division) => {
    const roles = {}
    division.roles.map((role) => (roles[role.pk] = role))

    return roles
}

const getDetailedPosts = (game, roles) =>
    game.posts.map((post) => ({
        ...post,
        role: roles[post.role]
    }))

const findUserApp = (user_pk, posts) => {
    for (const post of posts) {
        const index = post.applications.findIndex(
            (app) => app.user.pk === user_pk
        )

        if (index !== -1) {
            return { post: post, index: index }
        }
    }
    return null
}

const getGameStatus = (game, league, user_app) => {
    const now = dayjs()
    const game_time = dayjs(game.date_time)

    if (game_time < now) {
        return { status: "game_over" }
    }

    const cancel_by = game_time.add(-league.cancellation_period, "day")
    const signup_after = game_time.add(-league.adv_scheduling_limit, "day")

    const cancel_expired = cancel_by < now
    const signups_not_open = now < signup_after

    if (signups_not_open) {
        const days_before_signup = signup_after.diff(now, "day") + 1
        return {
            status: "signups_not_open",
            days_before_signup: days_before_signup
        }
    } else if (user_app) {
        const { post, index } = user_app

        return {
            status: "scheduled",
            order: index,
            role: post.role.title,
            cancel_expired: cancel_expired
        }
    }

    return { status: "signups_open" }
}

const requests = {
    fetchGame: (game_pk) => [
        "api/games/",
        {
            pk: game_pk
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
    fetchLeague: (league_pk) => [
        "api/leagues/",
        {
            pk: league_pk
        }
    ]
}
