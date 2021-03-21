import React, { useState, useCallback } from "react"
import ListPagination from "common/component/ListPagination"

const TestApp = () => {
    const [plusOne, setPlusOne] = useState(false)
    const fetchPage = useCallback((page_num) => {
        return {
            data: {
                count: 10,
                page_size: 1,
                results: [page_num]
            }
        }
    }, [])

    const fetchPagePlusOne = useCallback((page_num) => {
        return fetchPage(page_num + 1)
    }, [fetchPage])

    const render = (item) => <li>{item}</li>
    return (
        <div>
            <ListPagination
                fetchPage={plusOne ? fetchPagePlusOne : fetchPage}
                render={render}
            />
            <button onClick={() => setPlusOne(true)}>Fetch + 1</button>
        </div>
    )
}

export default TestApp
