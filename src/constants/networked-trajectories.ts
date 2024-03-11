// import listeriaNormalImage from "../assets/card-images/listeria-normal.png";
// import listeriaNormalGif from "../assets/card-images/listeria-normal.gif";
// import listeriaUltrapolarImage from "../assets/card-images/card-image-2.png";
import endocytosisImage from "../assets/card-images/endocytosis.png";
import endocytosisGif from "../assets/card-images/endocytosis.gif";
import covidImage from "../assets/card-images/covid.png";
import covidGif from "../assets/card-images/covid.gif";
import nanoparticleImage from "../assets/card-images/nanoparticle_wrapping_thumb.png";
import nanoparticleGif from "../assets/card-images/nanoparticle_wrapping_thumb.gif";
import smoldynMin1Image from "../assets/card-images/smoldyn_min1_thumb.png";
import smoldynMin1Gif from "../assets/card-images/smoldyn_min1_thumb.gif";
import smoldynSpineImage from "../assets/card-images/smoldyn_spine_thumb.png";
import smoldynSpineGif from "../assets/card-images/smoldyn_spine_thumb.gif";
import medyan1Image from "../assets/card-images/MEDYAN_MA_0225_thumb.png";
import medyan1Gif from "../assets/card-images/MEDYAN_MA_0225_thumb.gif";
import medyan2Image from "../assets/card-images/MEDYAN_MA_675_thumb.png";
import medyan2Gif from "../assets/card-images/MEDYAN_MA_675_thumb.gif";
// import vivariumImage from "../assets/card-images/vivarium_ecoli_thumb.png";
// import vivariumGif from "../assets/card-images/vivarium_ecoli_thumb.gif";
import springSalad1Image from "../assets/card-images/springsalad_below_thumb.png";
import springSalad1Gif from "../assets/card-images/springsalad_below_thumb.gif";
import springSalad2Image from "../assets/card-images/springsalad_at_thumb.png";
import springSalad2Gif from "../assets/card-images/springsalad_at_thumb.gif";
import springSalad3Image from "../assets/card-images/springsalad_above_thumb.png";
import springSalad3Gif from "../assets/card-images/springsalad_above_thumb.gif";
// import covid19Image from "../assets/card-images/card-image-4.png";
import bloodPlasmaImage from "../assets/card-images/blood_plasma_thumb.png";
import bloodPlasmaGif from "../assets/card-images/blood_plasma_thumb.gif";

import { TrajectoryDisplayData } from "./interfaces";

const thirdPartyLicensing = (licenseUrl: string) => {
    return `Please note that the use of this software is subject to third party licensing requirements, which are currently available <a href='${licenseUrl}'>here</a>.`;
};

