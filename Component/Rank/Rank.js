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
    Navigator,
    TouchableOpacity
} from 'react-native';

import ScrollableTabView from 'react-native-scrollable-tab-view';





export default class Rank extends Component{
    constructor(props){
        super(props);
     
    }



    render() {
        return (
            <View style={styles.container}>
                {/*导航*/}
                {this.renderNavBar()}
                <ScrollableTabView
                    tabBarUnderlineColor='#FF0000'
                    tabBarUnderlineStyle={styles.lineStyle}
                    tabBarActiveTextColor='#00ae54'
                    tabBarInactiveTextColor='#262626'
                    tabBarTextStyle={{fontSize: 14}}
                    >

                    <Movie tabLabel="电影"  />
                    <TVSeries tabLabel="电视剧" />
                    <Variety tabLabel="综艺" />
                    <Comic tabLabel="动漫" />
                </ScrollableTabView>
            </View>

        );
    }

    // 导航条
    renderNavBar(){
        return(
            <View style={styles.navOutViewStyle}>
                <TouchableOpacity  style={styles.leftViewStyle}>
                    <Image source={{uri: 'nav_search'}} style={styles.navImageStyle}/>
                </TouchableOpacity>
                <View style={styles.txtStyle}>
                    <Text style={{color:'white', fontSize:18, fontWeight:'bold'}}>排行榜</Text>
                </View>

                <TouchableOpacity onPress={()=>{alert('点了!')}} style={styles.rightViewStyle}>
                    <Image source={{uri: 'nav_record'}} style={styles.navImageStyle}/>
                </TouchableOpacity>
            </View>
        )
    }

   
}


const styles = StyleSheet.create({

    container:{
        flex:1,
    },


    lineStyle:{
      backgroundColor:'#00ae54'
    },

    txtStyle:{
        marginTop:30

    },

    navOutViewStyle:{
        height: Platform.OS == 'ios' ? 64 : 44,
        backgroundColor:'rgba(17,17,17,1.0)',

        // 设置主轴的方向
        flexDirection:'row',

        // 主轴方向居中
        justifyContent:'center'
    },
    leftViewStyle:{
        // 绝对定位
        position:'absolute',
        left:10,
        bottom:Platform.OS == 'ios' ? 15:13
    },

    navImageStyle:{
        width:Platform.OS == 'ios' ? 24: 24,
        height:Platform.OS == 'ios' ? 24: 24,
    },

    rightViewStyle:{
        // 绝对定位
        position:'absolute',
        right:10,
        bottom:Platform.OS == 'ios' ? 15:13
    },

});

class Movie extends Component {
    render() {
        return(
            <Text>hello</Text>
        );
    }
}
class TVSeries extends Component {
    render() {
        return(
            <Text>hello</Text>
        );
    }
}

class Variety extends Component {
    render() {
        return(
            <Text>hello</Text>
        );
    }
}

class Comic extends Component {
    render() {
        return(
            <Text>hello</Text>
        );
    }
}

