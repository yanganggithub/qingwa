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
    ListView,
    TouchableOpacity,
    Navigator,
    Platform,

} from 'react-native';




import AdHeader from '../Home/AdHeader';
import ContentListCell from '../Home/ContentListCell'
import Search from '../Search/Search'
import  LoaderActivity from '../Common/LoaderActivity';

import Dimensions from'Dimensions';
var {width,height} = Dimensions.get('window');


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
        <View style={styles.container}>
            <LoaderActivity ref={'loading'}/>
            {/*导航*/}
            {this.renderNavBar()}

            <ListView
                dataSource={this.state.dataSource}
                renderRow={this.renderRow.bind(this)}
                renderHeader={this.renderHeader.bind(this)}
            />
        </View>

        );
    }





    // 请求网络数据
    componentDidMount(){
        this.refs['loading'].show();
        this.loadDataFromNet();
    }

    loadDataFromNet(){
        console.log('loadDataFromNet');
        fetch('http://api.fffml.com/sites')
            .then((response)=>response.json())
            .then((responseData)=>{
                // 拿到所有的数据
                this.refs['loading'].dismiss();
                var jsonData = responseData['data'];
                // 处理网络数据
                this.dealWithData(jsonData);
                this.setState({
                    visible: !this.state.visible
                });
            })
            .catch((error)=>{
                console.log(error);
                this.refs['loading'].dismiss();
                this.setState({
                    visible: !this.state.visible
                });
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
            animating:false,
            headerDataArr: headerArr,
            // cell的数据源
            dataSource: this.state.dataSource.cloneWithRows(listDataArr)
        });

        // console.log(headerArr, listDataArr);
    }

    // 单独的一个cell
    renderRow(rowData){
        return(
            <View >
               <View style={styles.topStyle}></View>
               <ContentListCell dataArr={rowData} navigator={this.props.navigator}></ContentListCell>
            </View>
        );
    }

    // 头部
    renderHeader(){
        // 判断
        if (this.state.headerDataArr.length == 0) return;

        return(
            <AdHeader
                navigator={this.props.navigator}
                imageDataArr = {this.state.headerDataArr}
            />
        );
    }

    // 导航条
    renderNavBar(){
        return(
            <View style={styles.navOutViewStyle}>
                <TouchableOpacity  style={styles.leftViewStyle} onPress={
                    ()=>{
                        const { navigator } = this.props;

                        if (navigator) {
                            navigator.push({
                                name: '详情页面',
                                component: Search,
                                params:null
                            })
                        }
                    }
                }>
                    <Image source={{uri: 'nav_search'}} style={styles.navImageStyle}/>
                </TouchableOpacity>
                <View style={styles.txtStyle}>
                    <Text style={{color:'white', fontSize:18, fontWeight:'bold'}}>咕噜影院</Text>
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

    iconStyle:{
        width: Platform.OS === 'ios' ? 30 : 25,
        height:Platform.OS === 'ios' ? 30 : 25
    },

    selectedTitleStyle:{
        color:'orange'
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

    },
    topStyle:{
        height:10,
        backgroundColor:'rgba(237,237,237,1.0)'
    },


});


