import React, { useState } from 'react'

import { useTokenLogin, useMountEffect } from "common/hooks.js"

import Loader from "common/components.js"

export default function AuthContainer({ children }) {

    const tokenLogin = useTokenLogin()

    const [fetched, setFetched] = useState(false)

    useMountEffect(() => {
        const token = localStorage.getItem("token")

        if (token) {
            tokenLogin(token)
                .catch((err) => {
                    if (err.response && err.response.status.code === 400)
                        localStorage.removeItem("token")
                })
                .finally(() => setFetched(true))
        } else {
            setFetched(true)
        }
    })

    return (
        <Loader dep={fetched}>
            {children}
        </Loader>
    )
}