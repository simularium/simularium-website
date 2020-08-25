import React, { useState } from "react";
import { Tree } from "antd";
import { ActionCreator } from "redux";
import { TurnAgentsOnAction } from "../../state/selection/types";
import { TreeProps } from "antd/lib/tree";

interface CheckBoxTreeProps extends TreeProps {
    agentsOn: string[];
    turnAgentsOnByDisplayName: ActionCreator<TurnAgentsOnAction>;
}
const CheckBoxTree = ({
    agentsOn,
    treeData,
    turnAgentsOnByDisplayName,
}: CheckBoxTreeProps) => {
    console.log(agentsOn);
    const [expandedKeys, setExpandedKeys] = useState<string[]>(agentsOn);
    const [selectedKeys, setSelectedKeys] = useState<string[]>(agentsOn);
    const [autoExpandParent, setAutoExpandParent] = useState<boolean>(true);

    const onExpand = (expandedKeys: string[]) => {
        console.log("onExpand", expandedKeys);
        // if not set autoExpandParent to false, if children expanded, parent can not collapse.
        // or, you can remove all expanded children keys.
        setExpandedKeys(expandedKeys);
        setAutoExpandParent(false);
    };

    const onCheck = (
        checkedKeys: string[] | { checked: string[]; halfChecked: string[] }
    ) => {
        console.log("onCheck", checkedKeys);
        // setCheckedKeys(checkedKeys);
        turnAgentsOnByDisplayName(checkedKeys);
    };

    // const onSelect = (selectedKeys: string[], info) => {
    //     console.log("onSelect", info);
    //     setSelectedKeys(selectedKeys);
    // };

    return (
        <Tree
            checkable
            onExpand={onExpand}
            expandedKeys={expandedKeys}
            autoExpandParent={autoExpandParent}
            onCheck={onCheck}
            checkedKeys={agentsOn}
            // onSelect={onSelect}
            // selectedKeys={selectedKeys}
            treeData={treeData}
        />
    );
};

export default CheckBoxTree;
