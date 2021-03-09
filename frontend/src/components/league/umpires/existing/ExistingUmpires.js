import React, { useState } from "react"
import { useParams } from "react-router-dom"

import { useApi, useMountEffect } from "common/hooks"
import Loader, { PageNav } from "common/components"

import UmpiresContainer from "components/league/umpires/UmpiresContainer"

import UmpireRow from "./Umpire/UmpireRow"
import ApplyLevelDropdown from "./ApplyLevelDropdown"

import { Row, Col, Table, Card, Button } from "react-bootstrap"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

const page_size = 10

export default function ManageUmpires() {
    const { pk } = useParams()

    const Api = useApi(requests)

    const useUls = useState()
    const useLeague = useState()
    const [selected, setSelected] = useState([])

    const [uls, setUls] = useUls
    const [league, setLeague] = useLeague
    const [loading, setLoading] = useState(true)

    useMountEffect(() => {
        Promise.all([Api.fetchLeague(pk), Api.fetchUls(pk)]).then((res) => {
            setLeague(res[0].data)
            setUls(res[1].data)
            setLoading(false)
        })
    })

    const setPage = (page) => {
        Api.fetchUls(pk, page).then((res) => {
            setUls(res.data)
        })
    }

    const onStatusSelected = ({ pk }) => {
        if (!selected.includes(pk)) setSelected(selected.concat(pk))
    }

    const onStatusDeselected = ({ pk }) => {
        setSelected(selected.filter((status_pk) => status_pk !== pk))
    }

    const resetSelected = () => setSelected([])

    const onStatusChange = (new_status) => {
        const i = uls.results.findIndex((status) => (status.pk = new_status.pk))
        uls[i] = new_status
        setUls(uls)
    }

    const renderedRows = (uls, league) => {
        const existing = uls.results.map((status) => {
            const isSelected = selected.includes(status.pk)

            return (
                <UmpireRow
                    status={status}
                    league={league}
                    isSelected={isSelected}
                    onStatusSelected={onStatusSelected}
                    onStatusDeselected={onStatusDeselected}
                    onStatusChange={onStatusChange}
                    key={status.pk}
                />
            )
        })

        return <tbody>{existing}</tbody>
    }

    const onDeleteUsers = () => {
        Api.Submit(() =>
            Promise.all(selected.map((uls_pk) => Api.deleteUls(uls_pk))).then(
                () => {
                    setPage(1)
                    resetSelected()
                }
            )
        )
    }

    return (
        <UmpiresContainer league={league} active="existing">
            <Loader dep={!loading}>
                <Row
                    className={`mb-2 mx-1 ${
                        selected.length > 0 ? "visible" : "invisible"
                    }`}
                    style={{ fontSize: "14px" }}
                >
                    {!loading ? (
                        <ApplyLevelDropdown
                            selected={selected}
                            levels={league.levels}
                            onLevelApplied={() => {
                                resetSelected()
                            }}
                        />
                    ) : null}
                    <Button
                        variant="outline-danger rounded"
                        className="mx-1 py-1 px-2"
                        onClick={onDeleteUsers}
                    >
                        <FontAwesomeIcon
                            icon={["fa", "minus-square"]}
                            className="mr-1 fa-xs"
                        />
                        Remove {selected.length}
                        <FontAwesomeIcon icon="user" className="fa-xs ml-1" />
                    </Button>
                    <Button
                        variant="outline-muted rounded"
                        className="ml-auto"
                        onClick={resetSelected}
                    >
                        Deselect All
                    </Button>
                </Row>
                <Row className="mb-3">
                    <Col>
                        <Card>
                            <div className="table-responsive">
                                <Table className="mb-0">
                                    <TableHead />
                                    {!loading
                                        ? renderedRows(uls, league)
                                        : null}
                                </Table>
                            </div>
                        </Card>
                    </Col>
                </Row>
                <Row>
                    <Col className="d-flex w-100">
                        <PageNav {...{ list: uls, setPage, page_size }} />
                    </Col>
                </Row>
            </Loader>
        </UmpiresContainer>
    )
}

const TableHead = () => (
    <thead>
        <tr className="bg-light text-muted ump-head-border-0">
            <th className="text-center">Select</th>
            <th className="text-center">Umpires</th>
            <th>Casts</th>
            <th>Backups</th>
            <th className="text-center">Visibility</th>
        </tr>
    </thead>
)

const requests = {
    fetchLeague: (league_pk) => [
        "api/leagues/",
        {
            pk: league_pk
        }
    ],
    fetchUls: (league_pk, page) => [
        "api/user-league-status/",
        {
            params: {
                league: league_pk,
                account_type: "umpire",
                request_status: "accepted",
                page_size: page_size,
                page: page
            }
        }
    ],
    deleteUls: (status_pk) => [
        "api/user-league-status/",
        {
            pk: status_pk
        },
        "DELETE"
    ]
}
