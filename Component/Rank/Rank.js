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
    ListView,
    ActivityIndicator,
    RefreshControl,
} from 'react-native';

import Dimensions from'Dimensions';
import request from '../Common/request';
import config from '../Common/config';
import VideoDetail from '../VideoDetail/VideoDetail';

var {width,height} = Dimensions.get('window');
import ScrollableTabView from 'react-native-scrollable-tab-view';
import {PullList} from 'react-native-pull';





export default class Rank extends Component{
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
                    <VideoList tabLabel="电影"  type="1" navigator={this.props.navigator}/>
                    <VideoList tabLabel="电视剧" type="2" navigator={this.props.navigator}/>
                    <VideoList tabLabel="综艺" type="3" navigator={this.props.navigator}/>
                    <VideoList tabLabel="动漫" type="4" navigator={this.props.navigator}/>

                   
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



class VideoList extends Component {

  

    static defaultProps ={
        api_url:'http://api.fffml.com/top'
    };

    constructor(props){
        super(props);

        this.cachedResults = {
            nextPage:1,
            items:[],
            total:0,
        }



        this.state = {
            // cell的数据源
            dataSource: new ListView.DataSource({
                rowHasChanged: (r1, r2) => r1 !== r2
            }),
            isLoading:false,
            isRefreshing:false
        };
    }

    render() {
        return(
            <ListView
                dataSource={this.state.dataSource}
                renderRow={this.renderRow.bind(this)}
                onEndReached={this.loadMoreData}
                onEndReachedThreshold={20}
                renderFooter={this.renderFooter}
                refreshControl={
                    <RefreshControl
                        refreshing={this.state.isRefreshing}
                        onRefresh={this.onRefresh}

                    />
                }
            />




        );
    }

    //下拉刷新的回调   从服务器获取最新的数据
    onRefresh=()=>{

        if( this.state.isRefreshing) {
            return
        }

        this.setState({
            isRefreshing:true
        });
        this.loadDataFromNet(1);



    }

    renderFooter=()=>{
        if(!this.hasMore()  && this.cachedResults.total!== 0 ){
            return (<View style={styles.loadingMore}>
                <Text style={styles.loadingText}>没有更多数据啦...</Text>
            </View>);
        }

        if(!this.state.isLoading){
            return <View style={styles.loadingMore}/>
        }

        return (

            <ActivityIndicator
                style={styles.loadingMore}
            />

        );
    }

    //加载更多的数据 上拉加载更多  滑动分页
    loadMoreData=()=>{

        if(!this.hasMore() || this.state.isLoading){
            return
        }

        //去服务器请求加载更多的数据了
        this.cachedResults.nextPage++;
        this.setState({
            isLoading:true
        });

        let page=  this.cachedResults.nextPage;

        this.loadDataFromNet(page);

    }

    hasMore(){
        return this.cachedResults.items.length !== this.cachedResults.total
    }

    // 请求网络数据
    componentDidMount(){
        console.log(this.props.type);
        this.loadDataFromNet(1);
    }

    loadDataFromNet(page){

        console.log(config.api.base + 'top');
        request.post(config.api.base + 'top',{
            type:this.props.type,
            page:page
        }).then(
            (responseData)=>{
                var jsonData = responseData['data'];
                // 处理网络数据
               this.dealWithData(jsonData,page);
            }
        ).catch(
            (err) => {
                console.log(err);
                this.cachedResults.nextPage--;
            }
        )


    }

    // 处理网络数据
    dealWithData(jsonData,page){

        if (page == 1){
            this.cachedResults.items.splice(0,this.cachedResults.items.length);
        }
       let items = this.cachedResults.items.slice();
       items = this.cachedResults.items.concat(jsonData['top_list']);
       this.cachedResults.items = items;
        this.cachedResults.total = jsonData['count'];
        console.log('itemsCount=',this.cachedResults.items.length);
        // 更新状态机
        this.setState({
            isLoading:false,
            // cell的数据源
            dataSource: this.state.dataSource.cloneWithRows(this.cachedResults.items),
            isRefreshing:false
        });

        // console.log(headerArr, listDataArr);
    }

    renderRow(rowData){
        return(
            <TouchableOpacity onPress={()=>{
                const { navigator } = this.props;

                if (navigator) {
                    navigator.push({
                        name: '详情页面',
                        component: VideoDetail,
                        params:rowData
                    })
                }
            } }>
                <View style={styles.listViewStyle}>
                    {/*左边*/}
                    <Image source={{uri:rowData.pic}} style={styles.imageViewStyle}/>
                    {/*右边*/}

                    <View style={styles.rightContentStyle}>

                        <View style={styles.rightTopViewStyle}>
                            <Text>{rowData.title}</Text>

                        </View>
                        <View style={styles.areaStyle}>
                            <Text style={{color:'gray'}}>{rowData.area}</Text>
                        </View>

                        <Text style={{color:'gray'}}>{rowData.actor}</Text>

                    </View>
                </View>
            </TouchableOpacity>
        )
    }
}


