import * as React from "react";
import { Link } from "react-router-dom";
import { Typography } from "antd";
import dragDropImage from "../../assets/drag-drop.gif";
import { VIEWER_PATHNAME } from "../../routes";
import { SUPPORTED_ENGINES, DOWNLOAD_URL } from "../../constants";
import ContentPage from "../ContentPage";
import ContentPagePanel from "../ContentPagePanel";
import styles from "./style.css";

const { Text } = Typography;
const TutorialPage = (): JSX.Element => {
    return (
        <ContentPage>
            <ContentPagePanel>
                <h1>Getting Started with Simularium</h1>
                <p>
                    To get started with the{" "}
                    <Link to={VIEWER_PATHNAME}>Simularium Viewer</Link>, either
                    download example data or convert your own data.
                </p>
            </ContentPagePanel>

            <ContentPagePanel isDark={true}>
                <ul className={styles.list}>
                    <h3 className={styles.listHeader}>
                        Drag and drop example data
                    </h3>
                    <ol>
                        <li>
                            Download the example data{" "}
                            <a
                                href={`${DOWNLOAD_URL}/trajectory/endocytosis.simularium`}
                            >
                                here
                            </a>
                            .
                        </li>
                        <li>
                            In a web browser (Firefox, Chrome, or Edge),
                            navigate to the{" "}
                            <Link to={VIEWER_PATHNAME}>Simularium viewer</Link>.
                        </li>
                        <li>
                            Drag one of the downloaded files from your file
                            browser onto the the window.
                        </li>
                    </ol>
                    <img className={styles.dragDropImage} src={dragDropImage} />
                </ul>

                {/* Convert your data into Simularium format */}
                <ul className={styles.list}>
                    <h3 className={styles.listHeader} id="convert-your-data">
                        Convert your data into Simularium format
                    </h3>
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
                            <ol type="a">
                                <li>
                                    These{" "}
                                    <a
                                        href="https://github.com/simularium/simulariumio/tree/main/examples"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        Jupyter notebooks
                                    </a>{" "}
                                    provide examples of saving data from
                                    different sources in Simularium&#39;s input
                                    format.
                                </li>
                                <li>
                                    We support the following simulators:
                                    <ul>
                                        {SUPPORTED_ENGINES.map(
                                            (engine: string[]) => {
                                                const [name, url] = engine;
                                                return (
                                                    <li key={name}>
                                                        {name} (
                                                        <a
                                                            href={url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                        >
                                                            {url}
                                                        </a>
                                                        )
                                                    </li>
                                                );
                                            }
                                        )}
                                    </ul>
                                </li>
                                <li>
                                    If you used one of our supported simulators
                                    to generate your data, choose the notebook
                                    for that simulator:
                                    <ul>
                                        {SUPPORTED_ENGINES.map(
                                            (engine: string[]) => {
                                                const name = engine[0];
                                                const url = `https://github.com/simularium/simulariumio/blob/main/examples/Tutorial_${name.toLowerCase()}.ipynb`;
                                                return (
                                                    <li key={name}>
                                                        <a
                                                            href={url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                        >
                                                            {name}
                                                        </a>
                                                    </li>
                                                );
                                            }
                                        )}
                                    </ul>
                                </li>
                                <li>
                                    If you used another simulator to generate
                                    your data, choose the notebook for
                                    converting{" "}
                                    <a
                                        href="https://github.com/simularium/simulariumio/blob/main/examples/Tutorial_custom.ipynb"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        custom data
                                    </a>
                                    .
                                </li>
                            </ol>
                        </li>
                        <li>
                            Run your Python script and notice a file generated
                            at the output path you provided.
                        </li>
                        <li>
                            In a web browser (Firefox, Chrome, or Edge),
                            navigate to the{" "}
                            <Link to={VIEWER_PATHNAME}>Simularium viewer</Link>.
                        </li>
                        <li>
                            Drag the resulting file from your file browser onto
                            the window or choose Load model &gt; From your
                            device, and select your file from the file upload
                            dialogue.
                            <ol type="a">
                                <li>
                                    If you&apos;re using local geometry files,
                                    like .obj or .pdb files, load them at the
                                    same time as you load your .simularium file,
                                    either by dragging and dropping a collection
                                    of files, or by choosing multiple files in
                                    the upload dialogue.
                                </li>
                                <li>
                                    Currently the Viewer does not support
                                    loading folders of files, so make sure you
                                    are loading a collection of single files
                                    that does not include a folder. We&apos;re
                                    working to improve this.
                                </li>
                            </ol>
                        </li>
                    </ol>
                </ul>

                {/* Share a link to your data */}
                <ul className={styles.list}>
                    <h3 className={styles.listHeader} id="share-a-link">
                        Share a link to your data
                    </h3>
                    <ol>
                        <li>
                            Upload your Simularium file to one of the supported
                            public cloud providers, including Dropbox, Google
                            Drive, or Amazon S3, and get a publicly accessible
                            link to the file.
                        </li>
                        <li>
                            In a supported browser, navigate to{" "}
                            <Link
                                to="/"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                https://simularium.allencell.org/
                            </Link>
                            .
                        </li>
                        <li>
                            Choose Load model &gt; Simularium file. In the
                            dialog, provide the URL to your Simularium file and
                            choose Load.
                        </li>
                        <ul>
                            <li>
                                If your file uses geometry files, like .obj or
                                .pdb files, make sure you&apos;ve provided the
                                full public URL to the geometry files in your
                                .simularium file.
                            </li>
                        </ul>
                        <li>
                            Once the file is loaded, you can copy the page URL
                            and share this link with collaborators or post it on
                            your website so that others can interactively view
                            your results.
                        </li>
                    </ol>
                </ul>
            </ContentPagePanel>

            {/* Browser support */}
            <ContentPagePanel>
                <ul className={styles.list}>
                    <h3 className={styles.listHeader} id="browser-support">
                        Browser support
                    </h3>
                    <ul>
                        <li>
                            Currently, Simularium supports Chrome, Safari, Edge,
                            and Firefox. Some features may not work on other
                            browsers.
                        </li>
                        <li>
                            If using Safari on a Mac, please enable WebGL 2.0 by
                            choosing Develop &gt; Experimental Features and
                            enabling &quot;WebGL 2.0&quot; (If you do not have a
                            Develop menu in your menu bar, first choose Safari
                            &gt; Preferences &gt; Advanced and enable &quot;Show
                            Develop menu in menu bar&quot;.) Then reload the
                            viewer.
                        </li>
                    </ul>
                </ul>
            </ContentPagePanel>

            <ContentPagePanel isDark={true}>
                <h3>Contact us</h3>
                <p>
                    We are collecting user feedback to improve this application.
                    To find tutorials, seek technical support, report bugs or
                    request features, use the Help menu found in the upper right
                    corner of this website. Please contact us if you have ideas
                    for potential collaborations, or want to be alerted to major
                    updates.
                </p>
            </ContentPagePanel>
        </ContentPage>
    );
};

export default TutorialPage;
