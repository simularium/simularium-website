import { map } from "lodash";
import React from "react";
import { Collapse, Input } from "antd";
import { CaretRightOutlined } from "@ant-design/icons";

import {
    CustomParameter,
    CustomType,
} from "../../state/trajectory/conversion-data-types";
import {
    AvailableEngines,
    TemplateMap,
} from "../../state/trajectory/conversion-data-types";
import InputSwitch from "../ConversionFormInputSwitch";

import formStyles from "../../containers/ConversionForm/style.css";
import styles from "./style.css";

const { Panel } = Collapse;

interface ConversionOptionalInputsProps {
    template: CustomType;
    templateMap: TemplateMap;
    preConvertedFile: string;
    engineType: AvailableEngines;
    
}

class ConversionOptionalInputs extends React.Component<ConversionOptionalInputsProps> {
    constructor(props: ConversionOptionalInputsProps) {
        super(props);
        this.state = {};
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(path: string[], key: string, value: any) {
        // let newState: any = {};
        // if (path.length == 0) {
        //     newState = {
        //         ...this.state[key],
        //         [key] : value
        //     }
        // } else {
        //     // convert the paths into a nested object
        //     // make sure to copy any existing state at each level
        //     let tempObject = newState;
        //     let currentState = this.state[path[0]] || {};
        //     path.map((nestedKey: string, i: number, array: string[]) => {
        //         let thisValue;
        //         if (i == array.length - 1) {
        //             thisValue = {
        //                 ...currentState,
        //                 [key]: value,
        //             };
        //         } else {
        //             thisValue = { ...currentState };
        //             currentState = currentState[array[i + 1]] || {};
        //         }
        //         tempObject = tempObject[nestedKey] = thisValue;
        //     });
        // }
        // this.setState(newState);
    }

    handleSubmit(event: any) {
        // event.preventDefault();
        // const payload = {
        //     ...this.state,
        // };
        // console.log("submitting", payload);
        // this.props.submitFile(payload)
    }

    render() {
        const { template, templateMap, preConvertedFile } =
            this.props;
        if (templateMap && preConvertedFile) {
            console.log("TEMPLATE", template);
            const { parameters } = template;
            return (
                <div className={styles.container}>
                    <div>
                        <h2 className={formStyles.sectionTitle}>
                            Provide display information (optional)
                        </h2>
                        <h3 className={styles.convertText}>
                            You can import your model now with defaults, or
                            specify how you want your Smoldyn trajectory
                            displayed below.
                        </h3>
                        <h3 className={styles.convertText}>Trajectory title</h3>
                        <Input placeholder="Start typing..." />
                    </div>
                    <Collapse
                        accordion
                        className={styles.collapse}
                        bordered={false}
                        expandIcon={({ isActive }) => (
                            <CaretRightOutlined
                                style={{ fontSize: "16px", color: "#08c" }}
                                rotate={isActive ? 90 : 0}
                            />
                        )}
                    >
                        {map(
                            parameters,
                            (
                                parameter: CustomParameter,
                                key: string
                            ): JSX.Element | null => {
                                const dataType = parameter.data_type;
                                if (
                                    dataType === "file" ||
                                    dataType === "meta_data"
                                ) {
                                    return null;
                                }
                                if (templateMap[dataType]) {
                                    return (
                                        <Panel
                                            header={parameter.description}
                                            key={key}
                                            className={styles.panel}
                                        >
                                            <InputSwitch
                                                handler={this.handleChange}
                                                id={key}
                                                templateData={templateMap}
                                                parameter={parameter}
                                                dataType={dataType}
                                                path={[key]}
                                            />
                                        </Panel>
                                    );
                                }
                                return null;
                            }
                        )}
                        <Panel
                            key="placeholder"
                            header=""
                            showArrow={false}
                            collapsible="disabled"
                        ></Panel>
                    </Collapse>
                </div>
            );
        } else {
            return null;
        }
    }
}

export default ConversionOptionalInputs;
