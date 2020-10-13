import listeriaNormalImage from "../assets/card-image-1.png";
// import listeriaUltrapolarImage from "../assets/card-image-2.png";
import endocytosisImage from "../assets/card-image-3.png";
// import covid19Image from "../assets/card-image-4.png";

import { TrajectoryDisplayData } from "./interfaces";

const TRAJECTORIES: TrajectoryDisplayData[] = [
    {
        modelName: "Actin-based Listeria Propulsion",
        id: "listeria_normal",
        extension: "simularium",
        title: "Actin-based Listeria Propulsion: Normal ActA Distribution",
        totalSimulatedTime: "60s",
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
    },
    /* Not ready yet
    {
        modelName: "Actin-based Listeria Propulsion",
        id: "listeria_ultrapolar",
        title: "Actin-based Listeria Propulsion: Ultrapolar ActA Distribution",
        totalSimulatedTime: "60s",
        authors: "Susanne Rafelski et al",
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
    {
        modelName: "Actin in Clathrin-mediated Endocytosis",
        id: "endocytosis",
        extension: "simularium",
        title: "Actin in Clathrin-mediated Endocytosis",
        totalSimulatedTime: "15s",
        authors: "Matthew Akamatsu et al",
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
    },
    /* Not ready yet
    {
        modelName: "Covid Virion",
        id: "covid19",
        title: "SARS-CoV-2 Virion",
        totalSimulatedTime: "0s",
        authors: "Ngan Nguyen et al",
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
];

export default TRAJECTORIES;
