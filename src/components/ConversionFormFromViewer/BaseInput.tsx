import React from "react";
import { Input, Select } from "antd";

import styles from "./style.css";

interface BaseInputProps {
    dataType: string;
    handler: (event: any) => void;
    name: string;
    options: string[];
}

const BaseInput = (props: BaseInputProps) => {
    switch (props.dataType) {
        case "string":
            return (
                <label className={styles.nestedChildContainer}>
                    {" "}
                    {props.name}
                    <Input
                        type="text"
                        onChange={(e) => props.handler(e.target.value)}
                    />
                </label>
            );
        case "float":
            return (
                <label className={styles.nestedChildContainer}>
                    {" "}
                    {props.name}
                    <Input
                        type="number"
                        className={styles.numberInput}
                        onChange={(e) => props.handler(Number(e.target.value))}
                    />
                </label>
            );
        case "enum":
            const { options } = props;
            return (
                <label className={styles.nestedChildContainer}>
                    {props.name}
                    <Select onChange={(e) => props.handler(e.target.value)}>
                        {options.map((id) => (
                            <option key={id} value={id}>
                                {id}
                            </option>
                        ))}
                    </Select>
                </label>
            );
        case "file":
            return (
                <label className={styles.nestedChildContainer}>
                    {" "}
                    {props.name}
                    <Input
                        type="file"
                        onChange={async (e) => {
                            if (!e.target.files) {
                                return;
                            }
                            const file = e.target.files[0];
                            const trajectory = await file.text();
                            return props.handler(trajectory);
                        }}
                    />
                </label>
            );
        default:
            return (
                <label className={styles.nestedChildContainer}>
                    {" "}
                    {props.name}
                    <Input
                        type="text"
                        onChange={(e) => props.handler(e.target.value)}
                    />
                </label>
            );
    }
};

export default BaseInput;
