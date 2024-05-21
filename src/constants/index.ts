import { AvailableEngines } from "../state/trajectory/conversion-data-types";

export const APP_ID = "simularium-ui";
export const API_VERSION = "v1";
export const HEADER_HEIGHT = 113;
export const URL_PARAM_KEY_FILE_NAME = "trajFileName";
export const URL_PARAM_KEY_USER_URL = "trajUrl";
export const URL_PARAM_KEY_TIME = "t";
export const CHECKBOX_TYPE_STAR = "star";
export type CHECKBOX_TYPE_STAR = typeof CHECKBOX_TYPE_STAR;
export const TOOLTIP_COLOR = "#3B3649";
export const TOOLTIP_DELAY = 1; // in seconds
export const NAV_BAR_TOOLTIP_OFFSET = [0, 10];
export const URL_PARAM_BASE_TYPES = "base_types.json";
export const URL_PARAM_CUSTOM_TYPES = "custom-types";
// URLs
export const BASE_API_URL = `/api/${API_VERSION}`;
// todo octopus launch: this is pointing to the staging octopus http endpoint
export const DATA_BUCKET_URL =
    "https://staging-simularium-ecs.allencell.org:443/download";
export const FORUM_URL =
    "https://forum.allencell.org/c/software-code/simularium/";
// Note that below has "/tags/" unlike FORUM_URL
export const FORUM_BUG_REPORT_URL =
    "https://forum.allencell.org/tags/c/software-code/simularium/15/bug-report";
export const GITHUB_URL = "https://github.com/simularium";
export const ISSUE_URL =
    "https://github.com/simularium/simularium-website/issues";
export const CONTACT_FORM_URL = "https://forms.gle/mwoJjaj3PcbTVStU7";
export const CYTOSIM_URL = "https://gitlab.com/f.nedelec/cytosim";
export const PHYSICELL_URL = "http://physicell.org/";
export const READDY_URL = "https://readdy.github.io/";
export const MCELL_URL = "https://mcell.org/";
export const SMOLDYN_URL = "http://www.smoldyn.org/";
export const SPRINGSALAD_URL = "https://vcell.org/ssalad";
export const MEDYAN_URL = "http://medyan.org/";
export const UI_TEMPLATE_URL_ROOT =
    "https://api.github.com/repos/simularium/simulariumio/contents/ui-templates";
export const UI_TEMPLATE_DOWNLOAD_URL_ROOT =
    "https://raw.githubusercontent.com/simularium/simulariumio/main/ui-templates";

export const SUPPORTED_ENGINES = [
    ["ReaDDy", READDY_URL],
    ["PhysiCell", PHYSICELL_URL],
    ["CytoSim", CYTOSIM_URL],
    ["MCell", MCELL_URL],
    ["Smoldyn", SMOLDYN_URL],
    ["SpringSaLaD", SPRINGSALAD_URL],
    ["MEDYAN", MEDYAN_URL],
];
export const ENGINE_TO_TEMPLATE_MAP: { [key in AvailableEngines]: string } = {
    [AvailableEngines.Smoldyn]: "smoldyn_data",
    // todo: restore these when these engines are ready
    // [AvailableEngines.Cytosim]: "cytosim_data",
    // [AvailableEngines.CellPack]: "cellpack_data",
    // [AvailableEngines.SpringSalad]: "springsalad_data",
};

// If any these URLs are used as a trajUrl param, we want to redirect to a networked file
// More info: https://github.com/simularium/simularium-website/issues/213
export const USER_TRAJ_REDIRECTS = [
    "https://aics-agentviz-data.s3.us-east-2.amazonaws.com/trajectory/springsalad_condensate_formation_Below_Ksp.simularium",
    "https://aics-agentviz-data.s3.us-east-2.amazonaws.com/trajectory/springsalad_condensate_formation_At_Ksp.simularium",
    "https://aics-agentviz-data.s3.us-east-2.amazonaws.com/trajectory/springsalad_condensate_formation_Above_Ksp.simularium",
];

export const MOBILE_CUTOFF = "(max-width: 900px)";
export const MAX_CONVERSION_FILE_SIZE = 2e8; // 200 MB
