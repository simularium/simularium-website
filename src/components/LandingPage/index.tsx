import * as React from "react";
import { Layout } from "antd";
import { Link } from "react-router-dom";

import { URL_PARAM_KEY_FILE_NAME } from "../../constants";
import trajectories from "../../constants/networked-trajectories";
import ModelCard from "../ModelCard";

const { Content } = Layout;

const styles = require("./style.css");

class LandingPage extends React.Component<{}, {}> {
    public render(): JSX.Element {
        return (
            <Content className={styles.content}>
                {trajectories.map((trajectory) => {
                    return (
                        <Link
                            key={trajectory.id}
                            to={{
                                pathname: "/viewer",
                                search: `?${URL_PARAM_KEY_FILE_NAME}=${
                                    trajectory.id
                                }`,
                            }}
                        >
                            <ModelCard trajectory={trajectory} />
                        </Link>
                    );
                })}
            </Content>
        );
    }
}

export default LandingPage;
