// import listeriaNormalImage from "../assets/card-images/listeria-normal.png";
// import listeriaNormalGif from "../assets/card-images/listeria-normal.gif";
// import listeriaUltrapolarImage from "../assets/card-images/card-image-2.png";
import endocytosisImage from "../assets/card-images/endocytosis.png";
import endocytosisGif from "../assets/card-images/endocytosis.gif";
import covidImage from "../assets/card-images/covid.png";
import covidGif from "../assets/card-images/covid.gif";
// import covid19Image from "../assets/card-images/card-image-4.png";

import { TrajectoryDisplayData } from "./interfaces";

const TRAJECTORIES: TrajectoryDisplayData[] = [
    {
        modelName: "Actin in Clathrin-mediated Endocytosis",
        id: "endocytosis.simularium",
        title: "Actin in Clathrin-mediated Endocytosis",
        totalSimulatedTime: "15s",
        authors: "Matthew Akamatsu et al.",
        publication: {
            title:
                "Principles of self-organization and load adaptation by the actin cytoskeleton during clathrin-mediated endocytosis",
            journal: "eLife",
            year: 2020,
            url: "https://elifesciences.org/articles/49840",
        },
        description:
            "A CytoSim model of a branched actin network internalizing an endocytic pit against membrane tension.",
        imageFile: endocytosisImage,
        gifFile: endocytosisGif,
    },
    {
        modelName: "SARS-CoV-2 Dynamics in Human Lung Epithelium",
        id: "pc4covid19.simularium",
        title: "SARS-CoV-2 Dynamics in Human Lung Epithelium",
        totalSimulatedTime: "4h",
        authors: "Michael Getz et al.",
        publication: {
            title:
                "Rapid community-driven development of a SARS-CoV-2 tissue simulator",
            journal: "bioRxiv",
            year: 2020,
            url: "https://www.biorxiv.org/content/10.1101/2020.04.02.019075v3",
        },
        description:
            "A PhysiCell model of SARS-CoV-2 dynamics in human lung epithelium.",
        imageFile: covidImage,
        gifFile: covidGif,
    },
    /* Not ready yet
    {
        modelName: "Covid Virion",
        id: "covid19",
        title: "SARS-CoV-2 Virion",
        totalSimulatedTime: "0s",
        authors: "Ngan Nguyen et al.",
        publication: {
            title:
                "Modeling in the Time of COVID-19: Statistical and Rule-based Mesoscale Models",
            journal: "arXiv",
            year: 2020,
            url: "https://arxiv.org/abs/2005.01804",
        },
        description:
            "A structural model of a diffusing SARS-CoV-2 virus particle.",
        imageFile: covid19Image,
    },
    */
    /* Not ready yet
    {
        modelName: "Actin-based Listeria Propulsion",
        id: "listeria_normal.simularium",
        title: "Actin-based Listeria Propulsion",
        subtitle: "Normal ActA Distribution",
        totalSimulatedTime: "120s",
        authors: "Jonathan Alberts et al",
        publication: {
            title:
                "In Silico Reconstitution of Listeria Propulsion Exhibits Nano-Saltation",
            journal: "PLoS Biology",
            year: 2004,
            url:
                "https://journals.plos.org/plosbiology/article?id=10.1371/journal.pbio.0020412",
        },
        description:
            "A model of Listeria monocytogenes propulsion that explicitly simulates monomer-scale biochemical and mechanical interactions. This run has a normal ActA distribution on the bacterial surface.",
        imageFile: listeriaNormalImage,
        gifFile: listeriaNormalGif,
    },*/
    /* Not ready yet
    {
        modelName: "Actin-based Listeria Propulsion",
        id: "listeria_ultrapolar",
        title: "Actin-based Listeria Propulsion: Ultrapolar ActA Distribution",
        totalSimulatedTime: "60s",
        authors: "Susanne Rafelski et al.",
        publication: {
            title:
                "An Experimental and Computational Study of the Effect of ActA Polarity on the Speed of Listeria monocytogenes Actin-based Motility",
            journal: "PLoS Comp. Biology",
            year: 2009,
            url:
                "https://journals.plos.org/ploscompbiol/article?id=10.1371/journal.pcbi.1000434",
        },
        description:
            "A model of Listeria monocytogenes propulsion that explicitly simulates monomer-scale biochemical and mechanical interactions. This run has an ultrapolar ActA distribution on the bacterial surface.",
        imageFile: listeriaUltrapolarImage,
    },
    */
];

export default TRAJECTORIES;
