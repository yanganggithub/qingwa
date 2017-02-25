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
    ListView,
    TouchableOpacity
} from 'react-native';


import request from '../Common/request';
import config from '../Common/config';

import Dimensions from'Dimensions';
var {width,height} = Dimensions.get('window');


export default class VideoDetail extends Component{
    constructor(props){
        super(props);
        this.state = {
            headerDataDic:null,
            // cell的数据源
            dataSource: new ListView.DataSource({
                rowHasChanged: (r1, r2) => r1 !== r2
            })
        };

    }



    render() {
        return (
            <View style={styles.container}>

                {/*导航*/}
                {this.renderNavBar()}
                <ListView
                    style={styles.listStyle}
                    dataSource={this.state.dataSource}
                    renderRow={this.renderRow.bind(this)}
                    renderHeader={this.renderHeader.bind(this)}
                />
            </View>

        );
    }

    // 请求网络数据
    componentDidMount(){
        this.loadDataFromNet();
    }

    loadDataFromNet(){

        console.log(this.props.id);
        request.get(config.api.base + 'detail' + '/' + this.props.id,{


        }).then(
            (responseData)=>{
                console.log(responseData);
                var jsonData = responseData['data'];
                // 处理网络数据
                this.dealWithData(jsonData);
            }
        ).catch(
            (err) => {
                if (err){
                    console.log(err);
                }


            }
        )


    }


    dealWithData(jsonData) {
        this.setState(
            {
                headerDataDic:jsonData
            }

        );
    }
    // 单独的一个cell
    renderRow(rowData){
        return(
             <View></View>

        );
    }

    // 头部
    renderHeader(){
        // 判断

        if (!this.state.headerDataDic) return;

        return(
            <View style={styles.headViewStyle}>
                {/*左边*/}
                <Image source={{uri:this.state.headerDataDic.pic}} style={styles.imageViewStyle}/>
                {/*右边*/}

                <View style={styles.rightContentStyle}>

                    <View style={styles.contentStyle}>
                        <Text>{this.state.headerDataDic.keywords}</Text>

                    </View>
                    <View style={styles.contentStyle}>
                        <Text style={{color:'gray'}}>{this.state.headerDataDic.area}</Text>
                    </View>

                    <View style={styles.contentStyle}>
                        <Text style={{color:'gray'}}>{this.state.headerDataDic.year}</Text>
                    </View>

                    <View style={styles.contentStyle}>
                        <Text style={{color:'gray'}}>{this.state.headerDataDic.actor}</Text>
                    </View>


                </View>
            </View>

        );
    }

    // 导航条
    renderNavBar(){
        return(
            <View style={styles.navOutViewStyle}>
                <TouchableOpacity  style={styles.leftViewStyle}  onPress={()=>{
                    const { navigator } = this.props;
                    if(navigator) {
                        //很熟悉吧，入栈出栈~ 把当前的页面pop掉，这里就返回到了上一个页面:List了
                        navigator.pop();
                    }}}>
                    <Image source={{uri: 'nav_goback'}} style={styles.navImageStyle}/>
                </TouchableOpacity>
                <View style={styles.txtStyle}>
                    <Text style={{color:'white', fontSize:18, fontWeight:'bold'}}>咕噜影院</Text>
                </View>

                <TouchableOpacity onPress={()=>{alert('点了!')}} style={styles.rightViewStyle}>
                    <Image source={{uri: 'nav_share'}} style={styles.navImageStyle}/>
                </TouchableOpacity>
            </View>
        )
    }


}


const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:'rgba(255,255,255,1)'
    },
    headViewStyle:{
        backgroundColor:'rgba(0,0,0,0.6)',
        padding:14,
        flexDirection:'row'
    },
    imageViewStyle:{
        width:130,
        height:173
    },
    rightContentStyle:{
        marginLeft:14,
        width:width - 130 - 14 * 2 - 14,

    },
    contentStyle:{
        marginTop:3
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

    txtStyle:{
         marginTop:Platform.OS == 'ios' ? 30 : 10
    }


});


