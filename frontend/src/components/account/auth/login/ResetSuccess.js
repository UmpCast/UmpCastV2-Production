import React from "react"

import { FocusContainer } from "common/components.js"

import { FontAwesomeIcon as Icon } from "@fortawesome/react-fontawesome"
import { Row, Col, Card } from "react-bootstrap"

export default function ResetSuccess({ queryParams }) {
    const reset_type = queryParams.get("reset_type")

    const icon = reset_type === "email" ? "envelope" : "phone"
    const message_src = reset_type === "email" ? "email" : "text"

    return (
        <FocusContainer wrap={true}>
            <Card>
                <Card.Body>
                    <div className="text-center">
                        <Icon icon={icon} className="fa-7x text-success mb-3" />
                        <br />
                        <h4
                            className="font-weight-strong"
                            style={{ lineHeight: 1.7 }}
                        >
                            Reset Success
                        </h4>
                        <Col>
                            <Row xs={8} className="mx-auto my-2">
                                <h6 className="mx-auto">
                                    Password succesfully reset! Go to your{" "}
                                    {message_src} for a temporary password
                                </h6>
                            </Row>
                            <Row className="mt-2">
                                <div className="mx-auto">
                                    <Row className="my-2">
                                        <Icon
                                            icon="exclamation-triangle"
                                            className="text-warning mr-1 my-auto"
                                        />
                                        Change the temporary password after
                                        logging in
                                    </Row>
                                    {reset_type === "email" ? (
                                        <Row className="my-2">
                                            <Icon
                                                icon="exclamation-triangle"
                                                className="text-warning mr-1 my-auto"
                                            />
                                            Check spam folders if email does not
                                            show up
                                        </Row>
                                    ) : null}
                                </div>
                            </Row>
                        </Col>
                    </div>
                </Card.Body>
            </Card>
        </FocusContainer>
    )
}

// {reset_type === "email"?
