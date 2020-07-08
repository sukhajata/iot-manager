import Location from "./Location";
import { TESTING_STATES } from "../model/DeviceTestResults";
import DeviceTestResults from "./DeviceTestResults";

class DetailsOfInstall {
  constructor(localId) {
    this.LocalId = localId;
    this.MeteredPremiseLocation = new Location();
    //this.InstallCheckResults = "";
    this.ICPNumber = "";
    this.MeteringRed = false;
    this.MeteringWhite = false;
    this.MeteringBlue = false;
    this.MeteringUnknown = false;
    this.PrimaryCT = 0;
    this.DeviceFK = 0;
    //this.SerialNumber = 0;
    //this.DeploymentState = 6; //deployed
    this.Device = {};
    this.TestingState = TESTING_STATES.PENDING;
    this.TestResults = new DeviceTestResults();
  }
}

export default DetailsOfInstall;
