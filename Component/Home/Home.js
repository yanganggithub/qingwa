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
    ListView,
    TouchableOpacity,
    Navigator
} from 'react-native';




import AdHeader from '../Home/AdHeader';
import ContentListCell from '../Home/ContentListCell'


export default class Home extends Component{
    constructor(props){

        super(props);


        this.state = {
             headerDataArr: [],

            // cell的数据源
            dataSource: new ListView.DataSource({
                rowHasChanged: (r1, r2) => r1 !== r2
            })
        };
     
    }

    render() {

        return (
            <ListView
                dataSource={this.state.dataSource}
                renderRow={this.renderRow.bind(this)}
                renderHeader={this.renderHeader.bind(this)}
            />

        );
    }

    // 请求网络数据
    componentDidMount(){
        this.loadDataFromNet();
    }

    loadDataFromNet(){
        console.log('loadDataFromNet');
        fetch('http://api.fffml.com/sites')
            .then((response)=>response.json())
            .then((responseData)=>{
                // 拿到所有的数据
                var jsonData = responseData['data'];
                // 处理网络数据
                this.dealWithData(jsonData);
            })
            .catch((error)=>{
                console.log(error);
            })

    }

    // 处理网络数据
    dealWithData(jsonData){
        // 定义临时变量
        var headerArr = [], listDataArr = [];
        // 遍历拿到的json数据
        headerArr = jsonData['slide_list'];
        listDataArr.push(jsonData['move_list']);
        listDataArr.push(jsonData['tv_list']);
        listDataArr.push(jsonData['comic_list']);
        listDataArr.push(jsonData['arts_list']);

        // 更新状态机
        this.setState({
            // ListView头部的数据源
            headerDataArr: headerArr,
            // cell的数据源
            dataSource: this.state.dataSource.cloneWithRows(listDataArr)
        });

        // console.log(headerArr, listDataArr);
    }

    // 单独的一个cell
    renderRow(rowData){
        return(
            <TouchableOpacity activeOpacity={0.5}>
               <ContentListCell dataArr={rowData}></ContentListCell>
            </TouchableOpacity>
        );
    }

    // 头部
    renderHeader(){
        // 判断
        if (this.state.headerDataArr.length == 0) return;

        return(
            <AdHeader
                imageDataArr = {this.state.headerDataArr}
            />
        );
    }




}


const styles = StyleSheet.create({
    iconStyle:{
        width: Platform.OS === 'ios' ? 30 : 25,
        height:Platform.OS === 'ios' ? 30 : 25
    },

    selectedTitleStyle:{
        color:'orange'
    }
});