const TRAJECTORIES: TrajectoryDisplayData[] = [
    {
        modelName: "Blood Plasma",
        id: "blood-plasma-1.0.simularium",
        title: "Blood Plasma",
        totalSimulatedTime: "0s",
        version: "1.0",
        authors:
            "Graham T Johnson, Ludovic Autin, Mostafa Al-Alusi, David S Goodsell, Michel F Sanner & Arthur J Olson",
        publication: {
            title: "cellPACK: a virtual mesoscope to model and visualize structural systems biology",
            journal: "Nature Methods",
            year: 2015,
            url: "https://www.nature.com/articles/nmeth.3204",
        },
        description:
            "A cellPACK model of a 100 nm × 100 nm × 15 nm volume of human blood plasma based on a mesoscale recipe containing information for the most abundant macromolecules.",
        code: "Software used to generate this data is available <a href='https://github.com/mesoscope/cellpack'>here</a>.",
        legalese: thirdPartyLicensing(
            "https://github.com/mesoscope/cellpack/blob/main/LICENSE"
        ),
        imageFile: bloodPlasmaImage,
        gifFile: bloodPlasmaGif,
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
    {
        modelName: "Condensate Formation",
        id: "springsalad_condensate_formation_Above_Ksp.simularium",
        title: "Condensate Formation: Above Ksp",
        totalSimulatedTime: "0.4s",
        authors: "Aniruddha Chattaraj et al.",
        publication: {
            title: "The solubility product extends the buffering concept to heterotypic biomolecular condensates",
            journal: "eLife",
            year: 2021,
            url: "https://elifesciences.org/articles/67176",
        },
        description:
            "A SpringSaLaD model of liquid-liquid phase separation above Ksp where condensate forms.",
        code: "Software used to generate this data is available <a href='https://github.com/achattaraj/Ksp_phase_separation'>here</a>.",
        imageFile: springSalad3Image,
        gifFile: springSalad3Gif,
    },
    {
        modelName: "Condensate Formation",
        id: "springsalad_condensate_formation_At_Ksp.simularium",
        title: "Condensate Formation: At Ksp",
        totalSimulatedTime: "0.4s",
        authors: "Aniruddha Chattaraj et al.",
        publication: {
            title: "The solubility product extends the buffering concept to heterotypic biomolecular condensates",
            journal: "eLife",
            year: 2021,
            url: "https://elifesciences.org/articles/67176",
        },
        description:
            "A SpringSaLaD model of liquid-liquid phase separation at Ksp where condensate forms.",
        code: "Software used to generate this data is available <a href='https://github.com/achattaraj/Ksp_phase_separation'>here</a>.",
        imageFile: springSalad2Image,
        gifFile: springSalad2Gif,
    },
    {
        modelName: "Condensate Formation",
        id: "springsalad_condensate_formation_Below_Ksp.simularium",
        title: "Condensate Formation: Below Ksp",
        totalSimulatedTime: "1s",
        authors: "Aniruddha Chattaraj et al.",
        publication: {
            title: "The solubility product extends the buffering concept to heterotypic biomolecular condensates",
            journal: "eLife",
            year: 2021,
            url: "https://elifesciences.org/articles/67176",
        },
        description:
            "A SpringSaLaD model of liquid-liquid phase separation below Ksp where no condensate forms.",
        code: "Software used to generate this data is available <a href='https://github.com/achattaraj/Ksp_phase_separation'>here</a>.",
        imageFile: springSalad1Image,
        gifFile: springSalad1Gif,
    },
    /*
    {
        modelName: "Vivarium E coli",
        id: "vivarium_ecoli.simularium",
        title: "Vivarium E coli",
        totalSimulatedTime: "10h",
        authors: "Agmon and Spangler",
        publication: {
            title: "A Multi-Scale Approach to Modeling E. coli Chemotaxis",
            journal: "Entropy",
            year: 2020,
            url: "https://www.mdpi.com/1099-4300/22/10/1101",
        },
        description: "Model of chemotactic E. coli using Vivarium.",
        code:
            "Software used to generate this data is available <a href='https://github.com/vivarium-collective/vivarium-chemotaxis'>here</a>.",
        legalese:
            thirdPartyLicensing("https://github.com/vivarium-collective/vivarium-chemotaxis/blob/master/LICENSE"),
        imageFile: vivariumImage,
        gifFile: vivariumGif,
    },
    */
    {
        modelName: "Actin Bundle Dynamics with α–Actinin and Myosin",
        id: "medyan_Chandrasekaran_2019_UNI_alphaA_0.1_MA_0.675.simularium",
        title: "Actin Bundle Dynamics with α–Actinin and Myosin",
        subtitle: "High Myosin Activity",
        totalSimulatedTime: "33min",
        authors: "Chandrasekaran et al.",
        publication: {
            title: "Remarkable structural transformations of actin bundles are driven by their initial polarity, motor activity, crosslinking, and filament treadmilling",
            journal: "PLoS Computational Biology",
            year: 2019,
            url: "https://journals.plos.org/ploscompbiol/article?id=10.1371/journal.pcbi.1007156",
        },
        description:
            "A MEDYAN model of interacting actin filaments, α–actinin crosslinkers, and myosin motors. High myosin activity causes formation of an aster-like structure.",
        code: "Software used to generate this data is available <a href='https://bitbucket.org/jkomianos/medyan/src/master/'>here</a>. The outputs that were visualized can be downloaded <a href='https://drum.lib.umd.edu/handle/1903/21856'>here</a>.",
        legalese: thirdPartyLicensing(
            "https://bitbucket.org/jkomianos/medyan/src/master/license.txt"
        ),
        imageFile: medyan2Image,
        gifFile: medyan2Gif,
    },
    {
        modelName: "Actin Bundle Dynamics with α–Actinin and Myosin",
        id: "medyan_Chandrasekaran_2019_UNI_alphaA_0.1_MA_0.0225.simularium",
        title: "Actin Bundle Dynamics with α–Actinin and Myosin",
        subtitle: "Low Myosin Activity",
        totalSimulatedTime: "33min",
        authors: "Chandrasekaran et al.",
        publication: {
            title: "Remarkable structural transformations of actin bundles are driven by their initial polarity, motor activity, crosslinking, and filament treadmilling",
            journal: "PLoS Computational Biology",
            year: 2019,
            url: "https://journals.plos.org/ploscompbiol/article?id=10.1371/journal.pcbi.1007156",
        },
        description:
            "A MEDYAN model of interacting actin filaments, α–actinin crosslinkers, and myosin motors. Low myosin activity maintains the bundle structure.",
        code: "Software used to generate this data is available <a href='https://bitbucket.org/jkomianos/medyan/src/master/'>here</a>. The outputs that were visualized can be downloaded <a href='https://drum.lib.umd.edu/handle/1903/21856'>here</a>.",
        legalese: thirdPartyLicensing(
            "https://bitbucket.org/jkomianos/medyan/src/master/license.txt"
        ),
        imageFile: medyan1Image,
        gifFile: medyan1Gif,
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
            url: "https://link.springer.com/article/10.1007%2Fs10827-011-0323-2",
        },
        description:
            "A Smoldyn model of a dendritic spine with CaMKII and molecules of the postsynaptic density at the spine tip.",
        code: "Software used to generate this data is available <a href='https://github.com/ssandrews/Smoldyn'>here</a>. The input data file is <a href='http://www.smoldyn.org/archive/Andrews_Arkin_2010/spine.txt'>here</a>.",
        legalese: thirdPartyLicensing(
            "https://github.com/ssandrews/Smoldyn/blob/master/LICENSE"
        ),
        imageFile: smoldynSpineImage,
        gifFile: smoldynSpineGif,
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
            url: "https://journals.plos.org/ploscompbiol/article?id=10.1371/journal.pcbi.1000705",
        },
        description:
            "A Smoldyn example model of the E. coli Min system, which is used to find the cell center during cell division.",
        code: "Software used to generate this data is available <a href='https://github.com/ssandrews/Smoldyn'>here</a>. The input data file is <a href='https://github.com/ssandrews/Smoldyn/blob/master/examples/S99_more/Min/Min1.txt'>here</a>.",
        legalese: thirdPartyLicensing(
            "https://github.com/ssandrews/Smoldyn/blob/master/LICENSE"
        ),
        imageFile: smoldynMin1Image,
        gifFile: smoldynMin1Gif,
    },
    {
        modelName: "Membrane Wrapping a Nanoparticle",
        id: "nanoparticle_wrapping.simularium",
        title: "Membrane Wrapping a Nanoparticle",
        totalSimulatedTime: "5.48ms",
        authors: "Mohsen Sadeghi et al.",
        publication: {
            title: "Particle-based membrane model for mesoscopic simulation of cellular dynamics",
            journal: "J Chem Phys",
            year: 2018,
            url: "https://aip.scitation.org/doi/10.1063/1.5009107",
        },
        description:
            "A model of a coarse-grained particle-based membrane wrapping a nanoparticle.",
        imageFile: nanoparticleImage,
        gifFile: nanoparticleGif,
    },
    {
        modelName: "SARS-CoV-2 Dynamics in Human Lung Epithelium",
        id: "pc4covid19.simularium",
        title: "SARS-CoV-2 Dynamics in Human Lung Epithelium",
        version: "4.1",
        totalSimulatedTime: "24h",
        authors: "Michael Getz et al.",
        publication: {
            title: "Rapid community-driven development of a SARS-CoV-2 tissue simulator",
            journal: "bioRxiv",
            year: 2020,
            url: "https://www.biorxiv.org/content/10.1101/2020.04.02.019075v3",
        },
        description:
            "A PhysiCell model of SARS-CoV-2 dynamics in human lung epithelium.",
        code: "Software used to generate this data is available <a href='https://github.com/pc4covid19/pc4covid19'>here</a>.",
        legalese: thirdPartyLicensing(
            "https://github.com/pc4covid19/pc4covid19/blob/master/LICENSE"
        ),
        imageFile: covidImage,
        gifFile: covidGif,
    },
    {
        modelName: "Actin in Clathrin-mediated Endocytosis",
        id: "endocytosis.simularium",
        title: "Actin in Clathrin-mediated Endocytosis",
        totalSimulatedTime: "15s",
        authors: "Matthew Akamatsu et al.",
        publication: {
            title: "Principles of self-organization and load adaptation by the actin cytoskeleton during clathrin-mediated endocytosis",
            journal: "eLife",
            year: 2020,
            url: "https://elifesciences.org/articles/49840",
        },
        description:
            "A CytoSim model of a branched actin network internalizing an endocytic pit against membrane tension.",
        code: "Software used to generate this data is available <a href='https://github.com/DrubinBarnes/Akamatsu_CME_manuscript'>here</a>.",
        legalese: thirdPartyLicensing(
            "https://github.com/DrubinBarnes/Akamatsu_CME_manuscript/blob/master/LICENSE"
        ),
        imageFile: endocytosisImage,
        gifFile: endocytosisGif,
    },
];

export default TRAJECTORIES;
