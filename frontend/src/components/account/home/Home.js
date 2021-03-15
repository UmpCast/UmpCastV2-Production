import React, { useState, Fragment } from "react"

import useUser from "common/hooks"

import Feed from "./feed/Feed"
import History from "./history/History"
import Visibility from "./visibility/Visibility"
import Upcoming from "./upcoming/Upcoming"
import Availability from "./availability/Availability"

import { Container, Row, Col, Tab, Nav } from "react-bootstrap"

export default function Dashboard() {
    const { user } = useUser()

    const [key, setKey] = useState("feed")

    const isUmpire = user.account_type === "umpire"

    const renderedTab = (key) => {
        switch (key) {
            case "feed":
                return <Feed />
            case "history":
                return <History />
            case "visibility":
                return <Visibility />
            case "availability":
                return <Availability />
            default:
                return null
        }
    }

    return (
        <Container fluid={"lg"} className="mt-4">
            <Row>
                <Col className="order-xs-last mt-3">
                    <Nav
                        activeKey={key}
                        variant="tabs"
                        onSelect={(k) => setKey(k)}
                    >
                        <Nav.Item>
                            <Nav.Link eventKey="feed">Feed</Nav.Link>
                        </Nav.Item>
                        {isUmpire ? (
                            <Fragment>
                                <Nav.Item>
                                    <Nav.Link eventKey="history">
                                        History
                                    </Nav.Link>
                                </Nav.Item>
                                <Nav.Item>
                                    <Nav.Link eventKey="visibility">
                                        Visibility
                                    </Nav.Link>
                                </Nav.Item>
                                <Nav.Item>
                                    <Nav.Link eventKey="availability">
                                        Availability
                                    </Nav.Link>
                                </Nav.Item>
                            </Fragment>
                        ) : null}
                    </Nav>
                    <Tab.Content>
                        <Tab.Pane active>{renderedTab(key)}</Tab.Pane>
                    </Tab.Content>
                </Col>
                {user.account_type === "umpire" ? (
                    <Col
                        xs={{ span: 12, order: "first" }}
                        md={{ span: 5, order: "last" }}
                        lg={4}
                        className="pr-xl-3 mt-3"
                    >
                        <Upcoming />
                    </Col>
                ) : null}
            </Row>
        </Container>
    )
}
