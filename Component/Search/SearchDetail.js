/**
 * Created by yangang on 17/3/22.
 */
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


export default class SearchDetail extends Component{
    constructor(props){
        super(props);

    }

    render() {
        return (
            <View></View>
        );
    }


}

const styles = StyleSheet.create({
    iconStyle:{
        width: Platform.OS === 'ios' ? 30 : 25,
        height:Platform.OS === 'ios' ? 30 : 25
    },
    backgroundVideo: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
    },

    selectedTitleStyle:{
        color:'orange'
    }
});