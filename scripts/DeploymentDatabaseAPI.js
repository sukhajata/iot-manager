import axios from "axios";
import { PermissionError, NotFoundError } from "./errors";

class DeploymentDatabaseAPI {
  /**
   * Posts and gets data from the new Database API
   */
  constructor() {
    this.host = "https://ddb.api.powerpilot.nz";
    this.axiosConfig = {
      timeout: 10000
    };
  }
  async TryDefaultLogin() {
    try {
      console.warn("Attempting to log into DeploymentDatabase...");
      let token = await this.GetAuthToken(this.defaultUserDetails);
      return token;
    } catch (e) {
      console.warn(
        "Failed to log into DeploymentDatabase with default credentials",
        this.defaultUserDetails
      );
    }
  }

  /**
   * Calling this with valid login details will add a JWT token to the request header, allowing other methods to work
   * @param {UserAuthenticationDTO} loginDetails
   */
  async GetAuthToken(loginDetails) {
    let token = await this._HTMLPost(`${this.host}/api/Login`, loginDetails);

    // @ts-ignore
    this.UseAuthToken(token);
    return token;
  }

  UseAuthToken(token) {
    axios.defaults.headers.common = { Authorization: `Bearer ${token}` };
  }

  /**
   * @param {Device} newDevice
   */
  async CreateOrdreredDevice(newDevice) {
    try {
      let newEntity = await this._HTMLPost(
        `${this.host}/api/Device`,
        newDevice
      );
      return newEntity;
    } catch (e) {
      throw e;
    }
  }

  /**
   * @param {Location} newLocation
   */
  async CreateLocation(newLocation) {
    let newEntity = await this._HTMLPost(
      `${this.host}/api/Location`,
      newLocation
    );
    return newEntity;
  }

  /**
   *
   * @param {Order} newOrder
   */
  async CreateOrder(newOrder) {
    let newEntity = await this._HTMLPost(`${this.host}/api/Order`, newOrder);
    return newEntity;
  }

  //User actions
  /**
   *
   * @param {UserAuthenticationDTO} newUserLoginDetails
   */
  async RegisterNewUser(newUserLoginDetails) {
    let newEntity = await this._HTMLPost(`${this.host}/api/RegisterNewUser`, {
      username: newUserLoginDetails.username,
      password: newUserLoginDetails.password
    });
    return newEntity;
  }

  /**
   *
   * @param {string} name
   * @returns {User}
   */
  async GetUserByName(name) {
    let results = await this._HTMLGet(`${this.host}/api/User?Name=${name}`);
    return results;
  }

  /**
   *
   * @param {Tenant} newTenant
   * @returns {Tenant}
   */
  async CreateTenant(newTenant) {
    let newEntity = await this._HTMLPost(`${this.host}/api/Tenant`, newTenant);
    return newEntity;
  }

  /**
   *
   * @param {Software} newSoftware
   */
  async CreateSoftware(newSoftware) {
    let newEntity = await this._HTMLPost(
      `${this.host}/api/Software`,
      newSoftware
    );
    return newEntity;
  }

  /**
   *
   * @param {DeviceConfiguration} newDeviceConfiguration
   */
  async CreateDeviceConfiguration(newDeviceConfiguration) {
    let newEntity = await this._HTMLPost(
      `${this.host}/api/Configurations/Device`,
      newDeviceConfiguration
    );
    return newEntity;
  }

  /**
   *
   * @param {BackendConfiguration} newBackendConfiguration
   */
  async CreateBackendConfiguration(newBackendConfiguration) {
    let newEntity = await this._HTMLPost(
      `${this.host}/api/Configurations/Backend`,
      newBackendConfiguration
    );
    return newEntity;
  }

  /**
   *
   * @param {DeviceConfigurationDeployment} newDeviceConfigurationDeployment
   */
  async CreateDeviceConfigurationDeployment(newDeviceConfigurationDeployment) {
    await this._CreateDeployment(
      "DeviceConfigurationDeployments",
      newDeviceConfigurationDeployment
    );
  }

  /**
   *
   * @param {SoftwareDeployment} newSoftwareDeployment
   */
  async CreateSoftwareDeployment(newSoftwareDeployment) {
    await this._CreateDeployment("SoftwareDeployments", newSoftwareDeployment);
  }

