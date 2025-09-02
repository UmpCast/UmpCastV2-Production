import React, { useState } from "react"
import { useParams } from "react-router-dom"

import { useApi, useMountEffect } from "common/hooks.js"

import Loader, { CustomToggle } from "common/components.js"

import UmpiresContainer from "components/league/umpires/UmpiresContainer.js"

import PendingRow from "./PendingRow.js"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Card, Row, Table, Dropdown } from "react-bootstrap"
import InvitUmpiresButton from "./InviteUmpiresButton.js"

const FRONTEND_URL = process.env.REACT_APP_FRONTEND_URL

export default function PendingUmpires() {
    const { pk } = useParams()

    const Api = useApi(requests)

    const useLeague = useState()
    const usePending = useState()

    const [league, setLeague] = useLeague
    const [pending, setPending] = usePending

    useMountEffect(() => {
        Promise.all([Api.fetchLeague(pk), Api.fetchPending(pk)]).then((res) => {
            setLeague(res[0].data)
            setPending(res[1].data)
        })
    })

    const inviteLink = league
        ? `${FRONTEND_URL}/league/${league.pk}`
        : FRONTEND_URL

    return (
        <UmpiresContainer league={league} active="pending">
            <Loader dep={[pending]}>
                    <Row>
                        <InvitUmpiresButton inviteLink={inviteLink} />
                    </Row>
                    <Row>
                        <Card className="mt-2 w-100">
                            <Table className="mb-0 table-borderless">
                                <thead>
                                    <tr className="bg-light border-bottom text-muted">
                                        <td className="float-right">
                                            <Dropdown>
                                                <Dropdown.Toggle
                                                    as={CustomToggle}
                                                >
                                                    <span className="mr-1">
                                                        Sort
                                                    </span>
                                                    <FontAwesomeIcon
                                                        className="pb-1"
                                                        icon={[
                                                            "fas",
                                                            "sort-down"
                                                        ]}
                                                    />
                                                </Dropdown.Toggle>
                                                <Dropdown.Menu></Dropdown.Menu>
                                            </Dropdown>
                                        </td>
                                    </tr>
                                </thead>
                                <tbody>
                                    <ListPending usePending={usePending} />
                                </tbody>
                            </Table>
                        </Card>
                    </Row>
            </Loader>
        </UmpiresContainer>
    )
}

const ListPending = ({ usePending }) =>
    usePending[0].results.map((status) => (
        <PendingRow status={status} usePending={usePending} key={status.pk} />
    ))

const requests = {
    fetchLeague: (league_pk) => [
        "api/leagues/",
        {
            pk: league_pk
        }
    ],
    fetchPending: (league_pk) => [
        "api/user-league-status/",
        {
            params: {
                league: league_pk,
                request_status: "pending"
            }
        },
        "GET"
    ]
}
