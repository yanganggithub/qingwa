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




  // global.console = {
  //   info: () => {},
  //   log: () => {},
  //   warn: () => {},
  //   error: () => {},
  // };



export default class qingwa extends Component {
  render() {


    
    return (
        <Main/>
    );
  }
}

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
