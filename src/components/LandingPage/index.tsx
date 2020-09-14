import * as React from "react";
import { Layout } from "antd";
import { Link } from "react-router-dom";

import { URL_PARAM_KEY_FILE_NAME } from "../../constants";
import TRAJECTORIES from "../../constants/networked-trajectories";
import ModelCard from "../ModelCard";

const { Content } = Layout;

const styles = require("./style.css");

class LandingPage extends React.Component<{}, {}> {
    public render(): JSX.Element {
        return (
            <Content className={styles.content}>
                <div className={styles.intro}>
                    <h1>Simularium</h1>
                    <h2 className={styles.subheader}>
                        Create, visualize, and share biological simulations
                    </h2>
                    <br />
                    <p>
                        ​This project aims to involve the wider biology
                        community, especially wet lab biologists, in building
                        and analyzing spatial mechanistic simulations at
                        different levels of scale and connecting them in the
                        context of whole cells. Our goal is to facilitate
                        collaboration between experimental and computational
                        biologists by building software tools and infrastructure
                        to allow easy access to software packages written by
                        computational biologists and easy visualization and
                        sharing of results.
                    </p>
                </div>
                <div className={styles.library}>
                    <div className={styles.intro}>
                        <h2>Simulation Trajectory Library</h2>
                        <br />
                        <p>
                            Try Simularium for yourself by selecting from the
                            simulation trajectories below.
                        </p>
                    </div>
                    <div className={styles.trajectories}>
                        {TRAJECTORIES.map((trajectory) => {
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
                    </div>
                </div>
            </Content>
        );
    }
}

export default LandingPage;
