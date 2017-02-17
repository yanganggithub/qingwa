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
    ListView
} from 'react-native';

import Dimensions from'Dimensions';
var {width} = Dimensions.get('window');


var cols = 3;
var space = 8;
var imgW = (width - (cols + 1) * space)/cols;
var imgH =  (152.0/114.0 )*imgW;
var cellW = imgW;
var cellH = imgH + 44;



export default class ContentLIstCell extends Component{


    constructor(props){
        super(props);
        console.log(this.props.dataArr);
        var ds = new ListView.DataSource({rowHasChanged:(row1, row2) => row1 !== row2});
       this.state = {dataSource:ds.cloneWithRows(this.props.dataArr)};
    }

    render(){


       return(
         <ListView
                dataSource={this.state.dataSource}
                renderRow={this.renderRow.bind(this)}
                renderHeader={this.renderHeader.bind(this)}
                contentContainerStyle={styles.contentViewStyle}
                scrollEnabled={false}
            />
       );
    }

   // 具体的cell
    renderRow(rowdata){
        return(

            <View style={styles.cellStyle}>
                <Image source={{uri: rowdata.pic}} style={{width:imgW, height:imgH}}/>
                <View style={styles.titleStyle}>
                    <Text >{rowdata.title}</Text>
                </View>
                <View style={styles.bottomViewStyle}>
                    <Text style={{fontSize:13}}>{rowdata.name}</Text>
                </View>



            </View>

        );
    }
        // 头部
    renderHeader(){
       
       return (
           <View  style={styles.headerStyle}>
                <Text>热播电影</Text>
           </View>
       );
    }
};


const styles = StyleSheet.create({
  container:{
      // marginTop:25

  },

    contentViewStyle:{
        // 设置主轴的方向
        flexDirection:'row',
        // 多个cell在同一行显示
        flexWrap:'wrap',
        // 宽度
        width:width,
        alignItems:'flex-start'

    },

    titleStyle:{
        width:imgW,
        height:20,
        backgroundColor:'rgba(0,0,0,0.6)',
        justifyContent:'center',
        alignItems:'center',
        // 定位
        position:'absolute',
        bottom:44,

    },
    cellStyle:{

        width:cellW,
        height:cellH,
        // 水平居中和垂直居中
        justifyContent:'center',
        alignItems:'center',
        marginLeft:space
    },
    headerStyle:{
        marginLeft:12,
        width:width,
        height:44,
        justifyContent:'center'
    },
     bottomViewStyle:{
        height:44,
        justifyContent:'center',
        alignItems:'center',

    }


  
});
  




