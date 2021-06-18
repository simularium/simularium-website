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
        code:
            "Software used to generate this data is available <a href='https://github.com/DrubinBarnes/Akamatsu_CME_manuscript'>here</a>.",
        legalese:
            "Please note that the use of this model is subject to third party licensing requirements, which are currently available <a href='https://github.com/DrubinBarnes/Akamatsu_CME_manuscript/blob/master/LICENSE'>here</a>.",
        imageFile: endocytosisImage,
        gifFile: endocytosisGif,
    },
    {
        modelName: "SARS-CoV-2 Dynamics in Human Lung Epithelium",
        id: "pc4covid19.simularium",
        title: "SARS-CoV-2 Dynamics in Human Lung Epithelium",
        version: "4.1",
        totalSimulatedTime: "24h",
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
        code:
            "Software used to generate this data is available <a href='https://github.com/pc4covid19/pc4covid19'>here</a>.",
        legalese:
            "Please note that the use of this model is subject to third party licensing requirements, which are currently available <a href='https://github.com/pc4covid19/pc4covid19/blob/master/LICENSE'>here</a>.",
        imageFile: covidImage,
        gifFile: covidGif,
    },
    {
        modelName: "Membrane Wrapping a Nanoparticle",
        id: "nanoparticle-wrapping.simularium",
        title: "Membrane Wrapping a Nanoparticle",
        totalSimulatedTime: "5.48ms",
        authors: "Mohsen Sadeghi et al.",
        publication: {
            title:
                "Particle-based membrane model for mesoscopic simulation of cellular dynamics",
            journal: "J Chem Phys",
            year: 2018,
            url: "https://aip.scitation.org/doi/10.1063/1.5009107",
        },
        description:
            "A model of a coarse-grained particle-based membrane wrapping a nanoparticle.",
        imageFile: covidImage,
        gifFile: covidGif,
    },
    {
        modelName: "Spatiotemporal oscillations in the E. coli Min system",
        id: "smoldyn_min1.simularium",
        title: "Spatiotemporal oscillations in the E. coli Min system",
        totalSimulatedTime: "100s",
        authors: "Steve Andrews et al.",
        publication: {
            title: "Detailed Simulations of Cell Biology with Smoldyn 2.1",
            journal: "PLoS Computational Biology",
            year: 2010,
            url:
                "https://journals.plos.org/ploscompbiol/article?id=10.1371/journal.pcbi.1000705",
        },
        description:
            "A Smoldyn example model of the E. coli Min system, which is used to find the cell center during cell division.",
        code:
            "Software used to generate this data is available <a href='https://github.com/ssandrews/Smoldyn'>here</a>. The input data file is <a href='https://github.com/ssandrews/Smoldyn/blob/master/examples/S99_more/Min/Min1.txt'>here</a>.",
        legalese:
            "Please note that the use of this model is subject to third party licensing requirements, which are currently available <a href='https://github.com/ssandrews/Smoldyn/blob/master/LICENSE'>here</a>.",
        imageFile: covidImage,
        gifFile: covidGif,
    },
    {
        modelName: "Sequestration of CaMKII in dendritic spines",
        id: "smoldyn_spine.simularium",
        title: "Sequestration of CaMKII in dendritic spines",
        totalSimulatedTime: "1.5s",
        authors: "Shahid Khan et al.",
        publication: {
            title: "Sequestration of CaMKII in dendritic spines in silico",
            journal: "J Comp Neuro",
            year: 2011,
            url:
                "https://link.springer.com/article/10.1007%2Fs10827-011-0323-2",
        },
        description:
            "A Smoldyn model of a dendritic spine with CaMKII and molecules of the postsynaptic density at the spine tip.",
        code:
            "Software used to generate this data is available <a href='https://github.com/ssandrews/Smoldyn'>here</a>. The input data file is <a href='http://www.smoldyn.org/archive/Andrews_Arkin_2010/spine.txt'>here</a>.",
        legalese:
            "Please note that the use of this model is subject to third party licensing requirements, which are currently available <a href='https://github.com/ssandrews/Smoldyn/blob/master/LICENSE'>here</a>.",
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
