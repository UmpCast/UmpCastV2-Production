import React, { Fragment } from 'react'

import { useDisplay } from "common/hooks.js"

import Loader from "common/components.js"

import { Container } from "react-bootstrap"

export default function DisplayContainer({ children }) {

    const [Display] = useDisplay()

    return (
        <Fragment>
            {/* {Display.alert && Display.alert} */}
            < Container
                fluid
                className={`p-0 no-select ${Display.loading > 0 ? "ump-loading-container" : null}`}>
                {children}
                <Loader dep={[Display.loading > 0]}>
                    <div className="ump-loading-spinner">
                        <div style={{zIndex: "100"}}>Loading...</div>
                    </div>
                </Loader>
            </Container >
        </Fragment>

    )
}
