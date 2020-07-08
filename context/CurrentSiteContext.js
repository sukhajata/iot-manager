import React from "react";

import DetailsOfInstall from "../model/DetailsOfInstall";
import Enclosure from "../model/Enclosure";
import DeploymentDatabaseAPI from "../scripts/DeploymentDatabaseAPI";
import DeviceTestResults from "../model/DeviceTestResults";
import { TESTING_STATES } from "../model/DeviceTestResults";
import { setSite, getSite } from "../scripts/storageService";

const CurrentSiteContext = React.createContext();

class CurrentSiteProvider extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentSite: null,
      contextError: null
    };
  }

  loadSite = async siteId => {
    this.setState({ currentSite: null });

    let site = await DeploymentDatabaseAPI.GetSite(siteId);
    //let site = Sites.find(item => item.Id == siteId);
    if (!site.Enclosures) {
      site.Enclosures = [];
    }
    if (!site.DetailsOfInstalls) {
      site.DetailsOfInstalls = [];
    }
    site.Enclosures.forEach(enclosure => {
      enclosure.DetailsOfInstalls.forEach(detail => {
        detail.TestResults = new DeviceTestResults();
        detail.TestingState = TESTING_STATES.PENDING;
      });
    });
    site.DetailsOfInstalls.forEach(detail => {
      detail.TestResults = new DeviceTestResults();
      detail.TestingState = TESTING_STATES.PENDING;
    });
    this.setState({
      currentSite: site
    });
  };

  addDeviceToEnclosure = enclosure => {
    const deviceId = this.generateId(enclosure.DetailsOfInstalls.length + 1);
    const detailsOfInstall = new DetailsOfInstall(deviceId);
    enclosure.DetailsOfInstalls.push(detailsOfInstall);
    const currentSite = this.deepCopy(this.state.currentSite);
    const enclosures = currentSite.Enclosures.map(item => {
      if (item.Id === enclosure.Id || item.LocalId === enclosure.LocalId) {
        return enclosure;
      }
      return item;
    });
    currentSite.Enclosures = enclosures;
    this.setState({ currentSite });
    return deviceId;
  };

  addDeviceToSite = () => {
    const deviceId = this.generateId(
      this.state.currentSite.DetailsOfInstalls.length + 1
    );
    const detailsOfInstall = new DetailsOfInstall(deviceId);
    const currentSite = this.deepCopy(this.state.currentSite);
    currentSite.DetailsOfInstalls.push(detailsOfInstall);
    this.setState({ currentSite });
    return deviceId;
  };

  getDevice = (eid, did) => {
    const { currentSite } = this.state;
    const enclosureId = parseInt(eid);
    const deviceId = parseInt(did);
    if (enclosureId) {
      const enclosure = currentSite.Enclosures.find(
        item => item.Id === enclosureId || item.LocalId === enclosureId
      );
      if (enclosure) {
        const device = enclosure.DetailsOfInstalls.find(
          item => item.Id === deviceId || item.LocalId === deviceId
        );
        if (device) {
          return device;
        }
      }
      return null;
    } else {
      const device = currentSite.DetailsOfInstalls.find(
        item => item.Id === deviceId || item.LocalId === deviceId
      );
      return device;
    }
  };

  updateSiteDetails = site => {
    const currentSite = this.deepCopy(this.state.currentSite);
    currentSite.InstallType = site.InstallType;
    if (site.InstallType < 2 || site.InstallType > 3) {
      currentSite.InstallIdentifier = site.InstallIdentifier;
    }
    currentSite.Location = site.Location;

    this.setState({ currentSite });
  };

  updateDevice = (eid, device) => {
    const currentSite = this.deepCopy(this.state.currentSite);
    const enclosureId = parseInt(eid);
    if (enclosureId) {
      currentSite.Enclosures.forEach(enclosure => {
        if (enclosure.Id === enclosureId || enclosure.LocalId === enclosureId) {
          enclosure.DetailsOfInstalls.forEach(detail => {
            if (detail.Id === device.Id || detail.LocalId === device.LocalId) {
              detail = device;
            }
          });
        }
      });
    } else {
      currentSite.DetailsOfInstalls.forEach(detail => {
        if (detail.Id === device.Id || detail.LocalId === device.LocalId) {
          detail = device;
        }
      });
    }

    this.setState({ currentSite });
  };

  removeDevice = (eid, did) => {
    const currentSite = this.deepCopy(this.state.currentSite);
    const enclosureId = parseInt(eid);
    const deviceId = parseInt(did);
    if (enclosureId) {
      currentSite.Enclosures.forEach(enclosure => {
        if (enclosure.Id === enclosureId || enclosure.LocalId === enclosureId) {
          enclosure.DetailsOfInstalls = enclosure.DetailsOfInstalls.filter(
            detail => detail.Id !== deviceId && detail.LocalId !== deviceId
          );
        }
        return enclosure;
      });
    } else {
      currentSite.DetailsOfInstalls = currentSite.DetailsOfInstalls.filter(
        detail => detail.Id !== deviceId && detail.LocalId !== deviceId
      );
    }
    this.setState({ currentSite });
  };

  addEnclosure = () => {
    const currentSite = this.deepCopy(this.state.currentSite);
    const id = this.generateId(currentSite.Enclosures.length + 1);
    currentSite.Enclosures.push(new Enclosure(id));
    this.setState({ currentSite });
  };

  generateId(length) {
    const id = parseInt("9999" + length.toString());
    return id;
  }

  isLocalId(id) {
    if (id.toString().indexOf("9999") === 0) {
      return true;
    }
    return false;
  }

  removeEnclosure = enclosure => {
    //deep copy
    const currentSite = this.deepCopy(this.state.currentSite);
    if (enclosure.Id) {
      const newEnclosures = currentSite.Enclosures.filter(
        item => item.Id !== enclosure.Id
      );
      currentSite.Enclosures = newEnclosures;
    } else {
      //not yet pushed to database, use local id
      const newEnclosures = currentSite.Enclosures.filter(
        item => item.LocalId !== enclosure.LocalId
      );
      currentSite.Enclosures = newEnclosures;
    }
    this.setState({ currentSite });
  };

  deepCopy(toCopy) {
    return JSON.parse(JSON.stringify(toCopy));
  }

  save = async () => {
    //local storage
    await setSite(this.state.currentSite);

    //strip fields not used in database
    const currentSite = this.deepCopy(this.state.currentSite);
    currentSite.Enclosures.forEach(enclosure => {
      delete enclosure.LocalId;
      enclosure.DetailsOfInstalls.forEach(detail => {
        delete detail.TestResults;
        delete detail.TestingState;
        delete detail.LocalId;
        if (detail.DeviceFK === 0) {
          delete detail.DeviceFK;
          delete detail.Device;
        }
      });
      currentSite.DetailsOfInstalls.forEach(detail => {
        delete detail.TestResults;
        delete detail.TestingState;
        delete detail.LocalId;
        if (detail.DeviceFK === 0) {
          delete detail.DeviceFK;
          delete detail.Device;
        }
      });
    });
    try {
      const saved = await DeploymentDatabaseAPI.UpdateSite(currentSite);
      await this.loadSite(saved.Id);
      //this.setState({ currentSite: saved });
      return saved;
    } catch (error) {
      this.setState({ contextError: JSON.stringify(error) });
      return null;
    }
  };

  render() {
    return (
      <CurrentSiteContext.Provider
        value={{
          currentSite: this.state.currentSite,
          contextError: this.state.contextError,
          loadSite: this.loadSite,
          updateSiteDetails: this.updateSiteDetails,
          addDeviceToEnclosure: this.addDeviceToEnclosure,
          addDeviceToSite: this.addDeviceToSite,
          removeDevice: this.removeDevice,
          getDevice: this.getDevice,
          updateDevice: this.updateDevice,
          addEnclosure: this.addEnclosure,
          removeEnclosure: this.removeEnclosure,
          save: this.save
        }}
      >
        {this.props.children}
      </CurrentSiteContext.Provider>
    );
  }
}

const withCurrentSite = Child => props => (
  <CurrentSiteContext.Consumer>
    {context => <Child {...props} siteContext={context} />}
  </CurrentSiteContext.Consumer>
);

export { CurrentSiteContext, CurrentSiteProvider, withCurrentSite };
