import React, { useState } from "react"
import { useParams } from "react-router-dom"

import { useApi, useMountEffect } from "common/hooks.js"
import Loader, { PageNav } from "common/components.js"

import UmpiresContainer from "components/league/umpires/UmpiresContainer.js"

import UmpireRow from "./Umpire/UmpireRow.js"
import ApplyLevelDropdown from "./ApplyLevelDropdown.js"
import RemoveUmpiresButton from "./RemoveUmpiresButton.js"
import AdjustCastsButton from "./AdjustCastsButton.js"

import { Row, Col, Table, Card, Button } from "react-bootstrap"

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

    const onStatusSelected = (status) => {
        if (!selected.some(({ pk }) => pk === status.pk))
            setSelected(selected.concat(status))
    }

    const onStatusDeselected = ({ pk }) => {
        setSelected(selected.filter(({ pk: status_pk }) => status_pk !== pk))
    }

    const resetSelected = () => setSelected([])

    const onSeveralStatusChange = (new_statuses) => {
        console.log(new_statuses)
        const new_results = uls.results.reduce((arr, item) => {
            const updated = new_statuses.find(({ pk }) => pk === item.pk)
            if (updated)
                return arr.concat({
                    ...item,
                    max_casts: updated.max_casts,
                    max_backups: updated.max_backups
                })
            return arr.concat(item)
        }, [])
        setUls({ ...uls, results: new_results })
        resetSelected()
    }

    const renderedRows = (uls, league) => {
        const existing = uls.results.map((status) => {
            const isSelected = selected.some(({ pk }) => pk === status.pk)

            return (
                <UmpireRow
                    status={status}
                    league={league}
                    isSelected={isSelected}
                    onStatusSelected={onStatusSelected}
                    onStatusDeselected={onStatusDeselected}
                    key={status.pk}
                />
            )
        })

        return <tbody>{existing}</tbody>
    }

    const onDeleteUsers = () => {
        Api.Submit(() =>
            Promise.all(selected.map(({ pk }) => Api.deleteUls(pk))).then(
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
                    <AdjustCastsButton
                        selected={selected}
                        onSeveralStatusChange={onSeveralStatusChange}
                    />
                    <RemoveUmpiresButton
                        onDeleteUsers={onDeleteUsers}
                        umpiresCount={selected.length}
                    />
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
                            <Card.Body className="p-0 flex-row card-scroll">
                                <Table className="mb-0">
                                    <TableHead />
                                    {!loading
                                        ? renderedRows(uls, league)
                                        : null}
                                </Table>
                            </Card.Body>
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
