/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
} from 'react-native';




/**-------导入外部的组件类---------**/
import Main from './Component/Main/Main'

import codePush from "react-native-code-push";


  global.console = {
    info: () => {},
    log: () => {},
    warn: () => {},
    error: () => {},
  };



export default class qingwa extends Component {
  render() {

    return (
        <Main/>
    );
  }

  codePushStatusDidChange(status) {
    console.log('status:',status);
    switch (status) {
      case codePush.SyncStatus.CHECKING_FOR_UPDATE:
        console.log("Checking for updates.");
        break;
      case codePush.SyncStatus.DOWNLOADING_PACKAGE:
        console.log("Downloading package.");
        break;
      case codePush.SyncStatus.INSTALLING_UPDATE:
        console.log("Installing update.");
        break;
      case codePush.SyncStatus.UP_TO_DATE:
        console.log("Installing update.");
        break;
      case codePush.SyncStatus.UPDATE_INSTALLED:
        console.log("Update installed.");
        break;
    }
  }

  codePushDownloadDidProgress(progress) {
    console.log(progress.receivedBytes + " of " + progress.totalBytes + " received.");
  }

  componentDidMount() {
    console.log('组件加载后执行');

    //访问慢,不稳定
    codePush.checkForUpdate().then((update) => {
      if (!update) {
        Alert.alert("提示", "已是最新版本--", [
          {
            text: "Ok", onPress: () => {
            console.log("点了OK");
          }
          }
        ]);
      }
      else {
        codePush.sync({ checkFrequency: codePush.CheckFrequency.ON_APP_RESUME, installMode: codePush.InstallMode.ON_NEXT_RESUME });
      }
    });
  }

}



qingwa = codePush(qingwa);


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  }
});

AppRegistry.registerComponent('qingwa', () => qingwa);
