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
import ScrollableTabView from 'react-native-scrollable-tab-view';

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
                        let obj = JSON.parse(result[i][1]);
                        if (obj.hasOwnProperty(id)){
                            arr.push(result[i][1]);
                        }


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


