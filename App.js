import React from "react";
import { View } from "react-native";
//Auth screens
import AuthLoadingScreen from "./screens/auth/AuthLoadingScreen.js";
import SignInScreen from "./screens/auth/SignInScreen.js";
import UserConfirmationScreen from "./screens/auth/UserConfirmationScreen";
//App screens
import HomeScreen from "./screens/app/HomeScreen";
import SearchingScreen from "./screens/app/SearchingScreen";
import ScanningScreen from "./screens/app/ScanningScreen";
import DeviceAddressScreen from "./screens/app/DeviceAddressScreen";
import DeviceDetailsScreen from "./screens/app/DeviceDetailsScreen";
import DeviceSummaryScreen from "./screens/app/DeviceSummaryScreen";
import DeviceTestScreen from "./screens/app/DeviceTestScreen";
import CommentsScreen from "./screens/app/CommentsScreen";
import SiteDetailsScreen from "./screens/app/SiteDetailsScreen";
import SiteSummaryScreen from "./screens/app/SiteSummaryScreen";
import InstallHomeScreen from "./screens/app/InstallHomeScreen";
import EditSiteScreen from "./screens/app/EditSiteScreen";
//other
import routes from "./routes";
import Sentry from "sentry-expo";
import {
  createSwitchNavigator,
  createStackNavigator,
  createAppContainer
} from "react-navigation";
import { useScreens } from "react-native-screens";
import { CurrentSiteProvider } from "./context/CurrentSiteContext";

//error logging
Sentry.config(
  "https://b73dd63d621d477395893e221e828d1d@sentry.io/1491359"
).install();

//disable console log in production
if (!__DEV__) {
  console.log = () => {};
}

//native navigation handling for better performance
useScreens();

const AppStack = createStackNavigator(
  {
    HomeScreen: HomeScreen,
    SiteSummaryScreen: SiteSummaryScreen,
    //InstallTypeScreen: InstallTypeScreen,
    SiteDetailsScreen: SiteDetailsScreen,
    DeviceAddressScreen: DeviceAddressScreen,
    DeviceDetailsScreen: DeviceDetailsScreen,
    DeviceSummaryScreen: DeviceSummaryScreen,
    CommentsScreen: CommentsScreen,
    InstallHomeScreen: InstallHomeScreen,
    SearchingScreen: SearchingScreen,
    ScanningScreen: ScanningScreen,
    DeviceTestScreen: DeviceTestScreen,
    EditSiteScreen: EditSiteScreen
  },
  {
    initialRouteName: routes.HOME_SCREEN
  }
);

const AuthStack = createStackNavigator({
  UserConfirmationScreen: UserConfirmationScreen,
  SignInScreen: SignInScreen
});

const AppContainer = createAppContainer(
  createSwitchNavigator(
    {
      AuthLoadingScreen: AuthLoadingScreen,
      App: AppStack,
      Auth: AuthStack
    },
    {
      initialRouteName: routes.AUTH_LOADING_SCREEN
    }
  )
);

export default (App = () => (
  <CurrentSiteProvider>
    <View style={{ flex: 1 }}>
      <AppContainer />
    </View>
  </CurrentSiteProvider>
));
