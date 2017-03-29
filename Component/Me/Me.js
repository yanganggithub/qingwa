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
    TouchableOpacity,
    AsyncStorage,
    ListView,
} from 'react-native';
import Dimensions from'Dimensions';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import VideoDetail from '../VideoDetail/VideoDetail';
var {width} = Dimensions.get('window');

var cols = 3;
var space = 8;
var imgW = (width - (cols + 1) * space)/cols;
var imgH =  (152.0/114.0 )*imgW;
var cellW = imgW;
var cellH = imgH + 44;

export default class Me extends Component{
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
                    <WatchList tabLabel="观看记录"  type="1" navigator={this.props.navigator}/>
                    <FavouriteList tabLabel="我的收藏" type="2" navigator={this.props.navigator}/>

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

class WatchList extends Component {

    constructor(props) {
        super(props);

        this.state = {
            // cell的数据源
            dataSource: new ListView.DataSource({
                rowHasChanged: (r1, r2) => r1 !== r2
            }),
        };
    }

    render(){
        return(
            <ListView
                dataSource={this.state.dataSource}
                renderRow={this.renderRow.bind(this)}
            />
        );

    }

    renderRow(data) {
        return <View><Text>hello</Text></View>
    }
}

class FavouriteList extends Component {

    constructor(props) {
        super(props);

        this.state = {
            // cell的数据源
            dataSource: new ListView.DataSource({
                rowHasChanged: (r1, r2) => r1 !== r2
            })
        };
    }

    render(){
        return(
            <ListView
                dataSource={this.state.dataSource}
                renderRow={this.renderRow.bind(this)}
                contentContainerStyle={styles.contentViewStyle}
            />
        );

    }

    // 具体的cell
    renderRow(rowdata){
        console.log('rowdata:',rowdata);
        return(
            <TouchableOpacity activeOpacity={1} onPress={()=>{
                const { navigator } = this.props;

                if (navigator) {
                    navigator.push({
                        name: '详情页面',
                        component: VideoDetail,
                        params:rowdata
                    })
                }
            } }>
                <View style={styles.cellStyle}>
                    <Image source={{uri: rowdata.pic}} style={{width:imgW, height:imgH}}/>
                    <View style={styles.titleStyle}>
                        <Text style={{fontSize:12,color:'#ffffff'}}>{rowdata.title+' '}</Text>
                    </View>
                    <View style={styles.bottomViewStyle}>
                        <Text style={{fontSize:13,textAlign: 'center',color:'#262626'}}>{rowdata.name}</Text>
                    </View>

                </View>
            </TouchableOpacity>

        );
    }

    componentDidMount() {
        AsyncStorage.getItem('FAVOURITE',(error,historyString)=> {
            if (historyString) {
                console.log('history:',historyString);
               this.setState({
                   dataSource :this.state.dataSource.cloneWithRows(JSON.parse(historyString))
               });
            }
        });

    }
}
const styles = StyleSheet.create({
    container:{
        flex:1,
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
    contentViewStyle:{
        // 设置主轴的方向
        flexDirection:'row',
        // 多个cell在同一行显示
        flexWrap:'wrap',
        // 宽度
        width:width,
        alignItems:'flex-start'
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


