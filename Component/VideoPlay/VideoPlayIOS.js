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
    Image,
    ActivityIndicator,
} from 'react-native';

import Video from 'react-native-video';
import Orientation from 'react-native-orientation';

import Dimensions from 'Dimensions';

import request from '../Common/request';
import config from '../Common/config';
import Icon from 'react-native-vector-icons/Ionicons';

var {width,height} = Dimensions.get('window');
// Platform.OS === 'ios' ? <VideoPlayerIos/> : <VideoPlayerAndroid/>


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
            initVideo:false,

            realUrl:this.props.play_url

        }

        this._onLoadStart = this._onLoadStart.bind(this);
        this._onLoad = this._onLoad.bind(this);
        this._onProgress = this._onProgress.bind(this);
        this._onEnd = this._onEnd.bind(this);
        this._onError = this._onError.bind(this);
        this._rePlay = this._rePlay.bind(this);
        this._pause = this._pause.bind(this);
        this._resume = this._resume.bind(this);
        this._pop = this._pop.bind(this);

    }

    _pop(){
        let {navigator} = this.props;
        if(navigator){
            navigator.pop();
        }
    }

    _resume(){
        if(this.state.paused){
            this.setState({
                paused:false
            });
        }


    }

    _pause(){
        if(!this.state.paused){
            this.setState({
                paused:true
            });
        }
    }

    getCurrentTimePercentage() {
        if (this.state.currentTime > 0) {
            return parseFloat(this.state.currentTime) / parseFloat(this.state.duration);
        } else {
            return 0;
        }
    }

    _rePlay(){

        this.refs.videoPlayer.seek(0);

    }



    render() {
        if (!this.state.initVideo){
            return(
                <View style={styles.container}>
                    <View style={styles.blackStyle}/>
                </View>

            );
        }

        if (this.state.initVideo)
        {
            let rowData =  this.state.rowData;
            console.log('myurl ' +this.props.play_url);
            const flexCompleted = this.getCurrentTimePercentage() * 100;
            const flexRemaining = (1 - this.getCurrentTimePercentage()) * 100;

            return (

                <View style={styles.container}>



                    <View style={styles.videoBox}>

                        <Video
                            ref="videoPlayer"
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

                        {/*加载进度*/}
                        {!this.state.videoLoaded ?
                            <ActivityIndicator color="white" size="large"
                                               style={styles.loading} />
                            :null}


                        {/*重新播放*/}
                        {this.state.videoLoaded && !this.state.playing ?
                            <TouchableOpacity style={styles.btn} onPress={this._rePlay}>
                                <Image style={styles.imgStyle}   source={{uri:'icon_play'}}/>
                            </TouchableOpacity>
                            :null}

                        {/*暂停*/}
                        {this.state.videoLoaded && this.state.playing ?
                            <TouchableOpacity
                                onPress={this._pause}
                                style={styles.pauseArea}
                            >

                                {this.state.paused ?
                                    <TouchableOpacity style={styles.btn} onPress={this._resume} >
                                        <Image style={styles.imgStyle}   source={{uri:'icon_play'}} />
                                    </TouchableOpacity>
                                    :null}


                            </TouchableOpacity>
                            :null}


                        <View style={styles.header}>

                            <TouchableOpacity
                                style={styles.backBox}
                                onPress={this._pop}
                            >

                                <Icon name='ios-arrow-back'
                                      style={styles.backIcon}
                                />

                                <Text style={styles.backText}>返回</Text>

                            </TouchableOpacity>

                            <Text style={styles.headerTitle} numberOfLines={1}>视频详情页面</Text>

                        </View>






                        <View style={styles.progress}>
                            <View style={[styles.innerProgressCompleted, {flex: flexCompleted}]} />
                            <View style={[styles.innerProgressRemaining, {flex: flexRemaining}]} />
                        </View>


                    </View>

                </View>
            );


        }


    }



    loadDataFromNet(){

        console.log('视频解析前的地址' + this.props.play_url);
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
                    console.log('视频解析失败');
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

    componentWillMount() {
        //The getOrientation method is async. It happens sometimes that
        //you need the orientation at the moment the js starts running on device.
        //getInitialOrientation returns directly because its a constant set at the
        //beginning of the js code.
        var initial = Orientation.getInitialOrientation();
        if (initial === 'PORTRAIT') {
            //do stuff
        } else {
            //do other stuff
        }
    }

    _orientationDidChange(orientation) {
        if (orientation == 'LANDSCAPE') {


            //do something with landscape layout
            this.setState({
                initVideo:true
            });


        } else {
            //do something with portrait layout
        }
    }

    componentDidMount(){
        this.loadDataFromNet();
        Orientation.lockToLandscape();
        Orientation.addOrientationListener(this._orientationDidChange.bind(this));
    }

    componentWillUnmount(){
        Orientation.getOrientation((err,orientation)=> {
            Orientation.lockToPortrait();
        });
        Orientation.removeOrientationListener(this._orientationDidChange);
    }


    _onEnd(){
        console.log('_onEnd');

        this.setState({

                currentTime:this.state.duration,
                playing:false,

            }
        );
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
        width:height,
        height:width,
        backgroundColor:'black'
    },
    video:{
        width:height,
        height:width - 10,
        backgroundColor:'black'
    },

    blackStyle:{
        width:width,
        height:height,
        backgroundColor:'black',

    },

    loading:{
        position:'absolute',
        left:0,
        width:height,
        top:(width - 20)/2.0,
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

    btn: {
        justifyContent:'center',
        width: 30,
        height: 30,
        borderRadius: 15,
        position:'absolute',
        top:(width - 30)/2.0,
        left:(height - 30)/2 ,
    },
    imgStyle: {
        width: 30,
        height:30
    },

    pauseArea:{
        position:'absolute',
        top:0,
        left:0,
        width:height,
        height:width - 10,
    },

    header:{
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center',
        width:height,
        height:64,
        paddingLeft:10,
        paddingRight:10,
        position:'absolute',
        backgroundColor:'transparent',
    },

    backBox:{
        position:'absolute',
        left:12,
        top:20,
        width:60,
        flexDirection:'row',
        alignItems:'center',

    },

    backIcon:{
        color:'#999',
        fontSize:22,
        marginRight:5
    },

    backText:{
        color:'#999',
        fontSize:16,
    },



});