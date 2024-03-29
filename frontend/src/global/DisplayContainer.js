import React, { Fragment } from 'react'
import ClipLoader from "react-spinners/ClipLoader"

import { useDisplay } from "common/hooks"

import Loader from "common/components"

import { Container } from "react-bootstrap"

export default function DisplayContainer({ children }) {

    const [Display] = useDisplay()

    return (
        <Fragment>
            {Display.alert}
            < Container
                fluid
                className={`p-0 no-select ${Display.loading > 0 ? "ump-loading-container" : null}`}>
                {children}
                <Loader dep={[Display.loading > 0]}>
                    <div className="ump-loading-spinner">
                        <ClipLoader
                            size={75}
                            color={"#2375DF"}
                            style={{zIndex: "100"}} />
                    </div>
                </Loader>
            </Container >
        </Fragment>

    )
}
