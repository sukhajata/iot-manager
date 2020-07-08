import Enclosure from "../model/Enclosure";
import Location from "../model/Location";
import DetailsOfInstall from "../model/DetailsOfInstall";

//when creating a new site
export const Site = {
  InstallType: 0,
  InstallIdentifier: 0,
  Location: new Location(),
  DeployerUserFK: 0,
  Enclosures: [],
  DetailsOfInstalls: []
};

//from database
export const Sites = [];

export function setSiteToFile(site) {
  Site.Location = site.Location;
  Site.DeployerUserFK = site.DeployerUserFK;
  Site.InstallIdentifier = site.InstallIdentifier;
  Site.InstallType = site.InstallType;
  Site.Enclosures = site.Enclosures;
}

export function addEnclosure(siteId) {
  let site = Sites.find(site => site.Id === siteId);
  if (site) {
    const enclosure = new Enclosure(site.Enclosures.length + 1);
    site.Enclosures.push(enclosure);
  } else {
    throw new Error("Site not found, cannot add enclosure");
  }
}

export function removeEnclosure(siteId, enclosureId) {
  let site = Sites.find(site => site.Id === siteId);
  const filtered = site.Enclosures.filter(
    enclosure => enclosure.LocalId !== enclosureId
  );
  site.Enclosures = filtered;
}

export function getEnclosure(id) {
  return Site.Enclosures.find(enclosure => enclosure.LocalId === id);
}

export function addDevice(enclosureId) {
  const enclosure = getEnclosure(enclosureId);
  const id = enclosure.DetailsOfInstalls.length + 1;
  const detailsOfInstall = new DetailsOfInstall(id);
  enclosure.DetailsOfInstalls.push(detailsOfInstall);
  return id;
}

export function getDevice(enclosureId, deviceId) {
  const enclosure = getEnclosure(enclosureId);
  return enclosure.DetailsOfInstalls.find(
    detailsOfInstall => detailsOfInstall.LocalId === deviceId
  );
}

export function removeDevice(enclosureId, deviceId) {
  const enclosure = getEnclosure(enclosureId);
  const filtered = enclosure.DetailsOfInstalls.filter(
    detailsOfInstall => detailsOfInstall.LocalId !== deviceId
  );
  enclosure.DetailsOfInstalls = filtered;
}
