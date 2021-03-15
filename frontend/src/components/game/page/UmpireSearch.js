import React, { useState, useMemo } from "react"

import { useApi } from "common/hooks"
import { ListGroup } from "react-bootstrap"

import SearchBar from "./SearchBar"
import UmpireListing from "./UmpireListing"

import { Modal } from "react-bootstrap"

const requests = (league_pk) => ({
    fetchRelevantUsers(query) {
        return [
            "api/user-league-status/",
            {
                params: {
                    league: league_pk,
                    request_status: "accepted",
                    account_type: "umpire",
                    page_size: 5
                }
            }
        ]
    }
})

export default function UmpireSearch({
    league,
    role,
    show,
    setShow,
    onUmpireSelect
}) {
    const Api = useApi(requests(league.pk))

    const [umpires, setUmpires] = useState([])

    const onShortSearch = () => umpires.length !== 0 && setUmpires([])

    const onLongSearch = (value) =>
        Api.fetchRelevantUsers(value).then((res) =>
            setUmpires(res.data.results)
        )

    const onHide = () => {
        setUmpires([])
        setShow(false)
    }

    const handleApply = (user_pk, casted = false) => {
        onUmpireSelect(user_pk, casted)
        onHide()
    }

    const renderedUmpires = umpires.map((uls) => {
        const canApply = uls.visibilities.includes(role.pk)

        return (
            <UmpireListing
                user={uls.user}
                canApply={canApply}
                handleApply={handleApply}
                key={uls.pk}
            />
        )
    })

    return (
        <Modal show={show} size="md" onHide={onHide}>
            <Modal.Header className="pt-3 pb-1 no-border">
                <h5 className="my-auto mx-auto">
                    <strong>Search for an Umpire</strong>
                </h5>
            </Modal.Header>
            <Modal.Body>
                <SearchBar
                    onShortSearch={onShortSearch}
                    onLongSearch={onLongSearch}
                />
                <ListGroup className="mt-2">{renderedUmpires}</ListGroup>
            </Modal.Body>
            <Modal.Body className="text-center no-border py-0"></Modal.Body>
        </Modal>
    )
}
