import { useState, useEffect, useCallback } from "react"

export const useTimeout = () => {
    const [timeout, _setTimeout] = useState(undefined)

    const stopTimeout = useCallback(() => {
        clearTimeout(timeout)
        _setTimeout(undefined)
    }, [timeout])

    const storeTimeout = useCallback((f, t) => _setTimeout(setTimeout(f, t)), [
        _setTimeout
    ])

    useEffect(() => {
        return () => {
            if (timeout !== undefined) stopTimeout(timeout)
        }
    }, [timeout, stopTimeout])

    return [storeTimeout, stopTimeout]
}

export const useInterval = () => {
    const [interval, _setInterval] = useState(undefined)

    const stopInterval = useCallback(() => {
        clearInterval(interval)
        _setInterval(undefined)
    }, [interval])

    const storeInterval = useCallback(
        (f, t) => _setInterval(setInterval(f, t)),
        [_setInterval]
    )

    useEffect(() => {
        return () => {
            if (interval !== undefined) stopInterval(interval)
        }
    }, [interval, stopInterval])

    return [storeInterval, stopInterval]
}

export const useCountDown = () => {
    const [{ countDown, callback }, setCountDown] = useState({
        countDown: undefined,
        callback: undefined
    })

    const [countDownInterval, stopCountDown] = useInterval()

    useEffect(() => {
        if (countDown === undefined && callback !== undefined) callback()
    }, [countDown, callback])

    const startCountDown = (f, t) => {
        setCountDown({countDown: t, callback: f})

        countDownInterval(
            () =>
                setCountDown((state) => {
                    if (state.countDown === 0) {
                        stopCountDown()
                        return {...state, countDown: undefined}
                    }

                    return {...state, countDown: state.countDown - 1}
                }),
            1000
        )
    }

    return [countDown, startCountDown]
}
