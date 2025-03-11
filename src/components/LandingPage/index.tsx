import * as React from "react";
import { Image, Layout } from "antd";
import ReactMarkdown from "react-markdown";

import TRAJECTORIES from "../../constants/networked-trajectories";
import flowchartImg from "../../assets/overview-image.png";
import agentRepOptionsImg from "../../assets/agent-rep-options.png";
import { BetaTag } from "../Icons";
import ModelCard from "../ModelCard";
import Footer from "../Footer";
import { TUTORIAL_PATHNAME } from "../../routes";
import { CYTOSIM_URL, READDY_URL } from "../../constants";
const markdown = require("../../../ACKNOWLEDGMENTS.md");
import styles from "./style.css";
const { Content } = Layout;
const NUM_CARDS_PER_ROW = 3;
// Add bullets to each heading
const markdownProcessed = markdown.default.replaceAll("##", "## &bull;");

const LandingPage = (): JSX.Element => {
    return (
        <React.Fragment>
            <Content className={styles.content}>
                <div className={styles.panel}>
                    <div className={styles.textContent}>
                        <h1>Simularium {BetaTag}</h1>
                        <h2>
                            Share, visualize, & interrogate biological
                            simulations online
                        </h2>
                        <br />
                        <p>
                            The Simularium Viewer makes it easy to share and
                            interrogate interactive 3D visualizations of
                            biological simulation trajectories and related plots
                            directly in a web browser. Its primary goal is to
                            facilitate collaborations among experimental and
                            computational biologists by removing major
                            challenges to sharing, accessing, and comparing
                            simulation results.
                        </p>
                    </div>
                </div>

                <div
                    className={styles.trySimulariumPanel}
                    id="try-simularium-now"
                >
                    <div className={styles.textContent}>
                        <h1>Try Simularium now</h1>
                        <h2>View example simulations or load your own data</h2>
                        <br />
                        <p>
                            With this first release we present the{" "}
                            <i>Simularium Viewer</i>, an online visual analysis
                            tool, which is one component of the larger
                            Simularium platform. The Simularium Viewer provides
                            an online application for visualizing simulation
                            trajectories and related plots.
                        </p>
                    </div>
                    <div className={styles.cards}>
                        {TRAJECTORIES.slice(0, NUM_CARDS_PER_ROW - 1).map(
                            (trajectory) => {
                                return (
                                    <ModelCard
                                        key={trajectory.id}
                                        trajectory={trajectory}
                                    />
                                );
                            }
                        )}
                        {TRAJECTORIES.slice(NUM_CARDS_PER_ROW - 1).map(
                            (trajectory) => {
                                return (
                                    <ModelCard
                                        key={trajectory.id}
                                        trajectory={trajectory}
                                    />
                                );
                            }
                        )}
                    </div>
                    <div className={styles.textContent}>
                        <div className={styles.caption}>
                            Click on any of the examples above to interact with
                            example trajectories from various types of
                            previously published simulations.
                        </div>
                        <p>
                            Simularium v1.0 allows you to interact with
                            precalculated simulation results &mdash; including
                            your own results{" "}
                            <a href={`${TUTORIAL_PATHNAME}#convert-your-data`}>
                                converted
                            </a>{" "}
                            into the Simularium file format (JSON). The
                            Simularium Viewer uses advanced rendering techniques
                            developed by{" "}
                            <a href="https://www.cg.tuwien.ac.at/research/publications/2015/cellVIEW_2015/">
                                Le Muzic et al. (2015)
                            </a>{" "}
                            and{" "}
                            <a href="https://ieeexplore.ieee.org/document/8017635">
                                Mindek et al. (2017)
                            </a>{" "}
                            to enable meaningful interpretation of spatial
                            relationships among thousands of moving components.
                            Users can import a trajectory file (JSON format)
                            from their computer, or they can stream provided
                            examples by choosing one from the <i>Load model</i>{" "}
                            dropdown or by clicking on a card above. Future
                            versions of Simularium will allow you to modify,
                            run, and even create simulations.
                        </p>
                        <img
                            className={styles.image}
                            alt="A flowchart summarizing how Simularium currently works"
                            src={flowchartImg}
                        />
                        <img
                            className={styles.imageBottom}
                            alt="Illustrations of different agent representation options"
                            src={agentRepOptionsImg}
                        />
                        <p>Current object representation options:</p>
                        <ul>
                            <li>
                                Spheres: by default, each agent in a scene is
                                represented as a single sphere
                            </li>
                            <li>
                                Mesh surfaces: represent each agent as a mesh
                                file, e.g. coarse molecular surfaces
                            </li>
                            <li>
                                Multi-sphere: provide Protein Databank .pdb
                                files
                            </li>
                            <li>
                                Line representations for fibers, filaments, or
                                bonds
                            </li>
                        </ul>
                        <p>Planned for future:</p>
                        <ul>
                            <li>
                                Volume rendering for RDME or PDE-based
                                simulation results
                            </li>
                            <li>
                                Support for .cif files and coarse-grain
                                sphereTree files for multi-sphere rendering
                            </li>
                        </ul>
                    </div>
                </div>
                <div className={styles.citationPanel}>
                    <h1>Cite Simularium</h1>
                    <div className={styles.citationContent}>
                        <div className={styles.journalCover}>
                            <Image
                                preview={false}
                                src="https://media.springernature.com/w200/springer-static/cover-hires/journal/41592/19/3"
                            />
                        </div>
                        <div className={styles.citationText}>
                            <div className={styles.articleTitle}>
                                <a
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    href="https://www.nature.com/articles/s41592-022-01442-1"
                                >
                                    The Simularium Viewer: an interactive online
                                    tool for sharing spatiotemporal biological
                                    models.
                                </a>
                            </div>
                            <p>
                                Blair Lyons, Eric Isaac, Na Hyung Choi, Thao P.
                                Do, Justin Domingus, Janet Iwasa, Andrew
                                Leonard, Megan Riel-Mehan, Emily Rodgers, Lisa
                                Schaefbauer, Daniel Toloudis, Olivia
                                Waltner, Lyndsay Wilhelm & Graham T. Johnson.
                                Nature Methods (2022).
                                <br />
                                https://doi.org/10.1038/s41592-022-01442-1
                            </p>
                        </div>
                    </div>
                </div>
                <div className={styles.panel}>
                    <div className={styles.textContent}>
                        <h1>Connect with us</h1>
                        <h2>
                            Receive updates & technical support, or provide
                            feedback
                        </h2>
                        <br />
                        <p>
                            We are collecting user feedback to improve this
                            application. To find tutorials, seek technical
                            support, report bugs or request features, use the{" "}
                            <i>Help</i> menu found in the upper right corner of
                            this website. Please{" "}
                            {/* TODO: Change the URL to "mailto: simularium@alleninstitute.org" when that email address is ready */}
                            <a href="http://allins.convio.net/site/PageServer?pagename=send_message_cs">
                                contact us
                            </a>{" "}
                            if you have ideas for potential collaborations, or
                            want to be alerted to major updates.
                        </p>
                    </div>
                </div>
                <div className={styles.futureSimulariumPanel}>
                    <div className={styles.textContent}>
                        <h1>Future plans for Simularium</h1>
                        <h2>
                            Create, modify, run, experiment, share,
                            interoperate, & grow as a community
                        </h2>
                        <br />
                        <p>
                            In the next phase of its development, Simularium
                            will enable users to modify simulation parameters
                            for provided models through the web-based interface,
                            to run the modified simulations on the cloud, and to
                            analyze the results. Simularium currently supports{" "}
                            <a href={CYTOSIM_URL}>
                                <i>CytoSim</i>
                            </a>{" "}
                            and{" "}
                            <a href={READDY_URL}>
                                <i>ReaDDy</i>
                            </a>
                            . We plan to wrap several published packages that
                            can serve as templates for community development and
                            to encourage growth of the system by providing a
                            well- documented API for simulation engine
                            integration.
                        </p>
                        <p>
                            We are investigating the use of these types of
                            simulations and the various simulation engines that
                            generated them for use in building an integrated,
                            mechanistic understanding of human cells. We will
                            also work with educators at all levels of science
                            teaching to integrate and test Simularium’s
                            potential for use in active learning
                            classroom/lab/homework activities.
                        </p>
                    </div>
                </div>
                <div className={styles.panel}>
                    <div className={styles.textContent}>
                        <h1>Acknowledgments</h1>
                        <h2>
                            We&apos;d like to thank the following people for
                            their contributions to Simularium
                        </h2>
                        <br />
                        <ReactMarkdown className={styles.markdown}>
                            {markdownProcessed}
                        </ReactMarkdown>
                    </div>
                </div>
            </Content>
            <Footer />
        </React.Fragment>
    );
};

export default LandingPage;
