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

import Video from 'react-native-video';






export default class Me extends Component{
    constructor(props){
        super(props);
     
    }



    render() {
        return (
            <Video source={{uri: "background.mp4"}} // 视频的URL地址，或者本地地址，都可以.
                   rate={1.0}                   // 控制暂停/播放，0 代表暂停paused, 1代表播放normal.
                   volume={1.0}                 // 声音的放大倍数，0 代表没有声音，就是静音muted, 1 代表正常音量 normal，更大的数字表示放大的倍数
                   muted={false}                // true代表静音，默认为false.
                   paused={false}               // true代表暂停，默认为false
                   resizeMode="cover"           // 视频的自适应伸缩铺放行为，
                   repeat={true}                // 是否重复播放
                   playInBackground={false}     // 当app转到后台运行的时候，播放是否暂停
                   playWhenInactive={false}     // [iOS] Video continues to play when control or notification center are shown. 仅适用于IOS
                   onLoadStart={this.loadStart} // 当视频开始加载时的回调函数
                   onLoad={this.setDuration}    // 当视频加载完毕时的回调函数
                   onProgress={this.setTime}    //  进度控制，每250ms调用一次，以获取视频播放的进度
                   onEnd={this.onEnd}           // 当视频播放完毕后的回调函数
                   onError={this.videoError}    // 当视频不能加载，或出错后的回调函数
                   style={styles.backgroundVideo} />
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


