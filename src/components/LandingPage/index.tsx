import * as React from "react";
import ReactMarkdown from "react-markdown";
import { Link } from "react-router-dom";

import TRAJECTORIES from "../../constants/networked-trajectories";
import { ABOUT_PATHNAME, TUTORIAL_PATHNAME } from "../../routes";
import { Book, Read } from "../Icons";
import ModelCard from "../ModelCard";
import ContentPage from "../ContentPage";
import ContentPagePanel from "../ContentPagePanel";

import styles from "./style.css";

const NUM_CARDS_PER_ROW = 3;
const markdown = require("../../../ACKNOWLEDGMENTS.md");

const LandingPage = (): JSX.Element => {
    return (
        <ContentPage>
            <ContentPagePanel>
                <h1>Simularium</h1>
                <h3 className={styles.tagLine}>
                    Share, visualize, & interrogate biological simulations
                    online
                </h3>
                <p className={styles.tagLine}>
                    The Simularium Viewer allows easy access to interactive 3D
                    visualizations of trajectories and related plots directly in
                    a web browser, with the primary goal of facilitating
                    collaboration among experimental and computational
                    biologists by eliminating key challenges in sharing,
                    accessing, and comparing results.
                </p>
                <div className={styles.borderedCards}>
                    <Link
                        className={styles.borderedContent}
                        to={TUTORIAL_PATHNAME}
                    >
                        <div className={styles.borderedContentIcon}>{Book}</div>
                        <div className={styles.borderedContentInner}>
                            <p>Getting started with Simularium</p>
                            <p className={styles.defaultTextColor}>
                                Learn how to view your own data or example data
                            </p>
                        </div>
                    </Link>

                    <Link
                        className={styles.borderedContent}
                        to={ABOUT_PATHNAME}
                    >
                        <div className={styles.borderedContentIcon}>{Read}</div>
                        <div className={styles.borderedContentInner}>
                            <p>About Simularium</p>
                            <p className={styles.defaultTextColor}>
                                Read more about Simularium and future plans
                            </p>
                        </div>
                    </Link>
                </div>
            </ContentPagePanel>
            <ContentPagePanel isDark={true} isWide={true}>
                <h2 className={styles.headerSpacing}>
                    Load an example to explore Simularium now
                </h2>
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
            </ContentPagePanel>
            <ContentPagePanel>
                <h2 className={styles.headerSpacing}>Cite Simularium</h2>
                <div className={styles.citationText}>
                    <div className={styles.articleTitle}>
                        <a
                            target="_blank"
                            rel="noopener noreferrer"
                            href="https://www.nature.com/articles/s41592-022-01442-1"
                        >
                            The Simularium Viewer: an interactive online tool
                            for sharing spatiotemporal biological models.
                        </a>
                    </div>
                    <p>
                        Blair Lyons, Eric Isaac, Na Hyung Choi, Thao P. Do,
                        Justin Domingus, Janet Iwasa, Andrew Leonard, Megan
                        Riel-Mehan, Emily Rodgers, Lisa Schaefbauer, Daniel
                        Toloudis, Olivia Waltner, Lyndsay Wilhelm & Graham T.
                        Johnson. Nature Methods (2022).
                        <br />
                        https://doi.org/10.1038/s41592-022-01442-1
                    </p>
                </div>
            </ContentPagePanel>
            <ContentPagePanel isDark={true}>
                <h2>Acknowledgments</h2>
                <h3 className={styles.headerSpacing}>
                    We&apos;d like to thank the following people for their
                    contributions to Simularium
                </h3>
                <ReactMarkdown className={styles.markdown}>
                    {markdown.default}
                </ReactMarkdown>
            </ContentPagePanel>
        </ContentPage>
    );
};

export default LandingPage;
