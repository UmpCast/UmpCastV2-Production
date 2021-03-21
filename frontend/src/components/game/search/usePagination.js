import { useState, useCallback, useEffect } from "react"

const initialState = {
    pageCount: 0,
    itemCount: 0,
    items: [],
    loading: true
}

const initialPage = {
    value: 1,
    update: true
}

const usePagination = (fetchPage) => {
    const [state, setState] = useState(initialState)
    const [pageNumber, setPageNumber] = useState(initialPage)

    const appendNextPage = useCallback(
        async (state, pageNumber) => {
            if (fetchPage) {
                const { count, page_size, items } = await fetchPage(pageNumber)

                setState({
                    pageCount: Math.ceil(count / page_size),
                    itemCount: count,
                    items: state.items.concat(items),
                    loading: false
                })
            }
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

    const nextPage = () => {
        if (pageNumber.value < state.pageCount)
            setPageNumber({ value: pageNumber.value + 1, update: true })
    }

    return {
        ...state,
        pageNumber: pageNumber.value,
        nextPage
    }
}

export default usePagination
