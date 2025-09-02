import React from "react"
import { ListGroup } from "react-bootstrap"

import usePagination from "./usePagination.js"
import GameListing from "./GameListing.js"

const GamePagination = ({ fetchPage }) => {
    const { items, itemCount, pageNumber, pageCount, nextPage } = usePagination(
        fetchPage
    )

    const renderedList = items.map((item) => (
        <GameListing game={item} key={item.pk} />
    ))

    return (
        <>
            <ListGroup className="w-100">
                <ListGroup.Item>
                    <strong>{itemCount} </strong>
                    games found
                </ListGroup.Item>
                {renderedList}
            </ListGroup>
            <div className="text-center mt-2">
                {pageNumber < pageCount ? (
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
            </div>
        </>
    )
}

export default GamePagination
