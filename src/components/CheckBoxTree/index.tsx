import React from "react";
import { Col, Row, Typography } from "antd";
import { ActionCreator } from "redux";
import { CheckboxChangeEvent, CheckboxOptionType } from "antd/lib/checkbox";
import { map, filter, isEmpty } from "lodash";

import {
    ChangeAgentsRenderingStateAction,
    SetColorChangeAction,
    SetRecentColorsAction,
    SetVisibleAction,
    VisibilitySelectionMap,
} from "../../state/selection/types";
import SharedCheckbox from "../SharedCheckbox";
import CheckboxTreeSubmenu from "../CheckboxTreeSubmenu";
import TreeNode from "../TreeNode";
import Checkbox from "../Checkbox";
import { CHECKBOX_TYPE_STAR } from "../../constants";
import ColorSwatch from "../ColorSwatch";
import NoTypeMappingText from "../NoTrajectoriesText/NoTypeMappingText";

const { Text } = Typography;

interface CheckBoxWithColor extends CheckboxOptionType {
    color: string;
}

export interface AgentDisplayNode {
    title: string;
    key: string;
    children: CheckBoxWithColor[];
    color: string;
}

interface CheckBoxTreeProps {
    treeData: AgentDisplayNode[];
    agentsChecked: VisibilitySelectionMap;
    agentsHighlighted: VisibilitySelectionMap;
    handleAgentCheck: ActionCreator<ChangeAgentsRenderingStateAction>;
    handleHighlight: ActionCreator<ChangeAgentsRenderingStateAction>;
    setAgentsVisible: ActionCreator<SetVisibleAction>;
    payloadForSelectAll: VisibilitySelectionMap;
    payloadForSelectNone: VisibilitySelectionMap;
    isSharedCheckboxIndeterminate: boolean;
    recentColors: string[];
    setColorChange: ActionCreator<SetColorChangeAction>;
    setRecentColors: ActionCreator<SetRecentColorsAction>;
}
const CHECKBOX_SPAN_NO = 2;
import styles from "./style.css";

class CheckBoxTree extends React.Component<CheckBoxTreeProps> {
    onSubCheckboxChange = (key: string, values: string[]) => {
        const { handleAgentCheck } = this.props;
        handleAgentCheck({ [key]: values });
    };

    onSubHighlightChange = (key: string, values: string[]) => {
        const { handleHighlight } = this.props;
        handleHighlight({ [key]: values });
    };

    onTopLevelCheck = (checkedKeys: { [key: string]: string[] }) => {
        const { handleAgentCheck } = this.props;
        handleAgentCheck(checkedKeys);
    };

    toggleAllOnOff = (checkedKeys: { [key: string]: string[] }) => {
        const { setAgentsVisible, payloadForSelectNone, payloadForSelectAll } =
            this.props;
        if (!checkedKeys.All.length) {
            setAgentsVisible(payloadForSelectNone);
        } else {
            setAgentsVisible(payloadForSelectAll);
        }
    };

    onTopLevelHighlightChange = (checkedKeys: { [key: string]: string[] }) => {
        const { handleHighlight } = this.props;
        handleHighlight(checkedKeys);
    };

    onAgentWithNoTagsChangeHighlight = (
        event: CheckboxChangeEvent,
        title: string
    ) => {
        if (event.target.checked) {
            this.onSubHighlightChange(title, [title]);
        } else {
            this.onSubHighlightChange(title, []);
        }
    };

    onAgentWithNoTagsChangeVisible = (
        event: CheckboxChangeEvent,
        title: string
    ) => {
        if (event.target.checked) {
            this.onSubCheckboxChange(title, [title]);
        } else {
            this.onSubCheckboxChange(title, []);
        }
    };

    getAgentTags = (agentName: string): string[] => {
        const { treeData } = this.props;
        const tags: string[] = [""];
        const agent = treeData.find((agent) => agent.title === agentName);
        if (agent) {
            agent.children.forEach((child) => {
                tags.push(child.value as string);
            });
        }
        return tags;
    };

    renderCheckAllButton = () => {
        const { agentsChecked, treeData, isSharedCheckboxIndeterminate } =
            this.props;
        const checkedList = filter(
            map(agentsChecked, (value, key): string =>
                value.length ? key : ""
            )
        );
        return (
            <div className={styles.checkAllCheckbox}>
                <SharedCheckbox
                    title="All Agent Types"
                    showLabel={true}
                    options={map(treeData, "key" as string)}
                    onTopLevelCheck={this.toggleAllOnOff}
                    indeterminate={isSharedCheckboxIndeterminate}
                    checkedList={checkedList}
                    isHeader={false}
                />
            </div>
        );
    };

    renderHighlightNoChildren = (nodeData: AgentDisplayNode) => {
        const { agentsHighlighted } = this.props;
        const isHighlighted =
            isEmpty(agentsHighlighted) || !agentsHighlighted[nodeData.title]
                ? false
                : agentsHighlighted[nodeData.title].includes(nodeData.title);

        return (
            <Checkbox
                className={[styles.noChildrenRow].join(" ")}
                key={`${nodeData.title}-highlight`}
                checkboxType={CHECKBOX_TYPE_STAR}
                value={nodeData.title}
                checked={isHighlighted}
                onChange={(event) =>
                    this.onAgentWithNoTagsChangeHighlight(event, nodeData.title)
                }
            />
        );
    };

    renderCheckBoxNoChildren = (nodeData: AgentDisplayNode) => {
        const { agentsChecked } = this.props;

        const isVisible =
            isEmpty(agentsChecked) || !agentsChecked[nodeData.title]
                ? false
                : agentsChecked[nodeData.title].includes(nodeData.title);

        return (
            <Checkbox
                className={"header-checkbox"}
                key={`${nodeData.title}-onoff`}
                checked={isVisible}
                value={nodeData.title}
                onChange={(event) =>
                    this.onAgentWithNoTagsChangeVisible(event, nodeData.title)
                }
            />
        );
    };

