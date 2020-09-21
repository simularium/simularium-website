import * as React from "react";
import { Link } from "react-router-dom";
import { Layout, Typography } from "antd";

import dragDropImage from "../../assets/drag-drop.gif";
import { UploadFile } from "../Icons";

const { Content } = Layout;
const { Text } = Typography;

const styles = require("./style.css");

const TutorialPage: React.FunctionComponent<{}> = () => {
    return (
        <Layout className={styles.container}>
            <Content className={styles.content}>
                <h1>Getting Started with Simularium</h1>
                <br />
                <p className={styles.intro}>
                    There are two ways to try out Simularium. Simply drag and
                    drop our example data, or convert your own data into
                    Simularium format and upload it.
                </p>
                <br />
                <ul>
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
                            Download example trajectories from{" "}
                            <a href="https://#">[URL]</a>.
                        </li>
                        <li>
                            In a web browser (Chrome or Firefox), navigate to
                            the{" "}
                            <Link
                                to="/viewer"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Simularium viewer
                            </Link>
                            .
                        </li>
                        <li>
                            Drag one of the downloaded files from your file
                            browser onto the the data input icon {UploadFile}.
                        </li>
                    </ol>
                </ul>
                <br />
                <ul>
                    <li>
                        <span className={styles.listHeader}>
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
                            conda environment:
                            <p>
                                <Text code>
                                    conda create -n simularium python=3
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
                            In your Python script, import simulariumio:
                            <p>
                                <Text code>
                                    from simulariumio import Converter
                                </Text>
                            </p>
                        </li>
                        <li>
                            If you used one of our supported simulators to
                            generate your data, you can use the conversion
                            function:
                            <p>
                                <Text code>
                                    Converter(example_data,
                                    &apos;cytosim&apos;).write_JSON(output_path)
                                </Text>
                            </p>
                            <ul>
                                <li>We support the following simulators:</li>
                                <ul>
                                    <li>
                                        <a
                                            href="https://readdy.github.io/"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            ReaDDy
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            href="http://physicell.org/"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            PhysiCell
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            href="https://gitlab.com/f.nedelec/cytosim"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            CytoSim
                                        </a>
                                    </li>
                                </ul>
                            </ul>
                        </li>
                        <li>
                            If you used another simulator to generate your data,
                            you can use the generic conversion function:
                            <p>
                                <Text code>
                                    Converter(example_data).write_JSON(output_path)
                                </Text>
                            </p>
                        </li>
                        <li>
                            These{" "}
                            <a
                                href="https://github.com/allen-cell-animated/simulariumio/blob/feature/convert-custom-data/simulariumio/bin/Tutorial.ipynb"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Jupyter notebooks
                            </a>{" "}
                            provide examples of saving data from different
                            sources in Simularium’s input format.
                        </li>
                        <li>
                            Run your Python script and notice a file generated
                            at the output path you provided.
                        </li>
                        <li>
                            In a web browser (Chrome or Firefox), navigate to
                            the{" "}
                            <Link
                                to="/viewer"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Simularium viewer
                            </Link>
                            .
                        </li>
                        <li>
                            Drag the resulting file from your file browser onto
                            the the data input icon {UploadFile} or use the file
                            upload dialogue to choose your file.
                        </li>
                    </ol>
                </ul>
            </Content>
        </Layout>
    );
};

export default TutorialPage;
