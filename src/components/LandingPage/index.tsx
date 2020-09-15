import * as React from "react";
import { Layout } from "antd";
import { Link } from "react-router-dom";

import TRAJECTORIES from "../../constants/networked-trajectories";
import ModelCard from "../ModelCard";

const { Content } = Layout;

const styles = require("./style.css");

class LandingPage extends React.Component<{}, {}> {
    public render(): JSX.Element {
        return (
            <Content className={styles.content}>
                <div className={styles.text}>
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
                    <div className={styles.text}>
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
                                <ModelCard
                                    key={trajectory.id}
                                    trajectory={trajectory}
                                />
                            );
                        })}
                    </div>
                </div>
                <div className={styles.text}>
                    <img
                        className={styles.flowchart}
                        alt="A flowchart describing Simularium use"
                        src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
                    />
                    <p>
                        We have begun by building initial models for nucleating
                        branched actin and growing microtubules as example
                        systems, using the software package ReaDDy to simulate
                        reaction-diffusion and dynamics and CytoSim to connect
                        these coarse-grained molecular models to larger scale
                        filament models of cytoskeletal networks. Our goal is to
                        provide the resulting multiscale models to the community
                        as a starting point for modeling their favorite aspect
                        of cytoskeletal systems via a user interface on the web
                        or programmatically through a python API. As we add more
                        software packages and models, our long-term goal is to
                        support mechanistic modeling of all cell systems at
                        different levels of scale.
                    </p>
                    <p>
                        A visual user interface on a website allows biologists
                        to create computational biological models by dragging
                        and dropping components, either starting from scratch or
                        reusing components that others have built. When they’re
                        ready, they run their model and interact with the
                        results in real time by navigating through a 3D “video
                        game” world full of the cells and molecules they
                        created. They pull up graphs and charts and configure
                        them to help understand the results. When they want to
                        share their findings with colleagues or provide
                        supplemental materials for their next paper, they
                        generate a link to their simulation playground where
                        others can change parameters and explore their
                        conclusions.​
                    </p>
                    <p>
                        The backend application accepts inputs from this user
                        interface and sends them to existing 3rd party
                        simulation software packages for computation. As results
                        are calculated on the server, they are collected and
                        sent back to the viewport on the website so the user can
                        see what is happening in 3D space and create graphs and
                        other data visualizations. Computational biologists, who
                        generally create these kinds of simulations by writing
                        custom software, can upload the results of their
                        simulations directly to the web viewport so they can
                        easily be explored and shared, and also can contribute
                        their software package as a 3rd party simulation engine.
                    </p>
                    <p>
                        Educators can peruse a library of simulations these
                        researchers have published and use them to build
                        interactive activities for their students. If you change
                        the rate of a reaction, how does that affect the outcome
                        of the simulation? These activities can be contributed
                        back to a library that other educators can use. Some of
                        these activities could also be published alongside news
                        articles for the general public to explore.
                    </p>
                </div>
            </Content>
        );
    }
}

export default LandingPage;
