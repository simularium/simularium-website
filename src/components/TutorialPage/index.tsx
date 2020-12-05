import * as React from "react";
import { Link } from "react-router-dom";
import { Layout, Typography } from "antd";

import dragDropImage from "../../assets/drag-drop.gif";
import { VIEWER_PATHNAME } from "../../routes";
import Footer from "../Footer";

const { Content } = Layout;
const { Text } = Typography;

const styles = require("./style.css");

const TutorialPage: React.FunctionComponent<{}> = () => {
    return (
        <>
            <Content className={styles.content}>
                <h1>Getting Started with Simularium</h1>
                <p className={styles.intro}>
                    To try out the Simularium Viewer, either{" "}
                    <a href="https://aics-agentviz-data.s3.us-east-2.amazonaws.com/trajectory/endocytosis.simularium">
                        download
                    </a>{" "}
                    our example data or <a href="#convert-your-data">convert</a>{" "}
                    your own data, and drag and drop it onto the{" "}
                    <Link to={VIEWER_PATHNAME}>viewer</Link>. More details
                    below:
                </p>
                <ul className={styles.approachBlock}>
                    <li>
                        <span className={styles.listHeader}>
                            Drag and drop example data
                        </span>
                        <br />
                        <img
                            className={styles.dragDropImage}
                            src={dragDropImage}
                        />
                    </li>
                    <ol>
                        <li>
                            Download the example data{" "}
                            <a href="https://aics-agentviz-data.s3.us-east-2.amazonaws.com/trajectory/endocytosis.simularium">
                                here
                            </a>
                            .
                        </li>
                        <li>
                            In a web browser (Chrome or Firefox), navigate to
                            the{" "}
                            <Link to={VIEWER_PATHNAME}>Simularium viewer</Link>.
                        </li>
                        <li>
                            Drag one of the downloaded files from your file
                            browser onto the the window.
                        </li>
                    </ol>
                </ul>
                <ul className={styles.approachBlock}>
                    <li>
                        <span
                            id="convert-your-data"
                            className={styles.listHeader}
                        >
                            Convert your data into Simularium format
                        </span>
                    </li>
                    <ol>
                        <li>
                            Install{" "}
                            <a
                                href="https://docs.conda.io/en/latest/miniconda.html"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Anaconda
                            </a>{" "}
                            if you have not already.
                        </li>
                        <li>
                            In a terminal window, create and activate a new
                            conda environment using either Python 3.7 or 3.8:
                            <p>
                                <Text code>
                                    conda create -n simularium python=3.8
                                </Text>
                                <br />
                                <Text code>conda activate simularium</Text>
                            </p>
                        </li>
                        <li>
                            Install the simulariumio Python package:
                            <p>
                                <Text code>pip install simulariumio</Text>
                            </p>
                        </li>
                        <li>
                            In your Python script, import the converter and data
                            you need from simulariumio, e.g. for data generated
                            by an engine not specifically supported by
                            simulariumio:
                            <p>
                                <Text code>
                                    from simulariumio import CustomConverter,
                                    CustomData, AgentData
                                </Text>
                            </p>
                            <ul>
                                <li>
                                    These{" "}
                                    <a
                                        href="https://github.com/allen-cell-animated/simulariumio/tree/master/examples"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        Jupyter notebooks
                                    </a>{" "}
                                    provide examples of saving data from
                                    different sources in Simularium’s input
                                    format.
                                </li>
                                <li>
                                    We support the following simulators:
                                    <ul>
                                        <li>
                                            ReaDDy (
                                            <a
                                                href="https://readdy.github.io/"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                https://readdy.github.io/
                                            </a>
                                            )
                                        </li>
                                        <li>
                                            PhysiCell (
                                            <a
                                                href="http://physicell.org/"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                http://physicell.org/
                                            </a>
                                            )
                                        </li>
                                        <li>
                                            CytoSim (
                                            <a
                                                href="https://gitlab.com/f.nedelec/cytosim"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                https://gitlab.com/f.nedelec/cytosim
                                            </a>
                                            )
                                        </li>
                                    </ul>
                                </li>
                                <li>
                                    If you used one of our supported simulators
                                    to generate your data, choose the notebook
                                    for that simulator:
                                    <ul>
                                        <li>
                                            <a
                                                href="https://github.com/allen-cell-animated/simulariumio/blob/master/examples/Tutorial_readdy.ipynb"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                ReaDDy
                                            </a>
                                        </li>
                                        <li>
                                            <a
                                                href="https://github.com/allen-cell-animated/simulariumio/blob/master/examples/Tutorial_physicell.ipynb"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                PhysiCell
                                            </a>
                                        </li>
                                        <li>
                                            <a
                                                href="https://github.com/allen-cell-animated/simulariumio/blob/master/examples/Tutorial_cytosim.ipynb"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                CytoSim
                                            </a>
                                        </li>
                                    </ul>
                                </li>
                                <li>
                                    If you used another simulator to generate
                                    your data, choose the notebook for
                                    converting{" "}
                                    <a
                                        href="https://github.com/allen-cell-animated/simulariumio/blob/master/examples/Tutorial_custom.ipynb"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        custom data
                                    </a>
                                    .
                                </li>
                            </ul>
                        </li>
                        <li>
                            Run your Python script and notice a file generated
                            at the output path you provided.
                        </li>
                        <li>
                            In a web browser (Chrome or Firefox), navigate to
                            the{" "}
                            <Link to={VIEWER_PATHNAME}>Simularium viewer</Link>.
                        </li>
                        <li>
                            Drag the resulting file from your file browser onto
                            the window or use the file upload dialogue to choose
                            your file.
                        </li>
                    </ol>
                </ul>
                <h1 id="browser-support">Browser support</h1>
                <ul>
                    <li>
                        Currently, Simularium supports Firefox and Chrome. Some
                        features may not work on other browsers.
                    </li>
                    <li>
                        If using Safari on a Mac, please enable WebGL 2.0 by
                        choosing Develop &gt; Experimental Features and enabling
                        &quot;WebGL 2.0&quot; (If you do not have a Develop menu
                        in your menu bar, please first choose Safari &gt;
                        Preferences &gt; Advanced and enable &quot;Show Develop
                        menu in menu bar&quot;.) Then please reload the viewer.
                    </li>
                </ul>
            </Content>
            <Footer />
        </>
    );
};

export default TutorialPage;
