import { useEffect, useRef } from "react"

export default function useFocus() {
    const ref = useRef()

    useEffect(() =>{
        ref.current.focus()
    }, [ref])

    return [ref]
}
