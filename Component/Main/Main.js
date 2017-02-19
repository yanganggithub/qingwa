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

import Home from '../Home/Home';
import Channel from '../Channel/Channel';
import Rank from '../Rank/Rank';
import Me from '../Me/Me';


export default  class Main extends Component{
    constructor(props){
        super(props);
         // 初始化函数(变量是可以改变的,充当状态机的角色)
        this.state = {selectedTab:'home' };
    }



    render() {

        return (
            <TabNavigator tabBarStyle={styles.tabStyle}>
                {/*--首页--*/}
                {this.renderTabBarItem('首页', 'tab_home', 'tab_home_current','home', '首页', Home)}
                {/*--商家--*/}
                {this.renderTabBarItem('频道', 'tab_type', 'tab_type_current','channel', '频道', Channel)}
                {/*--我的--*/}
                {this.renderTabBarItem('排行', 'tab_top', 'tab_top_current','rank', '排行', Rank)}
                {/*--更多--*/}
                {this.renderTabBarItem('我的', 'tab_me', 'tab_me_current','me', '我的', Me)}
            </TabNavigator>
        );
    }

    // 每一个TabBarItem
    renderTabBarItem(title, iconName, selectedIconName, selectedTab, componentName, component){

        return(
           
            <TabNavigator.Item
                title={title}  // 传递变量,一定要加{}
                renderIcon={() => <Image source={{uri: iconName}} style={styles.iconStyle}/>} // 图标
                renderSelectedIcon={() =><Image source={{uri: selectedIconName}} style={styles.iconStyle}/>}   // 选中的图标
                onPress={()=>{this.setState({selectedTab:selectedTab})}}
                selected={this.state.selectedTab === selectedTab}
                selectedTitleStyle={styles.selectedTitleStyle}
            >
              <Navigator
                    initialRoute={{name:componentName,component:component}}
                    configureScene={()=>{// 过渡动画
                             return Navigator.SceneConfigs.PushFromRight;
                        }}
                    renderScene={(route,navigator)=> {
                        if(route.component){
                        return <route.component route={route} navigator={navigator} />
                    }
                    }
                       
                    }    
                />
                
            </TabNavigator.Item>
        )
    }
}


const styles = StyleSheet.create({
    iconStyle:{
        width: Platform.OS === 'ios' ? 20 : 25,
        height:Platform.OS === 'ios' ? 20 : 25
    },

    selectedTitleStyle:{
        color:'#262626'
    },
    tabStyle:{
        height:49,
        alignItems:'center'
    }
});


