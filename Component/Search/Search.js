/**
 * Created by yangang on 17/3/20.
 */
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
    TextInput,
    TouchableOpacity,
    Keyboard,
    ListView,
    AsyncStorage,
    Dimensions,
} from 'react-native';

import  SearchDetail from '../Search/SearchDetail.js'

var {width,height} = Dimensions.get('window');

export default class Search extends Component{
    constructor(props){
        super(props);

        this.state = {
            keyboardHeight:0,
            dataSource: new ListView.DataSource({
                rowHasChanged: (r1, r2) => r1 !== r2
            })
        };

    }

    render() {
        console.log("keyboradHeight:",this.state.keyboardHeight);
        return (
            <View style={styles.container}>
                {this.renderNavBar()}
                <ListView
                    dataSource={this.state.dataSource}
                    renderRow={this.renderRow.bind(this)}
                    style={{marginBottom:this.state.keyboardHeight}}
                />
            </View>
        );
    }

    renderRow(data){
        return (
            <TouchableOpacity activeOpacity={1} onPress={
                ()=> {
                    const {navigator} = this.props;
                    if (navigator) {
                        navigator.push({
                            name: '详情页面',
                            component: SearchDetail,
                            params: {text: data}
                        })
                    }
                }
            }


            >
                <View>
                    <Text>{data}</Text>
                 </View>
            </TouchableOpacity>
        );

    }

    componentDidMount() {
        let _that = this;
        AsyncStorage.getAllKeys(
            function (err, keys) {
                if (err) {
                    //TODO 存储数据出错
                    //return ;
                }
                //keys是字符串数组
                AsyncStorage.multiGet(keys, function (err, result) {
                    //得到的结构是二维数组
                    //result[i][0]表示我们存储的键   result[i][1]表示我们存储的值
                    console.log("result:",result);
                    let arr = [];
                    for (let i in result) {
                        arr.push(result[i][1]);
                    }

                    _that.setState(
                        {
                            dataSource :_that.state.dataSource.cloneWithRows(arr)
                        }
                    );


                });
            }
        );
    }

    componentWillUnmount() {
        this.keyboardDidShowListener.remove();
        this.keyboardDidHideListener.remove();
    }

    componentWillMount() {
        this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow.bind(this));
        this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide.bind(this));
    }

    _keyboardDidShow(e){
        this.setState({
            keyboardHeight:e.startCoordinates.height
        })

    }

    _keyboardDidHide(e){
        this.setState({
            keyboardHeight:0
        })
    }

    // 首页的导航条
    renderNavBar(){
        return(
            <View style={styles.navBarStyle}>
                {/*中间*/}
                <TextInput
                    clearButtonMode="while-editing"
                    autoFocus="true"
                    placeholder="请输入片名或演员"
                    placeholderTextColor='#cccccc'
                    returnKeyType = 'search'
                    style={styles.topInputStyle}
                    onSubmitEditing={(event)=>{
                                                    AsyncStorage.setItem('SP-' + this.genId() + '-SP', event.nativeEvent.text, function (err) {
                                                        if (err) {
                                                            alert(err);
                                                        } else {
                                                            alert('保存成功');
                                                        }
                                                    });

                                                    const { navigator } = this.props;

                                                    if (navigator) {
                                                        navigator.push({
                                                            name: '详情页面',
                                                            component: SearchDetail,
                                                            params:{text:event.nativeEvent.text}
                                                        })
                                                    }

                                                }
                                    }
                />
                {/*右边*/}

                <TouchableOpacity onPress={()=>{alert('点击了')}}>
                    <Text style={{color:'white',backgroundColor:'red'}}>取消</Text>
                </TouchableOpacity>

            </View>
        )
    }

    // 生成随机ID：GUID 全局唯一标识符（GUID，Globally Unique Identifier）是一种由算法生成的二进制长度为128位的数字标识符
    // GUID生成的代码来自于Stoyan Stefanov

    genId() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            let r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        }).toUpperCase();

    }


}


const styles = StyleSheet.create({
    container:{
        flex:1,
    },
    navBarStyle:{ // 导航条样式
        height: Platform.OS == 'ios' ? 64 : 44,
        backgroundColor:'rgba(17,17,17,1.0)',
        // 设置主轴的方向
        flexDirection:'row',
        // 垂直居中 ---> 设置侧轴的对齐方式
        alignItems:'center',
        // 设置主轴的对齐方式
        justifyContent:'space-around'
    },

    topInputStyle:{ // 设置输入框
        width:width * 0.81,
        height:Platform.OS == 'ios' ? 30 : 30,
        backgroundColor:'rgba(68,68,68,1.0)',
        color:'rgba(204,204,204,1.0)',
        marginTop: Platform.OS == 'ios' ? 22 : 0,

        // 设置圆角
        borderRadius:15,
        // 内左边距
        paddingLeft:10
    },
});