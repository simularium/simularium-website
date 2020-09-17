import React, { useState, Key } from "react";
import { Checkbox, Collapse, Col } from "antd";
import { ActionCreator } from "redux";
import {
    ChangeAgentsRenderingStateAction,
    VisibilitySelectionMap,
} from "../../state/selection/types";
import { TreeProps } from "antd/lib/tree";
import SharedCheckbox from "../SharedCheckbox";
import { CheckboxChangeEvent } from "antd/lib/checkbox";
const { Panel } = Collapse;

const CheckboxGroup = Checkbox.Group;

interface CheckBoxTreeProps {
    treeData: any[];
    agentsChecked: VisibilitySelectionMap;
    handleAgentCheck: ActionCreator<ChangeAgentsRenderingStateAction>;
    title: string;
}
const CheckBoxTree = ({
    agentsChecked,
    treeData,
    handleAgentCheck,
    title,
}: CheckBoxTreeProps) => {
    const [expandedKeys, setExpandedKeys] = useState<string[]>([]);
    const [autoExpandParent, setAutoExpandParent] = useState<boolean>(true);

    const onExpand = (expandedKeys: (string | number)[]) => {
        // if not set autoExpandParent to false, if children expanded, parent can not collapse.
        // or, you can remove all expanded children keys.
        setExpandedKeys(expandedKeys as string[]);
        setAutoExpandParent(false);
    };

    const onSubCheckboxChange = (key: string, values: string[]) => {
        handleAgentCheck({ [key]: values });
    };

    const onTopLevelCheck = (checkedKeys: { [key: string]: string[] }) => {
        handleAgentCheck(checkedKeys);
    };

    const onAgentWithNoTagsChange = (
        event: CheckboxChangeEvent,
        title: string
    ) => {
        event.preventDefault();
        if (event.target.checked) {
            onSubCheckboxChange(title, [title]);
        } else {
            onSubCheckboxChange(title, []);
        }
    };
    console.log("AGENTS CHECKED", agentsChecked);
    return treeData.length > 0 ? (
        <>
            <label>{title}</label>
            <Collapse defaultActiveKey={expandedKeys}>
                {treeData.map((data) => {
                    const options = [
                        data.title,
                        ...data.children.map((state) => state.title),
                    ];
                    if (data.children.length) {
                    }
                    return (
                        <Panel
                            header={
                                data.children.length ? (
                                    <SharedCheckbox
                                        title={data.title}
                                        options={options}
                                        onTopLevelCheck={onTopLevelCheck}
                                        checkedList={
                                            agentsChecked[data.title] || []
                                        }
                                    />
                                ) : (
                                    <Checkbox
                                        onChange={(event) =>
                                            onAgentWithNoTagsChange(
                                                event,
                                                data.title
                                            )
                                        }
                                    >
                                        {data.title}
                                    </Checkbox>
                                )
                            }
                            key={data.key}
                        >
                            <Col>
                                <CheckboxGroup
                                    options={options}
                                    value={agentsChecked[data.title] || []}
                                    onChange={(values) =>
                                        onSubCheckboxChange(
                                            data.title,
                                            values as string[]
                                        )
                                    }
                                />
                            </Col>
                            <Col>
                                <CheckboxGroup
                                    options={options}
                                    value={agentsChecked[data.title] || []}
                                    onChange={(values) =>
                                        onSubCheckboxChange(
                                            data.title,
                                            values as string[]
                                        )
                                    }
                                />
                            </Col>
                        </Panel>
                    );
                })}
            </Collapse>
        </>
    ) : (
        "Load file"
    );
};

export default CheckBoxTree;
