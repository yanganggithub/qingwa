/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

// npm install

import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Image,
    Platform,   // 判断当前运行的系统
    Navigator
} from 'react-native';


/**-----导入外部的组件类------**/
import TabNavigator from 'react-native-tab-navigator';


import Tabbar from '../Tabbar/Tabbar';


export default  class Main extends Component{
    constructor(props){
        super(props);
         // 初始化函数(变量是可以改变的,充当状态机的角色)

    }



    render() {

        return (

        <Navigator
            initialRoute={{name:"竹节棉",component:Tabbar}}
            configureScene={()=>{// 过渡动画
                return Navigator.SceneConfigs.PushFromRight;
            }}
            renderScene={(route,navigator)=> {
                if(route.component){
                    return <route.component {...route.params} navigator={navigator} />
                }
            }

            }
        />


        );
    }



}


const styles = StyleSheet.create({




});


