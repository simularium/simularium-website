import * as React from "react";
import CollaspableMenu from "../../components/CollapseableMenu";

const styles = require("./style.css");

export default class ModelPanel extends React.Component<{}, {}> {
    public render(): JSX.Element {
        return (
            <CollaspableMenu
                panelKeys={["graphing", "statistics"]}
                mainTitle="Adjustable Parameters"
                subTitles={["Adjustable Parameter", "Statistics"]}
                content={[null, null]}
            />
        );
    }
}
