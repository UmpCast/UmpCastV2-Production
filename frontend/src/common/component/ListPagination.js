import { counter } from "@fortawesome/fontawesome-svg-core"
import React, { useState, useCallback, useEffect } from "react"
import { Col, Row } from "react-bootstrap"

const initialState = {
    pageCount: 1,
    items: [],
    loading: true
}

const initialPage = {
    value: 1,
    update: true
}

const ListPagination = ({ fetchPage, render }) => {
    const [state, setState] = useState(initialState)
    const [pageNumber, setPageNumber] = useState(initialPage)

    const appendNextPage = useCallback(
        async (state, pageNumber) => {

            const {
                page_count, items
            } = await fetchPage(pageNumber)

            setState({
                pageCount: page_count,
                items: state.items.concat(items),
                loading: false
            })
        },
        [fetchPage, setState]
    )

    useEffect(() => {
        setState(initialState)
        setPageNumber(initialPage)
    }, [appendNextPage])

    useEffect(() => {
        if (pageNumber.update) {
            setPageNumber({ ...pageNumber, update: false })
            appendNextPage(state, pageNumber.value)
        }
    }, [pageNumber, state, appendNextPage, setPageNumber])

    const onNextPage = () => {
        if (pageNumber.value < state.pageCount)
            setPageNumber({ value: pageNumber.value + 1, update: true })
    }

    const renderedList = state.items.map(render)

    return (
        <Col>
            {!state.loading ? (
                <>
                    <Row>{renderedList}</Row>
                    <Row className="justify-content-center mt-2">
                        {pageNumber.value < state.pageCount ? (
                            <p
                                className="text-primary"
                                style={{ cursor: "pointer" }}
                                onClick={onNextPage}
                            >
                                <u>View more</u>
                            </p>
                        ) : (
                            <p className="text-muted">
                                End of List
                            </p>
                        )}
                    </Row>
                </>
            ) : null}
        </Col>
    )
}

export default ListPagination
