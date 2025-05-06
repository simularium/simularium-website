import * as React from "react";
import flowchartImg from "../../assets/overview-image.png";
import agentRepOptionsImg from "../../assets/agent-rep-options.png";
import VisualGlossary from "../VisualGlossary";
import ContentPage from "../ContentPage";
import ContentPagePanel from "../ContentPagePanel";

import styles from "./style.css";

const AboutPage = (): JSX.Element => {
    return (
        <ContentPage>
            <ContentPagePanel>
                <h1>About Simularium</h1>
                <p className={styles.intro}>
                    With this first release we present the Simularium Viewer, an
                    online visual analysis tool, which is one component of the
                    larger Simularium platform. The Simularium Viewer provides
                    an online application for visualizing simulation
                    trajectories and related plots.
                </p>
            </ContentPagePanel>

            <ContentPagePanel isDark={true} isWide={true}>
                <h2>Visual Guide</h2>
                <VisualGlossary />
            </ContentPagePanel>

            <ContentPagePanel>
                <h2>Simularium v1.0</h2>
                <div className={styles.leftAlign}>
                    <p>
                        Simularium v1.0 allows you to interact with
                        precalculated simulation results — including your own
                        results converted into the Simularium file format
                        (JSON). The Simularium Viewer uses advanced rendering
                        techniques developed by Le Muzic et al. (2015) and
                        Mindek et al. (2017) to enable meaningful interpretation
                        of spatial relationships among thousands of moving
                        components. Users can import a trajectory file (JSON
                        format) from their computer, or they can stream provided
                        examples by choosing one from the Load model dropdown or
                        by clicking on a card above. Future versions of
                        Simularium will allow you to modify, run, and even
                        create simulations.
                    </p>
                    <h3>Current object representation options:</h3>
                    <span>
                        <p>
                            Spheres: by default, each agent in a scene is
                            represented as a single sphere
                        </p>
                    </span>
                    <span>
                        <p>
                            Mesh surfaces: represent each agent as a mesh file,
                            e.g. coarse molecular surfaces
                        </p>
                    </span>
                    <span>
                        <p>Multi-sphere: provide Protein Databank .pdb files</p>
                    </span>
                    <span>
                        <p>
                            Line representations for fibers, filaments, or bonds
                        </p>
                    </span>

                    <h3>Upcoming plans: </h3>
                    <span>
                        <p>
                            Volume rendering for RDME or PDE-based simulation
                            results
                        </p>
                    </span>
                    <span>
                        <p>
                            Support for .cif files and coarse-grain sphereTree
                            files for multi-sphere rendering
                        </p>
                    </span>
                </div>
                <div className={styles.imageContainer}>
                    <img src={flowchartImg} alt="Flowchart of Simularium" />
                    <img
                        src={agentRepOptionsImg}
                        alt="Agent representation options"
                    />
                </div>
            </ContentPagePanel>

            <ContentPagePanel isDark={true}>
                <h2>Future plans for Simularium</h2>
                <h3>
                    Create, modify, run, experiment, share, interoperate, & grow
                    as a community
                </h3>
                <p>
                    In the next phase of its development, Simularium will enable
                    users to modify simulation parameters for provided models
                    through the web-based interface, to run the modified
                    simulations on the cloud, and to analyze the results.
                    Simularium currently supports{" "}
                    <a
                        href="https://gitlab.com/f.nedelec/cytosim"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        CytoSim
                    </a>{" "}
                    and{" "}
                    <a
                        href="https://readdy.github.io"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        ReaDDy
                    </a>
                    . We plan to wrap several published packages that can serve
                    as templates for community development and to encourage
                    growth of the system by providing a well-documented API for
                    simulation engine integration. We are investigating the use
                    of these types of simulations and the various simulation
                    engines that generated them for use in building an
                    integrated, mechanistic understanding of human cells. We
                    will also work with educators at all levels of science
                    teaching to integrate and test Simularium`&apos;`s potential
                    for use in active learning classroom/lab/homework
                    activities.
                </p>
            </ContentPagePanel>
        </ContentPage>
    );
};

export default AboutPage;