  /**
   *
   * @param {InstallationDeployment} newInstallationDeployment
   */
  async CreateInstallationDeployment(newInstallationDeployment) {
    await this._CreateDeployment(
      "InstallationDeployments",
      newInstallationDeployment
    );
  }

  async _CreateDeployment(deploymentTypeCollectionName, deployment) {
    try {
      let newEntity = await this._HTMLPost(
        `${this.host}/api/Deployments/${deploymentTypeCollectionName}`,
        deployment
      );
      return newEntity;
    } catch (e) {
      throw e;
    }
  }

  /**
   *
   * @param {number} userId
   * @param {number} startIndex
   * @param {number} maxResults
   */
  async GetDeploymentsByUser(userId, startIndex = 0, maxResults = 10) {
    let parameters = { userId, startIndex, maxResults };
    let results = await this._HTMLGet(
      `${this.host}/api/Deployments/SoftwareDeployments/ByUser`,
      parameters
    );
    return results;
  }

  /**
   *
   * @param {Note} newNote
   */
  async CreateNote(newNote) {
    await this._HTMLPost(`${this.host}/api/Note`, newNote);
  }

  /**
   *
   * @param {string} VersionNumber
   */
  async GetSoftwareByVersion(VersionNumber) {
    let parameters = {
      whereCondition: `VersionNumber == "${VersionNumber}"`,
      sort: "VersionNumber DESC",
      startIndex: 0,
      maxResults: 5
    };
    let results = await this._HTMLGet(`${this.host}/api/Software`, parameters);
    return results;
  }

  async GetAllDevices() {
    let parameters = {
      startIndex: 0,
      maxResults: 99999
    };
    let results = await this._HTMLGet(`${this.host}/api/Device`, parameters);
    return results;
  }
  /**
   *
   * @param {number} startIndex //specify the first index of the results that you want to return
   * @param {number} maxResults //specify the maximum number of results
   * @param {string} whereCondition
   * @param {string} sort
   */
  async GetDevices(startIndex, maxResults, whereCondition, sort) {
    let parameters = {};
    if (startIndex !== undefined) {
      parameters.startIndex = startIndex;
    }
    if (maxResults !== undefined) {
      parameters.maxResults = maxResults;
    }
    if (whereCondition !== undefined) {
      parameters.whereCondition = whereCondition;
    }
    if (sort !== undefined) {
      parameters.sort = sort;
    }
    let results = await this._HTMLGet(`${this.host}/api/Device`, parameters);
    return results;
  }
  /**
   *
   * @param {number} Id
   * @returns {Device}
   */
  async GetDevice(Id) {
    let results = await this._HTMLGet(`${this.host}/api/Device/${Id}`);
    return results;
  }

  /**
   *
   * @param {number} SerialNumber
   * @returns {Device}
   */
  async GetDeviceBySerialNumber(SerialNumber) {
    const results = await this._HTMLGet(`${this.host}/api/Device/Serial`, {
      serial: SerialNumber
    });
    return results;
  }

  async GetDefaultUser() {
    let parameters = {
      whereCondition: `UserName == "${this.defaultUserDetails.username}"`
    };
    let results = await this._HTMLGet(`${this.host}/api/User`, parameters);
    return results;
  }

  /** Sites */

  /**
   *
   * @param {Site} site
   */
  async CreateSite(site) {
    const newSite = await this._HTMLPost(`${this.host}/api/Site`, site);
    return newSite;
  }

  async GetSites() {
    const parameters = {
      sort: "DateModified DESC"
    };
    const sites = await this._HTMLGet(`${this.host}/api/Site`, parameters);
    return sites;
  }

  /**
   *
   * @param {number} siteId
   */
  async GetSite(siteId) {
    const site = await this._HTMLGet(`${this.host}/api/Site/${siteId}`);
    return site;
  }

  async UpdateSite(site) {
    const updatedSite = await this._HTMLPut(`${this.host}/api/Site/`, site);
    return updatedSite;
  }

  async _HTMLGet(string, parameters) {
    console.log("Get", string, parameters);
    try {
      const response = await axios.get(
        string,
        { params: parameters },
        this.axiosConfig
      );
      return response.data;
    } catch (error) {
      this._handleError(error);
    }
  }

