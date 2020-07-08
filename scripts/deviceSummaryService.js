import { Location } from "expo";
/**
 *
 * @param {DeviceState} deviceState
 */
export function deviceStateToString(deviceState) {
  let states = {
    0: "None",
    1: "Ordered",
    2: "Numbered",
    3: "Tested",
    4: "Configured",
    5: "Assigned",
    6: "Installed"
  };
  return states[deviceState];
}

export async function getLocationAsync() {
  const location = await Location.getCurrentPositionAsync({});
  return location;
}

export async function getAddress(location) {
  const address = await Location.reverseGeocodeAsync(location);
  return address;
}

export async function geoCodeAsync(address) {
  const results = await Location.geocodeAsync(address);
  return results[0];
}

export const INSTALLATION_TYPES = {
  NONE: 0,
  CROSSARM: 1,
  SWITCHBOARD: 2,
  METER_BOX: 3,
  SUBSTATION: 4,
  PILLAR_BOX: 5
};

export function getInstallationTypes() {
  return [
    { value: INSTALLATION_TYPES.CROSSARM, label: "Crossarm" },
    { value: INSTALLATION_TYPES.SWITCHBOARD, label: "Switchboard" },
    { value: INSTALLATION_TYPES.METER_BOX, label: "Meter Box" },
    { value: INSTALLATION_TYPES.SUBSTATION, label: "Substation" },
    { value: INSTALLATION_TYPES.PILLAR_BOX, label: "Pillar Box" }
  ];
}

export function getInstallationTypeByValue(value) {
  const item = getInstallationTypes().find(item => item.value === value);
  if (item) {
    return item.label;
  }
  return "";
}

export function getIdentifierLabel(installationType) {
  let identifierLabel = "";
  switch (installationType) {
    case 1:
      identifierLabel = "Pole number";
      break;
    case 4:
      identifierLabel = "Substation number";
      break;
    case 5:
      identifierLabel = "Pillar box number";
      break;
    default:
      identifierLabel = null;
      break;
  }
  return identifierLabel;
}

export function getCTRatios() {
  return [
    { value: 0, label: "----" },
    { value: 100, label: "100/5" },
    { value: 200, label: "200/5" },
    { value: 300, label: "300/5" },
    { value: 1200, label: "1200/5" },
    { value: 5, label: "Whole current" }
  ];
}

export function getCTRatioLabel(ctRatio) {
  const item = getCTRatios().find(item => item.value === ctRatio);
  return item.label;
}

export function getPhases(red, white, blue) {
  let phases = [];
  if (red) {
    phases.push("red");
  }
  if (white) {
    phases.push("white");
  }
  if (blue) {
    phases.push("blue");
  }
  if (!red && !white && !blue) {
    phases.push("unknown");
  }
  return phases.join();
}

export function getFormattedDate(date) {
  var d = new Date(date);
  return (
    d.getDate().toString() +
    "/" +
    d.getMonth().toString() +
    "/" +
    d.getFullYear().toString()
  );
}

/*
 * 0 = None,
 * 1 = Failed,
 * 2 = Inactive,
 * 3 = OnHold,
 * 4 = Ready,
 * 5 = Deploying,
 * 6 = Deployed,
 *
 */
export const DEPLOYMENT_STATES = {
  NONE: 0,
  FAILED: 1,
  INACTIVE: 2,
  ONHOLD: 3,
  READY: 4,
  DEPLOYING: 5,
  DEPLOYED: 6
};

export function deploymentStateToString(deploymentState) {
  switch (deploymentState) {
    case DEPLOYMENT_STATES.NONE:
      return "None";
    case DEPLOYMENT_STATES.FAILED:
      return "Failed";
    case DEPLOYMENT_STATES.INACTIVE:
      return "Inactive";
    case DEPLOYMENT_STATES.ONHOLD:
      return "On hold";
    case DEPLOYMENT_STATES.READY:
      return "Ready to deploy";
    case DEPLOYMENT_STATES.DEPLOYING:
      return "Deploying";
    case DEPLOYMENT_STATES.DEPLOYED:
      return "Deployed";
    default:
      return "Not known";
  }
}

/**
 *
 * @param {object} from
 * @param {object} to // import { InstallationDeployment } from './DeploymentData'
 */
export function mapInstallationDeploymentData(from, to) {
  for (let key in to.keys) {
    to[key] = from[key];
  }
}

/**
 *
 * @param {object} from
 * @param {object} to //import { DeviceInfo } from './DeploymentData'
 */
export function mapDeviceInfo(from, to) {
  for (let key in to.keys) {
    to[key] = from[key];
  }
}

/**
 *
 * @param {object} from
 * @param {object} to //import { PresmiseLocation } from './DeploymentData'
 */
export function mapPremiseLocation(from, to) {
  for (let key in to.keys) {
    to[key] = from[key];
  }
}

export const ENCLOSURE_TYPE = {
  NO_ENCLOSURE: 0,
  SINGLE_DEVICE: 1,
  DOUBLE_DEVICE: 2,
  TRIPLE_DEVICE: 3
};

export function getEnclosureTypes() {
  return [
    { label: "No enclosure", value: ENCLOSURE_TYPE.NO_ENCLOSURE },
    { label: "Single device", value: ENCLOSURE_TYPE.SINGLE_DEVICE },
    { label: "Double device", value: ENCLOSURE_TYPE.DOUBLE_DEVICE },
    { label: "Triple device", value: ENCLOSURE_TYPE.TRIPLE_DEVICE }
  ];
}
