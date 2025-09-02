import React, { useRef, useState, useEffect, useContext } from "react"
import axios from "axios"

import { UserContext, DisplayContext } from "global/Context.js"

import { TimerAlert } from "common/components.js"

import { myUrl, config } from "common/Api.js"

// eslint-disable-next-line react-hooks/exhaustive-deps
export const useMountEffect = (fun, dep = []) => useEffect(fun, dep)

const useUser = (full = false) => {
    const myUser = useContext(UserContext)
    return full ? myUser : myUser[0]
}

export const useDisplay = () => {
    return useContext(DisplayContext)
}

export const useFetchLeague = (pk) => {
    const requests = {
        fetchLeague: (league_pk) => [
            "api/leagues/",
            {
                pk: league_pk
            }
        ]
    }

    const Api = useApi(requests)

    const useLeague = useState()

    const [, setLeague] = useLeague

    useMountEffect(() => {
        Api.fetchLeague(pk).then((res) => setLeague(res.data))
    })

    return useLeague
}

export const useTokenLogin = () => {
    const Api = useApi()
    const [, setUser] = useUser(true)

    return (token) => {
        return Api.Generic(() =>
            axios.get(myUrl("api/users/me/"), config(token))
        ).then((res) => {
            const User = res.data

            setUser({
                isAuthenticated: true,
                isConfigured: User.account_type !== "inactive",
                user: User,
                token: token
            })

            localStorage.setItem("token", token)
        })
    }
}

export const useApi = (requests) => {
    const user = useUser()
    const myDisplay = useDisplay()

    const [, setDisplay] = myDisplay

    const ret = {}

    ret.Generic = (request, shouldLoad) => {
        if (shouldLoad)
            setDisplay((prevState) => ({
                ...prevState,
                loading: prevState.loading + 1
            }))

        return request().finally(() => {
            if (shouldLoad)
                setDisplay((prevState) => ({
                    ...prevState,
                    loading: prevState.loading - 1
                }))
        })
    }

    const basicApi = (endpoint, values, method = "get", shouldLoad = true) => {
        const { pk, params, data, content_type } = values

        return [
            () =>
                axios({
                    method: method,
                    url: myUrl(`${endpoint}${pk ? `${pk}/` : ""}`),
                    ...config(user.token, params, content_type),
                    data: data
                }).catch((err) => {
                    const { response } = err
                    if (response) {
                        switch (response.status) {
                            case 403:
                                console.warn('Permission denied:', response.data)
                                break
                            case 401:
                                console.warn('Authentication required')
                                break
                            case 400:
                                console.warn('Bad request:', response.data)
                                break
                            default:
                                console.warn('API error:', response.status, response.data)
                        }
                    } else {
                        console.warn('Network error:', err.message)
                    }
                    return Promise.reject(err) // Reject but don't throw uncaught error
                }),
            shouldLoad
        ]
    }

    if (requests)
        for (const [name, fun] of Object.entries(requests)) {
            ret[name] = (...vals) => ret.Generic(...basicApi(...fun(...vals)))
        }

    ret.Submit = ApiSubmit(myDisplay)

    return useRef(ret).current
}

const ApiSubmit = (myDisplay) => (request) => {
    const [, setDisplay] = myDisplay

    setDisplay((prevState) => ({
        ...prevState,
        loading: prevState.loading + 1
    }))

    let alertInfo = {}

    return request()
        .then((res) => {
            if (!res) return

            alertInfo.variant = "success"

            alertInfo.msg = ((code) => {
                switch (code) {
                    case 201:
                        return "Created!"
                    default:
                        return "Success!"
                }
            })(res.status)

            return res
        })
        .catch((err) => {
            alertInfo.variant = "danger"

            const { response } = err

            if (!response) {
                alertInfo.msg = JSON.stringify(err)
            } else {
                alertInfo.msg = ((code) => {
                    switch (code) {
                        case 400:
                            const { non_field_errors } = response.data
                            if (non_field_errors)
                                return JSON.stringify(non_field_errors)
                            return null
                        case 401:
                            return "Please sign-in first"
                        case 403:
                            return "You don't have permission!"
                        default:
                            return "Something unexpected went wrong!"
                    }
                })(response.status)
            }

            return Promise.reject(err)
        })
        .finally(() => {
            const { variant, msg } = alertInfo

            setDisplay((prevState) => {
                const updatedDisplay = { loading: prevState.loading - 1 }

                if (variant && msg)
                    updatedDisplay.alert = (
                        <TimerAlert
                            variant={alertInfo.variant}
                            className="mb-0"
                            delay={3000}
                        >
                            {alertInfo.msg}
                        </TimerAlert>
                    )
                return { ...prevState, ...updatedDisplay}
            })
        })
}

export default useUser