  async _HTMLPost(string, data) {
    console.log("Post", string, data);
    try {
      const response = await axios.post(string, data, this.axiosConfig);
      return response.data;
    } catch (error) {
      this._handleError(error);
    }
  }

  async _HTMLPut(string, data) {
    console.log("Put", string, data);
    try {
      const response = await axios.put(string, data, axios.axiosConfig);
      return response.data;
    } catch (error) {
      this._handleError(error);
    }
  }

  _handleError(error) {
    console.log(error);
    if ("data" in error && "ExceptionMessage" in error.data) {
      throw error.data.ExceptionMessage;
    }
    if (!error.response || !error.response.status) {
      throw new Error(JSON.stringify(error));
    }

    if (error.response.data && error.response.data.Message) {
      if (error.response.status == 400) {
        throw new PermissionError(
          "Invalid request - " + error.response.data.Message
        );
      }
      if (error.response.status == 403) {
        throw new PermissionError(
          "Access unauthorized - " + error.response.data.Message
        );
      }
    }
    if (error.response.status == 404) {
      throw new NotFoundError("Item not found");
    }
    const data = error.response.data ? JSON.stringify(error.response.data) : "";
    throw new Error(error.response.status + " " + data);
  }
}

/**
 * 0 = None,
 * 1 = Ordered,
 * 2 = Numbered,
 * 3 = Tested,
 * 4 = Configured,
 * 5 = Assigned,
 * 6 = Installed
 * @typedef {number} DeviceState
 **/

/**
 * 0 = None,
 * 1 = Crossarm,
 * 2 = SwitchBoard,
 * 3 = MeterBox,
 * 4 = Substation,
 * 5 = PillarBox
 * @typedef {number} InstallType
 **/

/**
 * 0 = None,
 * 1 = C11,
 * 2 = M11,
 * 3 = S11,
 * @typedef {number} DeviceType
 **/

/**
 * 0 = None,
 * 1 = M11,
 * 2 = SPM91,
 * 3 = SPM93,
 * 4 = SPM32,
 * 5 = SPM33,
 * @typedef {number} MeterType
 **/

/**
 * 0 = None,
 * 1 = Failed,
 * 2 = Inactive,
 * 3 = OnHold,
 * 4 = Ready,
 * 5 = Deploying,
 * 6 = Deployed,
 * @typedef {number} DeploymentState
 **/

/**
 * 0 = None,
 * 1 = Serial,
 * 2 = OTAWifi,
 * 3 = OTALora,
 * @typedef {number} DeploymentMethod
 **/

/**
 * @typedef {object} Note
 * @property {number=} Id ddb autopopulated
 * @property {number} DeviceFK
 * @property {string} Comment
 * @property {string=} Date ddb autopopulated
 **/

/**
 * @typedef {object} Device
 * @property {number=} Id ddb autopopulated
 * @property {number} SerialNumber
 * @property {string} MACAddress
 * @property {string=} TestResults
 * @property {string=} DevEUI
 * @property {string=} ProductName
 * @property {DeviceType} DeviceType
 * @property {DeviceType} DeviceTypeRequirement
 * @property {number} OrderFK
 **/

/**
 * @typedef {object} SoftwareDeployment
 * @property {number} DeployedSoftwareFK
 *
 * @property {number=} Id ddb autopopulated
 * @property {number} DeployerUserFK
 * @property {number} DeviceFK
 * @property {number} DeploymentDate ddb autopopulated
 * @property {DeploymentState} DeploymentState
 * @property {DeploymentMethod} DeploymentMethod
 **/

/**
 * @typedef {object} InstallationDeployment
 * @property {Site} Site
 * @property {Enclosure=} Enclosure
 * @property {DetailsOfInstall} DetailsOfInstall
 * @property {string} InstallCheckResults
 * @property {number} SiteFK
 * @property {number=} EnclosureFK
 * @property {number} DetailsOfInstallFK
 **/

/**
 * @typedef {object} Site
 * @property {number} Id
 * @property {InstallType} InstallType
 * @property {string} InstallIdentifier
 * @property {number} DateModified
 * @property {Location} Location
 * @property {number} LocationFK
 * @property {Enclosure[]} Enclosures
 * @property {DetailsOfInstall[]} DetailsOfInstalls
 **/