 class PullTest extends Component {

    constructor(props) {
        super(props);
        this.dataSource = [{
            id: 0,
            title: `this is the first.`,
        }];
        this.state = {

            list: (new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})).cloneWithRows(this.dataSource),
        };
        this.renderHeader = this.renderHeader.bind(this);
        this.renderRow = this.renderRow.bind(this);
        this.renderFooter = this.renderFooter.bind(this);
        this.loadMore = this.loadMore.bind(this);
        this.topIndicatorRender = this.topIndicatorRender.bind(this);
        // this.loadMore();
    }

    onPullRelease(resolve) {
        //do something
        setTimeout(() => {
            resolve();
        }, 3000);
    }

    topIndicatorRender(pulling, pullok, pullrelease) {
        const hide = {position: 'absolute', left: -10000};
        const show = {position: 'relative', left: 0};
        if (pulling) {
            this.txtPulling && this.txtPulling.setNativeProps({style: show});
            this.txtPullok && this.txtPullok.setNativeProps({style: hide});
            this.txtPullrelease && this.txtPullrelease.setNativeProps({style: hide});
        } else if (pullok) {
            this.txtPulling && this.txtPulling.setNativeProps({style: hide});
            this.txtPullok && this.txtPullok.setNativeProps({style: show});
            this.txtPullrelease && this.txtPullrelease.setNativeProps({style: hide});
        } else if (pullrelease) {
            this.txtPulling && this.txtPulling.setNativeProps({style: hide});
            this.txtPullok && this.txtPullok.setNativeProps({style: hide});
            this.txtPullrelease && this.txtPullrelease.setNativeProps({style: show});
        }
        return (
            <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center', height: 60}}>
                <ActivityIndicator size="small" color="gray" />
                <Text ref={(c) => {this.txtPulling = c;}}>当前PullList状态: pulling...</Text>
                <Text ref={(c) => {this.txtPullok = c;}}>当前PullList状态: pullok......</Text>
                <Text ref={(c) => {this.txtPullrelease = c;}}>当前PullList状态: pullrelease......</Text>
            </View>
        );
    }

    render() {
        return (

                <PullList
                    style={{}}
                    onPullRelease={this.onPullRelease} topIndicatorRender={this.topIndicatorRender} topIndicatorHeight={60}
                    renderHeader={this.renderHeader}
                    dataSource={this.state.list}
                    pageSize={5}
                    initialListSize={5}
                    renderRow={this.renderRow}
                    onEndReached={this.loadMore}
                    onEndReachedThreshold={30}
                    renderFooter={this.renderFooter}
                />

        );
    }

    renderHeader() {
        return (
            <View style={{height: 50, backgroundColor: '#eeeeee', alignItems: 'center', justifyContent: 'center'}}>
                <Text style={{fontWeight: 'bold'}}>This is header</Text>
            </View>
        );
    }

    renderRow(item, sectionID, rowID, highlightRow) {
        return (
            <View style={{height: 50, backgroundColor: '#fafafa', alignItems: 'center', justifyContent: 'center'}}>
                <Text>{item.title}</Text>
            </View>
        );
    }

    renderFooter() {
        if(this.state.nomore) {
            return null;
        }
        return (
            <View style={{height: 50}}>
                <ActivityIndicator />
            </View>
        );
    }

    loadMore() {
        this.dataSource.push({
            id: 0,
            title: `begin to create data ...`,
        });
        for(var i = 0; i < 5; i++) {
            this.dataSource.push({
                id: i + 1,
                title: `this is ${i}`,
            })
        }
        this.dataSource.push({
            id: 6,
            title: `finish create data ...`,
        });
        setTimeout(() => {
            this.setState({
                list: this.state.list.cloneWithRows(this.dataSource)
            });
        }, 1000);
    }

}



const styles = StyleSheet.create({

    loadingMore:{

        marginVertical:10
    },

    container: {
        flex: 1,
    },

    lineStyle:{
      backgroundColor:'#00ae54'
    },

    txtStyle:{
        marginTop:30

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

    listViewStyle:{
        backgroundColor:'white',
        padding:14,
        borderBottomColor:'#e5e5e5',
        borderBottomWidth:0.5,

        flexDirection:'row'
    },

    imageViewStyle:{
        width:80,
        height:106
    },

    rightContentStyle:{
        marginLeft:13,
        width:width - 80 - 14 * 2 - 13,

    },

    rightTopViewStyle:{
        marginTop:3
    },
    areaStyle:{
        marginTop:7,
        marginBottom:2
    },
    loadingText:{
        fontSize:13,
        color:'gray',
        textAlign:'center'
    },

});





