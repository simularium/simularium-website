import React, { useState, Key } from "react";
import { Checkbox, Collapse, Tree } from "antd";
import { ActionCreator } from "redux";
import { ChangeAgentsRenderingStateAction } from "../../state/selection/types";
import { TreeProps } from "antd/lib/tree";
const { Panel } = Collapse;

const { TreeNode } = Tree;

interface CheckBoxTreeProps {
    treeData: any[];
    agentsChecked: string[];
    handleCheck: ActionCreator<ChangeAgentsRenderingStateAction>;
    title: string;
}
const CheckBoxTree = ({
    agentsChecked,
    treeData,
    handleCheck,
    title,
}: CheckBoxTreeProps) => {
    const [expandedKeys, setExpandedKeys] = useState<string[]>(agentsChecked);
    const [autoExpandParent, setAutoExpandParent] = useState<boolean>(true);

    const onExpand = (expandedKeys: (string | number)[]) => {
        // if not set autoExpandParent to false, if children expanded, parent can not collapse.
        // or, you can remove all expanded children keys.
        setExpandedKeys(expandedKeys as string[]);
        setAutoExpandParent(false);
    };

    const onCheck = (
        checkedKeys: Key[] | { checked: Key[]; halfChecked: Key[] }
    ) => {
        handleCheck(checkedKeys);
    };

    console.log(title, treeData);
    return treeData.length > 0 ? (
        <>
            <label>{title}</label>
            <Collapse defaultActiveKey={expandedKeys}>
                {treeData.map((data) => (
                    <Panel header={data.title} key={data.key}>
                        {data.children &&
                            data.children.map((child) => {
                                <Checkbox>{child.title}</Checkbox>;
                            })}
                    </Panel>
                ))}
            </Collapse>
        </>
    ) : (
        "Load file"
    );
};

export default CheckBoxTree;