/**
 * @typedef {object} Enclosure
 * @property {number} Id
 * @property {number} SiteFK
 * @property {DetailsOfInstall[]} DetailsOfInstalls
 **/

/**
 * @typedef {object} DetailsOfInstall
 * @property {number} Id
 * @property {string} ICPNumber
 * @property {boolean} MeteringRed
 * @property {boolean} MeteringWhite
 * @property {boolean} MeteringBlue
 * @property {number} PrimaryCT
 * @property {string} InstallCheckResults
 * @property {Location} MeteredPremiseLocation
 * @property {number} MeteredPremiseLocationFK
 * @property {Device} Device
 * @property {number=} DeviceFK
 * @property {number=} EnclosureFK
 * @property {number=} SiteFK
 **/

/**
 * @typedef {object} BackendConfigurationDeployment
 * @property {number} DeployedBackedConfigurationFK
 *
 * @property {number=} Id ddb autopopulated
 * @property {number} DeployerUserFK
 * @property {number} DeviceFK
 * @property {number} DeploymentDate ddb autopopulated
 * @property {DeploymentState} DeploymentState
 * @property {DeploymentMethod} DeploymentMethod
 **/

/**
 * @typedef {object} DeviceConfigurationDeployment
 * @property {number} DeviceConfigurationFK
 *
 * @property {number=} Id ddb autopopulated
 * @property {number} DeployerUserFK
 * @property {number} DeviceFK
 * @property {string} DeploymentDate ddb autopopulated
 * @property {DeploymentState} DeploymentState
 * @property {DeploymentMethod} DeploymentMethod
 **/

/**
 * @typedef {object} DeviceConfiguration
 * @property {MeterType} MeterType
 * @property {number} MeterCTRatio
 * @property {number} ModbusAddress
 * @property {number} RadioOffset
 * @property {boolean} ExternalAntenna
 * @property {string=} DownlinkReservedMinutesCSV
 * @property {string=} OTAWiFiCSV
 *
 * @property {number=} Id ddb autopopulated
 * @property {boolean} LoraABPJoin
 * @property {string=} DevAddress
 * @property {string=} NetworkSoftwareKey
 * @property {string=} ApplicationSoftwareKey
 * @property {string=} ApplicationEUI
 * @property {string=} ApplicationKey
 **/

/**
 * @typedef {object} BackendConfiguration
 * @property {string=} PPNumber
 * @property {boolean} Active
 * @property {string} Application
 * @property {string} SPConnector
 * @property {string} IoTHubDeviceKey
 * @property {string} IoTHubHostname
 * @property {string} MQTTConnectionString
 *
 * @property {number=} Id ddb autopopulated
 * @property {boolean} LoraABPJoin
 * @property {string=} DevAddress
 * @property {string=} NetworkSoftwareKey
 * @property {string=} ApplicationSoftwareKey
 * @property {string=} ApplicationEUI
 * @property {string=} ApplicationKey
 **/

/**
 * @typedef {object} Software
 * @property {number=} Id ddb autopopulated
 * @property {string} VersionNumber
 * @property {boolean} ReadyToDeploy
 * @property {number} ProtocolVersion
 * @property {string} ReleaseDate
 **/

/**
 * @typedef {object} Tenant
 * @property {number=} Id ddb autopopulated
 * @property {number} TenantLocationFK
 * @property {string} Name
 * @property {string} DefaultApplication
 * @property {string} DefaultSPConnector
 * @property {string} LoRaServerApplicationID
 * @property {string} LoriotApplicationID
 * @property {boolean} Active
 **/

/**
 * @typedef {object} User
 * @property {number=} Id ddb autopopulated
 * @property {string} UserName
 * @property {number} TenantFK
 * @property {string} SaltedHashedPassword ddb autopopulated
 * @property {string} Salt ddb autopopulated
 * @property {string} RolesCSV
 **/

/**
 * @typedef {object} UserAuthenticationDTO
 * @property {string} username
 * @property {string} password
 **/

/**
 * @typedef {object} Order
 * @property {number=} Id ddb autopopulated
 * @property {number} TenantFK
 **/

export default new DeploymentDatabaseAPI();
