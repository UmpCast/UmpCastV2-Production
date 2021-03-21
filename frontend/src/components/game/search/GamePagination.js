import React from "react"
import { Row } from "react-bootstrap"

import GameListing from "./GameListing"

const GamePagination = ({ items, canNextPage, nextPage }) => {
    const renderedList = items.map((item) => (
        <GameListing game={item} key={item.pk} />
    ))

    return (
        <>
            <Row>{renderedList}</Row>
            <Row className="justify-content-center mt-2">
                {canNextPage ? (
                    <p
                        className="text-primary"
                        style={{ cursor: "pointer" }}
                        onClick={nextPage}
                    >
                        <u>View more</u>
                    </p>
                ) : (
                    <p className="text-muted">End of List</p>
                )}
            </Row>
        </>
    )
}

export default GamePagination
