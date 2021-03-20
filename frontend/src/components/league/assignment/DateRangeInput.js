import React from "react"
import { Controller } from "react-hook-form"

import DateTimePicker from "react-widgets/lib/DateTimePicker"
import { Form, Col} from "react-bootstrap"

import Moment from "moment"
import momentLocalizer from "react-widgets-moment"

Moment.locale("en")
momentLocalizer()

const DateRangeInput = ({
    hookForm: { control, getValues, setValue, watch },
    time = false,
    inline = false
}) => {
    return (
        <Form.Row>
            <Controller
                control={control}
                name="start"
                render={({ onChange, value }) => (
                    <Form.Group as={Col} xs={!inline ? 12 : null}>
                        <Form.Label>Start {time ? "Time" : "Date"}</Form.Label>
                        <DateTimePicker
                            value={value}
                            min={new Date()}
                            onChange={(v) => {
                                if (v > getValues("end"))
                                    setValue("end", v)
                                onChange(v)
                            }}
                            time={time}
                        />
                    </Form.Group>
                )}
            />
            <Controller
                control={control}
                name="end"
                render={({ onChange, value }) => (
                    <Form.Group as={Col}>
                        <Form.Label>End {time ? "Time" : "Date"}</Form.Label>
                        <DateTimePicker
                            value={value}
                            min={watch("start")}
                            onChange={onChange}
                            time={time}
                        />
                    </Form.Group>
                )}
            />
        </Form.Row>
    )
}

export default DateRangeInput
