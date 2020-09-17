import * as React from "react";
import { Layout } from "antd";

const { Content } = Layout;

const styles = require("./style.css");

const LandingPage = (): JSX.Element => (
    <Layout className={styles.container}>
        <Content className={styles.content}>
            <ul>
                <li>Drag and drop example data</li>
                <ol>
                    <li>Download example trajectories from http://#</li>
                    <li>
                        In a web browser (Chrome or Firefox), navigate to
                        http://simularium.allencell.org/viewer
                    </li>
                    <li>
                        Drag one of the downloaded files from your file browser
                        onto the the data input icon [image of icon]
                    </li>
                </ol>
                <li>Convert your data into Simularium format</li>
                <ol>
                    <li>
                        Install Anaconda if you have not already:
                        https://docs.conda.io/en/latest/miniconda.html
                    </li>
                    <li>
                        In a terminal window, create and activate a new Conda
                        environment:
                        <br />
                        conda create -n simularium python=3
                        <br />
                        conda activate simularium
                    </li>
                    <li>
                        Install the simulariumio Python package:
                        <br />
                        pip install simulariumio
                    </li>
                    <li>
                        In your Python script, import simulariumio:
                        <br />
                        from simulariumio import Converter
                    </li>
                    <li>
                        If you used one of our supported simulators to generate
                        your data, you can use the conversion function:
                        <br />
                        Converter(example_data,
                        &apos;cytosim&apos;).write_JSON(output_path)
                        <ul>
                            <li>We support the following simulators:</li>
                            <ul>
                                <li>ReaDDy (https://readdy.github.io/)</li>
                                <li>PhysiCell (http://physicell.org/)</li>
                                <li>
                                    CytoSim
                                    (https://gitlab.com/f.nedelec/cytosim)
                                </li>
                            </ul>
                        </ul>
                    </li>
                    <li>
                        If you used another simulator to generate your data, you
                        can use the generic conversion function:
                        <br />
                        Converter(example_data).write_JSON(output_path)
                    </li>
                    <li>
                        These{" "}
                        <a href="https://github.com/allen-cell-animated/simulariumio/blob/feature/convert-custom-data/simulariumio/bin/Tutorial.ipynb">
                            Jupyter notebooks
                        </a>{" "}
                        provide examples of saving data from different sources
                        in Simularium’s input format.
                    </li>
                    <li>
                        Run your python script and notice a file generated at
                        the output path you provided.
                    </li>
                    <li>
                        In a web browser (Chrome or Firefox), navigate to
                        http://simularium.allencell.org/viewer
                    </li>
                    <li>
                        Drag the resulting file from your file browser onto the
                        the data input icon [image of icon] or use the file
                        upload dialogue to choose your file.
                    </li>
                </ol>
            </ul>
        </Content>
    </Layout>
);

export default LandingPage;
