import * as React from "react";
import { Checkbox } from "antd";
import { CheckboxValueType } from "antd/lib/checkbox/Group";

interface CheckBoxesProps {
    options: string[];
    onChange: (checked: CheckboxValueType[]) => void;
    values: string[];
    title: string;
}

import React from "react";
import { Checkbox } from "antd";

export default class SharedCheckbox extends React.Component {
    constructor(props) {
        super(props);
        this.onCheckAllChange = this.onCheckAllChange.bind(this);
        this.state = {
            checkedList: props.checkedList,
            indeterminate: true,
            checkAll: false,
        };
    }

    componentWillReceiveProps(newProps) {
        const { checkedList, allOptions } = newProps;
        this.setState({
            checkedList,
            indeterminate:
                !!checkedList.length && checkedList.length < allOptions.length,
            checkAll: checkedList.length === allOptions.length,
        });
    }

    onCheckAllChange({ target }) {
        const { allOptions, onChecked, onUnchecekd } = this.props;
        target.checked ? onChecked(allOptions) : onUnchecekd(allOptions);
        this.setState({
            checkedList: target.checked ? allOptions : [],
            indeterminate: false,
            checkAll: target.checked,
        });
    }

    render() {
        const { label } = this.props;
        return (
            <Checkbox
                indeterminate={this.state.indeterminate}
                onChange={this.onCheckAllChange}
                checked={this.state.checkAll}
                style={{ margin: "auto", width: 120 }}
            >
                {label}
            </Checkbox>
        );
    }
}