    renderSharedCheckboxes = (
        nodeData: AgentDisplayNode,
        type: CHECKBOX_TYPE_STAR | undefined
    ) => {
        if (type === CHECKBOX_TYPE_STAR) {
            return (
                <SharedCheckbox
                    title={nodeData.title}
                    showLabel={false}
                    checkboxType={CHECKBOX_TYPE_STAR}
                    options={map(nodeData.children, "value" as string)}
                    onTopLevelCheck={this.onTopLevelHighlightChange}
                    checkedList={
                        this.props.agentsHighlighted[nodeData.title] || []
                    }
                    isHeader={true}
                />
            );
        } else {
            return (
                <SharedCheckbox
                    title={nodeData.title}
                    showLabel={false}
                    options={map(nodeData.children, "value" as string)}
                    onTopLevelCheck={this.onTopLevelCheck}
                    checkedList={this.props.agentsChecked[nodeData.title] || []}
                    isHeader={true}
                />
            );
        }
    };
    render() {
        const {
            agentsHighlighted,
            treeData,
            agentsChecked,
            recentColors,
            setColorChange,
            setRecentColors,
        } = this.props;
        return treeData.length > 0 ? (
            <div className={styles.container}>
                <TreeNode headerContent={this.renderCheckAllButton()} />
                {treeData.map((nodeData) => {
                    const childrenHaveDifferentColors =
                        !nodeData.children.every(
                            (el) => el.color === nodeData.children[0].color
                        );
                    return (
                        <TreeNode
                            headerContent={
                                <>
                                    {nodeData.children.length
                                        ? this.renderSharedCheckboxes(
                                              nodeData,
                                              CHECKBOX_TYPE_STAR
                                          )
                                        : this.renderHighlightNoChildren(
                                              nodeData
                                          )}{" "}
                                    <ColorSwatch
                                        childrenHaveDifferentColors={
                                            childrenHaveDifferentColors
                                        }
                                        color={nodeData.color}
                                        agentName={nodeData.title}
                                        tags={this.getAgentTags(nodeData.title)}
                                        recentColors={recentColors}
                                        setColorChange={setColorChange}
                                        setRecentColors={setRecentColors}
                                    />
                                    {nodeData.children.length
                                        ? this.renderSharedCheckboxes(
                                              nodeData,
                                              undefined
                                          )
                                        : this.renderCheckBoxNoChildren(
                                              nodeData
                                          )}{" "}
                                    <Text
                                        style={{ maxWidth: 143 }}
                                        ellipsis={{
                                            tooltip: nodeData.title,
                                        }}
                                    >
                                        <label className={styles.headerLabel}>
                                            {nodeData.title}
                                        </label>
                                    </Text>
                                </>
                            }
                            expandByDefault={!nodeData.color}
                            key={nodeData.key}
                        >
                            {nodeData.children.length > 0 && (
                                <Row className={styles.subMenu}>
                                    <Col span={CHECKBOX_SPAN_NO} offset={3}>
                                        <CheckboxTreeSubmenu
                                            options={nodeData.children}
                                            checkedAgents={
                                                agentsHighlighted[
                                                    nodeData.title
                                                ] || []
                                            }
                                            checkboxType={CHECKBOX_TYPE_STAR}
                                            onChange={(values) =>
                                                this.onSubHighlightChange(
                                                    nodeData.title,
                                                    values as string[]
                                                )
                                            }
                                        />
                                    </Col>
                                    <Col className={styles.colorSwatchColumn}>
                                        {nodeData.children.map((value) => {
                                            return (
                                                <div
                                                    key={`label-${nodeData.title}-${value.value}-color`}
                                                    className={
                                                        styles.rowLabelContainer
                                                    }
                                                >
                                                    <ColorSwatch
                                                        color={
                                                            value.color ||
                                                            nodeData.color
                                                        }
                                                        agentName={
                                                            nodeData.title
                                                        }
                                                        tags={[
                                                            value.value as string,
                                                        ]}
                                                        recentColors={
                                                            recentColors
                                                        }
                                                        setColorChange={
                                                            setColorChange
                                                        }
                                                        setRecentColors={
                                                            setRecentColors
                                                        }
                                                    />
                                                </div>
                                            );
                                        })}
                                    </Col>
                                    <Col className={styles.checkboxColumn}>
                                        <CheckboxTreeSubmenu
                                            options={nodeData.children}
                                            checkedAgents={
                                                agentsChecked[nodeData.title] ||
                                                []
                                            }
                                            onChange={(values) =>
                                                this.onSubCheckboxChange(
                                                    nodeData.title,
                                                    values as string[]
                                                )
                                            }
                                        />
                                    </Col>
                                    <Col className={styles.agentNamesColumn}>
                                        {nodeData.children.map((value) => {
                                            return (
                                                <div
                                                    key={`label-${nodeData.title}-${value.value}`}
                                                    className={
                                                        styles.rowLabelContainer
                                                    }
                                                >
                                                    <label
                                                        className={
                                                            styles.agentNameLabel
                                                        }
                                                        key={
                                                            value.value as string
                                                        }
                                                    >
                                                        {value.label}
                                                    </label>
                                                </div>
                                            );
                                        })}
                                    </Col>
                                </Row>
                            )}
                        </TreeNode>
                    );
                })}
            </div>
        ) : (
            <NoTypeMappingText />
        );
    }
}

export default CheckBoxTree;
