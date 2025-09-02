import React, { Fragment } from "react"

import Loader from "common/components.js"

import LeagueBanner from "./banner/LeagueBanner.js"

import { Container } from "react-bootstrap"

export default function LeagueContainer(props) {

    const { active, league, children, ...rest } = props
    
    return (
        <Fragment>
            <Loader dep={[league]}>
                <LeagueBanner
                    {...{league, active, ...rest}} />
            </Loader>
            <div className="px-0 px-md-3 pt-3">
                <Container className="px-5">
                    {children}
                </Container>
            </div>
        </Fragment>
    )
}
