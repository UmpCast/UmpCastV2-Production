import React, { Fragment, useCallback, useState } from "react"

import useUser, { useApi } from "common/hooks"

import { ProfilePicture } from "common/components"
import { BasicConfirm } from "common/forms"
import { GameSignupConseq } from "components/game/Text"
import UmpireSearch from "./UmpireSearch"

import { Card } from "react-bootstrap"
import PrimaryBaseball from "assets/primary_baseball.png"

const SignupCard = (props) => {
    const { post, useGame, league } = props

    const apps = post.applications
    const [, setGame] = useGame

    const Api = useApi(requests)
    const { user } = useUser()

    const useShow = useState(false)

    const [show, setShow] = useShow

    const onUmpireSelect = useCallback(
        (umpire_pk) => {
            Api.Submit(() => Api.gameSignup(umpire_pk, post.pk)).then((res) => {
                const new_apps = post.applications.concat(res.data)

                setGame((game) => {
                    const new_posts = game.posts.map((item) =>
                        item.pk === post.pk
                            ? { ...item, applications: new_apps }
                            : item
                    )

                    return {
                        ...game,
                        posts: new_posts
                    }
                })
            })
        },
        [Api, post.pk, post.applications, setGame]
    )

    const onSubmit = () => {
        onUmpireSelect(user.pk)
    }

    return (
        <Fragment>
            <div
                className="border-secondary-dashed"
                style={{ cursor: "pointer" }}
            >
                <Card
                    className="text-center border-0 text-muted list-group-item-action"
                    onClick={() => setShow(true)}
                >
                    <Card.Body>
                        <Card.Title>
                            <strong>+ Click to add</strong>
                        </Card.Title>

                        <ProfilePicture
                            src={user.profile_picture}
                            alt={PrimaryBaseball}
                            className="rounded-circle img-thumbnail border-0 mt-2 mb-3 p-4"
                        />

                        <Card.Text>
                            {user.account_type === "manager"
                                ? "Search Umpire"
                                : "You"}
                        </Card.Text>
                    </Card.Body>
                </Card>
            </div>
            {user.account_type === "manager" ? (
                <UmpireSearch
                    league={league}
                    show={show}
                    setShow={setShow}
                    role={post.role}
                    onUmpireSelect={onUmpireSelect}
                />
            ) : (
                <BasicConfirm
                    action={`Signup for ${post.role.title}`}
                    action_text="Confirm"
                    consequences={<GameSignupConseq order={apps.length} />}
                    useShow={useShow}
                    onConfirm={onSubmit}
                />
            )}
        </Fragment>
    )
}

const requests = {
    gameSignup: (user_pk, post_pk) => [
        "api/applications/",
        {
            data: {
                user: user_pk,
                post: post_pk
            }
        },
        "POST"
    ]
}

export default SignupCard
