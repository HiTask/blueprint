/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import * as React from "react";

import { H5, Position, Radio, RadioGroup, Switch } from "@blueprintjs/core";
import { Example, handleBooleanChange, handleStringChange, IExampleProps } from "@blueprintjs/docs-theme";
import { TimezoneDisplayFormat, TimezonePicker } from "@blueprintjs/timezone";
import { CustomTimezonePickerTarget } from "./components";

export interface ITimezonePickerExampleState {
    disabled: boolean;
    showCustomTarget: boolean;
    showLocalTimezone: boolean;
    targetDisplayFormat: TimezoneDisplayFormat;
    timezone: string;
}

export class TimezonePickerExample extends React.PureComponent<IExampleProps, ITimezonePickerExampleState> {
    public state: ITimezonePickerExampleState = {
        disabled: false,
        showCustomTarget: false,
        showLocalTimezone: true,
        targetDisplayFormat: TimezoneDisplayFormat.COMPOSITE,
        timezone: "",
    };

    private handleDisabledChange = handleBooleanChange(disabled => this.setState({ disabled }));
    private handleShowLocalChange = handleBooleanChange(showLocalTimezone => this.setState({ showLocalTimezone }));
    private handleCustomChildChange = handleBooleanChange(showCustomTarget => this.setState({ showCustomTarget }));
    private handleFormatChange = handleStringChange((targetDisplayFormat: TimezoneDisplayFormat) =>
        this.setState({ targetDisplayFormat }),
    );

    public render() {
        const { timezone, targetDisplayFormat, disabled, showCustomTarget, showLocalTimezone } = this.state;

        const options = (
            <>
                <H5>Props</H5>
                <Switch checked={showLocalTimezone} label="Show local timezone" onChange={this.handleShowLocalChange} />
                <Switch checked={disabled} label="Disabled" onChange={this.handleDisabledChange} />
                <RadioGroup
                    label="Display format"
                    onChange={this.handleFormatChange}
                    selectedValue={this.state.targetDisplayFormat}
                >
                    <Radio label="Abbreviation" value={TimezoneDisplayFormat.ABBREVIATION} />
                    <Radio label="Composite" value={TimezoneDisplayFormat.COMPOSITE} />
                    <Radio label="Name" value={TimezoneDisplayFormat.NAME} />
                    <Radio label="Offset" value={TimezoneDisplayFormat.OFFSET} />
                </RadioGroup>
                <H5>Example</H5>
                <Switch checked={showCustomTarget} label="Custom target" onChange={this.handleCustomChildChange} />
            </>
        );

        return (
            <Example options={options} {...this.props}>
                <TimezonePicker
                    value={timezone}
                    onChange={this.handleTimezoneChange}
                    valueDisplayFormat={targetDisplayFormat}
                    popoverProps={{ position: Position.BOTTOM }}
                    showLocalTimezone={showLocalTimezone}
                    disabled={disabled}
                >
                    {showCustomTarget ? this.renderCustomTarget() : undefined}
                </TimezonePicker>
            </Example>
        );
    }

    private renderCustomTarget() {
        return <CustomTimezonePickerTarget timezone={this.state.timezone} />;
    }

    private handleTimezoneChange = (timezone: string) => this.setState({ timezone });
}
