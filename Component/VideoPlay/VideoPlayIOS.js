'use strict';
import React, {
    Component
} from 'react';

import {
    AlertIOS,
    AppRegistry,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    ActivityIndicator,
} from 'react-native';

import Video from 'react-native-video';

import Dimensions from 'Dimensions';

import request from '../Common/request';
import config from '../Common/config';

// Platform.OS === 'ios' ? <VideoPlayerIos/> : <VideoPlayerAndroid/>

const {width,height} = Dimensions.get('window');

export default class VideoPlayer extends Component {

    constructor(props){
        super(props);

        this.state={
            rowData: this.props.rowData,
            rate: 1,
            volume: 1,
            muted: false,
            resizeMode: 'contain',
            paused: false,

            duration: 0.0,
            currentTime: 0.0,

            videoLoaded:false,
            playing:false,

            realUrl:this.props.play_url

        }

        this._onLoadStart = this._onLoadStart.bind(this);
        this._onLoad = this._onLoad.bind(this);
        this._onProgress = this._onProgress.bind(this);
        this._onEnd = this._onEnd.bind(this);
        this._onError = this._onError.bind(this);

    }

    getCurrentTimePercentage() {
        if (this.state.currentTime > 0) {
            return parseFloat(this.state.currentTime) / parseFloat(this.state.duration);
        } else {
            return 0;
        }
    }



    render() {
        let rowData =  this.state.rowData;
        console.log('myurl' +this.props.play_url);



        const flexCompleted = this.getCurrentTimePercentage() * 100;
        const flexRemaining = (1 - this.getCurrentTimePercentage()) * 100;

        return (

            <View style={styles.container}>
                <Text style={styles.welcome} onPress={this._backToList}>
                    视频详情页面
                </Text>

                <View style={styles.videoBox}>

                    <Video
                        source={{uri: this.state.realUrl}}
                        style={styles.video}
                        rate={this.state.rate}
                        paused={this.state.paused}
                        volume={this.state.volume}
                        muted={this.state.muted}
                        resizeMode={this.state.resizeMode}
                        repeat={true}

                        onLoadStart={this._onLoadStart}
                        onLoad={this._onLoad}
                        onProgress={this._onProgress}
                        onEnd={this._onEnd}
                        onError={this._onError}

                    />

                    {!this.state.videoLoaded ?
                        <ActivityIndicator color="red" size="large"
                                           style={styles.loading} />
                        :null}

                    <View style={styles.progress}>
                        <View style={[styles.innerProgressCompleted, {flex: flexCompleted}]} />
                        <View style={[styles.innerProgressRemaining, {flex: flexRemaining}]} />
                    </View>


                </View>

            </View>

        );
    }

    // 请求网络数据
    componentDidMount(){
        this.loadDataFromNet();
    }

    loadDataFromNet(){

        console.log(this.props.id);
        request.post(config.api.base + 'play/setAddress/',{
            type:2,
            url:this.props.play_url,

        }).then(
            (responseData)=>{
                console.log('视频地址解析成功'+ responseData);
                console.log('真实地址'+responseData.data.file);
                console.log('responseData.data.type',responseData.data.play_type);
                this.setState({
                    realUrl:responseData.data.file
                })


            }
        ).catch(
            (err) => {
                if (err){
                    console.log(err);
                }
            }
        )
    }


    _onLoadStart(){
        console.log('_onLoadStart');
    }

    _onLoad(data){
        console.log('_onLoad----视频总长度:'+data.duration);
        // this.setState({duration: data.duration});

        this.setState({duration: data.duration});
    }

    _onProgress(data){
        console.log('_onProgress----数据对象：'+JSON.stringify(data));
        // this.setState({currentTime: data.currentTime});
        console.log('_onProgress----当前时间：'+data.currentTime);

        if(!this.state.videoLoaded){
            this.setState({
                videoLoaded:true,
            });
        }

        if(!this.state.playing){
            this.setState({
                playing:true,
            });
        }

        this.setState({currentTime: data.currentTime});


    }

    _onEnd(){
        console.log('_onEnd');
        alert('onEnd')
    }

    _onError(error){
        console.log('错误：'+JSON.stringify(error));
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

    videoBox:{
        width:width,
        height:360,
        backgroundColor:'black'
    },
    video:{
        width:width,
        height:350,
        backgroundColor:'black'
    },

    loading:{
        position:'absolute',
        left:0,
        width:width,
        top:160,
        backgroundColor:'transparent',
        alignSelf:'center',
    },

    progress: {
        flex: 1,
        flexDirection: 'row',
        borderRadius: 3,
        overflow: 'hidden',
    },
    innerProgressCompleted: {
        height: 10,
        backgroundColor: 'red',
    },
    innerProgressRemaining: {
        height: 10,
        backgroundColor: '#cccccc',
    },

});