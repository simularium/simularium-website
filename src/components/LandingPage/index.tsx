import * as React from "react";
import { Button, Layout } from "antd";

import TRAJECTORIES from "../../constants/networked-trajectories";
import flowchartImg from "../../assets/overview-image.png";
import ModelCard from "../ModelCard";
import BlankCard from "../BlankCard";
import Footer from "../Footer";
import { TUTORIAL_PATHNAME } from "../../routes";

const { Content } = Layout;

const styles = require("./style.css");

const LandingPage: React.FunctionComponent<{}> = () => {
    return (
        <React.Fragment>
            <Content className={styles.content}>
                <div className={styles.panel}>
                    <h1>Simularium</h1>
                    <h2>
                        Visualize, analyze, interrogate & share biological
                        simulations
                    </h2>
                    <br />
                    <p>
                        Simularium makes it easy to share and analyze spatial
                        simulations directly in a web browser. Its major goal is
                        to facilitate collaborations between experimental
                        biologists and computational biologists by removing
                        major challenges to accessing, running, sharing, and
                        analyzing simulation results.
                    </p>
                </div>
                <div
                    className={styles.trySimulariumPanel}
                    id="try-simularium-now"
                >
                    <h1>Try Simularium now</h1>
                    <h2>View example simulations or load your own data</h2>
                    <br />
                    <p>
                        With this first release we present the{" "}
                        <i>Simularium Viewer</i>, an online visual analysis
                        tool, which is just one component of the larger
                        Simularium platform. The Simularium Viewer provides an
                        online application for visualizing simulation
                        trajectories and related plots.
                    </p>
                    <div className={styles.cards}>
                        {TRAJECTORIES.map((trajectory) => {
                            return (
                                <ModelCard
                                    key={trajectory.id}
                                    trajectory={trajectory}
                                />
                            );
                        })}
                        <BlankCard />
                    </div>
                    <div className={styles.caption}>
                        Click on any of the examples above to interact with
                        example trajectories from various types of previously
                        published simulations. Future versions of Simularium
                        will allow you to modify, run, and even create
                        simulations.
                    </div>
                    <p>
                        Simularium v1.0 allows you to interact with
                        precalculated simulation results &mdash; including your
                        own results{" "}
                        <a href={`${TUTORIAL_PATHNAME}#convert-your-data`}>
                            converted
                        </a>{" "}
                        into the Simularium file format (JSON). The Simularium
                        Viewer uses advanced rendering techniques developed by{" "}
                        <a href="https://www.cg.tuwien.ac.at/research/publications/2015/cellVIEW_2015/">
                            Le Muzic et al. (2015)
                        </a>{" "}
                        to enable meaningful interpretation of spatial
                        relationships among thousands of moving components.
                        Users can import a trajectory file (JSON format) from
                        their computer, or they can stream provided examples by
                        choosing one from the <i>Load model</i> dropdown or by
                        clicking on a card above. Future versions of Simularium
                        will allow you to modify, run, and even create
                        simulations.
                    </p>
                    <img
                        className={styles.flowchart}
                        alt="A flowchart summarizing how Simularium currently works"
                        src={flowchartImg}
                    />
                </div>
                <div className={styles.callToActionPanel}>
                    <h1>Connect with us</h1>
                    <h2>
                        Receive updates and/or collaborate on your project by
                        signing up
                    </h2>
                    <p>
                        We plan to collect user feedback to improve this
                        application in an effort to facilitate collaborations
                        between model creators and potential model users. Please{" "}
                        <a href="https://forms.gle/mwoJjaj3PcbTVStU7">
                            contact us
                        </a>{" "}
                        if you have feature requests, bugs to report, or want to
                        be alerted to major updates.
                    </p>
                    <Button
                        type="primary"
                        href="https://forms.gle/mwoJjaj3PcbTVStU7"
                    >
                        Sign up
                    </Button>
                </div>
                <div className={styles.futureSimulariumPanel}>
                    <h1>Future plans for Simularium</h1>
                    <h2>
                        Create, modify, run, experiment, share, interoperate, &
                        grow as a community
                    </h2>
                    <br />
                    <p>
                        In the next phase of its development, Simularium will
                        enable users to modify simulation parameters for
                        provided models through the web-based interface, to run
                        the modified simulations on the cloud, and to analyze
                        the results. Simularium currently supports{" "}
                        <a href="https://gitlab.com/f.nedelec/cytosim">
                            CytoSim
                        </a>{" "}
                        and <a href="https://readdy.github.io/">ReaDDy</a>. We
                        plan to wrap several published packages that can serve
                        as templates for community development and to encourage
                        growth of the system by providing a well- documented API
                        for simulation engine integration.
                    </p>
                    <p>
                        We are investigating the use of these types of
                        simulations and the various simulation engines that
                        generated them for use in building an integrated,
                        mechanistic understanding of human cells. We will also
                        work with educators at all levels of science teaching to
                        integrate and test Simularium’s potential for use in
                        active learning classroom/lab/homework activities.
                    </p>
                </div>
            </Content>
            <Footer />
        </React.Fragment>
    );
};

export default LandingPage;
