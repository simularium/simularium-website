import React from "react";
import { Col, Row } from "antd";
import { ActionCreator } from "redux";
import { CheckboxChangeEvent, CheckboxOptionType } from "antd/lib/checkbox";
import { map } from "lodash";
import classNames from "classnames";

import {
    ChangeAgentsRenderingStateAction,
    VisibilitySelectionMap,
} from "../../state/selection/types";
import SharedCheckbox from "../SharedCheckbox";
import CheckboxTreeSubmenu from "../CheckboxTreeSubmenu";
import TreeNode from "../TreeNode";
import Checkbox from "../Checkbox";
import { CHECKBOX_TYPE_STAR } from "../../constants";

export interface AgentDisplayNode {
    title: string;
    key: string;
    children: CheckboxOptionType[];
}

interface CheckBoxTreeProps {
    treeData: AgentDisplayNode[];
    agentsChecked: VisibilitySelectionMap;
    agentsHighlighted: VisibilitySelectionMap;
    handleAgentCheck: ActionCreator<ChangeAgentsRenderingStateAction>;
    handleHighlight: ActionCreator<ChangeAgentsRenderingStateAction>;
}

const styles = require("./style.css");

const CheckBoxTree = ({
    agentsChecked,
    agentsHighlighted,
    treeData,
    handleAgentCheck,
    handleHighlight,
}: CheckBoxTreeProps): JSX.Element => {
    const onSubCheckboxChange = (key: string, values: string[]) => {
        handleAgentCheck({ [key]: values });
    };

    const onSubHighlightChange = (key: string, values: string[]) => {
        handleHighlight({ [key]: values });
    };

    const onTopLevelCheck = (checkedKeys: { [key: string]: string[] }) => {
        handleAgentCheck(checkedKeys);
    };

    const onTopLevelHighlightChange = (checkedKeys: {
        [key: string]: string[];
    }) => {
        handleHighlight(checkedKeys);
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

    const renderSharedCheckboxes = (nodeData: AgentDisplayNode) =>
        nodeData.children.length ? (
            <Row key="actions">
                <Col span={12}>
                    <SharedCheckbox
                        title={nodeData.title}
                        showLabel={false}
                        checkboxType={CHECKBOX_TYPE_STAR}
                        options={map(nodeData.children, "value" as string)}
                        onTopLevelCheck={onTopLevelHighlightChange}
                        checkedList={agentsHighlighted[nodeData.title] || []}
                    />
                </Col>
                <Col span={12}>
                    <SharedCheckbox
                        title={nodeData.title}
                        showLabel={false}
                        options={map(nodeData.children, "value" as string)}
                        onTopLevelCheck={onTopLevelCheck}
                        checkedList={agentsChecked[nodeData.title] || []}
                    />
                </Col>
            </Row>
        ) : (
            <Checkbox
                key={nodeData.title}
                onChange={(event) =>
                    onAgentWithNoTagsChange(event, nodeData.title)
                }
            >
                {nodeData.title}
            </Checkbox>
        );

    return treeData.length > 0 ? (
        <div className={styles.container}>
            <Row className={styles.colLabels}>
                <Col span={2} offset={4}>
                    <label
                        className={classNames(["icon-moon", styles.starIcon])}
                    />
                </Col>
                <Col span={3}>
                    <label>show</label>
                </Col>
                <Col flex={5}>
                    <label>type</label>
                </Col>
            </Row>
            {treeData.map((nodeData) => {
                return (
                    <TreeNode
                        headerContent={
                            <>
                                {renderSharedCheckboxes(nodeData)}{" "}
                                <label className={styles.headerLabel}>
                                    {nodeData.title}
                                </label>
                            </>
                        }
                        key={nodeData.key}
                    >
                        <Row className={styles.subMenu}>
                            <Col span={2} offset={3}>
                                <CheckboxTreeSubmenu
                                    options={nodeData.children}
                                    agentsHighlighted={
                                        agentsHighlighted[nodeData.title] || []
                                    }
                                    checkboxType={CHECKBOX_TYPE_STAR}
                                    onChange={(values) =>
                                        onSubHighlightChange(
                                            nodeData.title,
                                            values as string[]
                                        )
                                    }
                                />
                            </Col>
                            <Col span={2}>
                                <CheckboxTreeSubmenu
                                    options={nodeData.children}
                                    agentsHighlighted={
                                        agentsChecked[nodeData.title] || []
                                    }
                                    onChange={(values) =>
                                        onSubCheckboxChange(
                                            nodeData.title,
                                            values as string[]
                                        )
                                    }
                                />
                            </Col>
                            <Col span={5} offset={4} className={styles.label}>
                                {nodeData.children.map((value) => {
                                    return (
                                        <label
                                            className={styles.rowLabel}
                                            key={value.value as string}
                                        >
                                            {value.label}
                                        </label>
                                    );
                                })}
                            </Col>
                        </Row>
                    </TreeNode>
                );
            })}
        </div>
    ) : (
        <div>Load file</div>
    );
};

export default CheckBoxTree;
