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
    Modal,
    TouchableOpacity,
    ScrollView,
    PixelRatio
} from 'react-native';


import request from '../Common/request';
import config from '../Common/config';
import VideoHeader from '../VideoDetail/VideoHeader'
import VideoFooter from '../VideoDetail/VideoFooter'
import VideoPlayIOS from '../VideoPlay/VideoPlayIOS'

import ScrollableTabView from 'react-native-scrollable-tab-view';
import Dimensions from'Dimensions';
var {width,height} = Dimensions.get('window');
var headerHeight;

export default class VideoDetail extends Component{
    constructor(props){
        super(props);
        this.state = {
            scrollVar:true,
            headerDataDic:null,
            footerDataDic:null,
            animationType: 'slide',//none slide fade
            modalVisible: false,//模态场景是否可见
            transparent: true,//是否透明显示
            dataSource: new ListView.DataSource({
                rowHasChanged: (r1, r2) => r1 !== r2
            })
        };
        

    }



    render() {

        const detailView =  Platform.OS == 'ios' ? (<ListView
            ref="listView"
            style={styles.listStyle}
            dataSource={this.state.dataSource}
            bounces={false}
            renderRow={this.renderRow.bind(this)}
            renderHeader={this.renderHeader.bind(this)}
            onScrollEndDrag={(e)=>this.scrollEnd(e)}
        />) :
            (<ScrollView     ref="scrollView" onScroll={(e)=>this.onScroll(e)} onContentSizeChange={(contentWidth,contentHeight)=>this.onContentSize(contentWidth,contentHeight)} scrollEnabled={this.state.scrollVar}>

                <VideoHeader  headerDataDic={this.state.headerDataDic}
                              onLayout={(event) => {

                                  let viewHeight = event.nativeEvent.layout.height;

                                  if (!viewHeight || headerHeight === viewHeight) {
                                      return;
                                  }
                                  headerHeight = viewHeight;
                                  console.log('onLayout');
                                  console.log('onLayout:headerHeight=',headerHeight);

                              }}
                >

                </VideoHeader>

                <VideoFooter  footerDataDic={this.state.footerDataDic}  style={styles.footerStyle1}>

                </VideoFooter>


            </ScrollView>)



            let modalBackgroundStyle = {
            backgroundColor: this.state.transparent ? 'rgba(0, 0, 0, 0.5)' : 'red',
        };

        let innerContainerTransparentStyle = this.state.transparent
            ? { backgroundColor: '#fff', padding: 20 }
            : null;

        return (

            <View style={styles.container}>

                {/*导航*/}
                {this.renderNavBar()}

                <Modal
                    animationType={this.state.animationType}
                    transparent={this.state.transparent}
                    visible={this.state.modalVisible}
                    onRequestClose={() => { this.setModalVisible(false) } }
                    onShow={this.startShow}
                >
                    <View style={[{
                        flex: 1,
                        justifyContent: 'center',
                        padding: 40,
                    }, modalBackgroundStyle]}>
                        <View style={[styles.innerContainer, innerContainerTransparentStyle]}>
                            <Text style={styles.date}>2016-08-11</Text>
                            <View style={styles.row}>
                                <View >
                                    <Text style={styles.station}>长沙站</Text>
                                    <Text style={styles.mp10}>8: 00出发</Text>
                                </View>
                                <View>
                                    <View style={styles.at}></View>
                                    <Text style={[styles.mp10, { textAlign: 'center' }]}>G888</Text>
                                </View>
                                <View >
                                    <Text style={[styles.station, { textAlign: 'right' }]}>北京站</Text>
                                    <Text style={[styles.mp10, { textAlign: 'right' }]}>18: 00抵达</Text>
                                </View>
                            </View>
                            <View style={styles.mp10}>
                                <Text>票价：￥600.00元</Text>
                                <Text>乘车人：东方耀</Text>
                                <Text>长沙站 火车南站 网售</Text>
                            </View>
                            <View style={[styles.mp10, styles.btn, { alignItems: 'center' }]}>
                                <Text style={styles.btn_text}>去支付</Text>
                            </View>
                            <Text
                                onPress={this.setModalVisible.bind(this,false) }
                                style={{fontSize:20,marginTop:10}}>
                                关闭
                            </Text>
                        </View>
                    </View>
                </Modal>

                {detailView}


                {/*<ListView*/}
                    {/*ref="listView"*/}
                    {/*style={styles.listStyle}*/}
                    {/*dataSource={this.state.dataSource}*/}
                    {/*bounces={false}*/}
                    {/*renderRow={this.renderRow.bind(this)}*/}
                    {/*renderHeader={this.renderHeader.bind(this)}*/}
                    {/*onScrollEndDrag={(e)=>this.scrollEnd(e)}*/}
                {/*/>*/}



                {/*<ScrollView>*/}

                    {/*<VideoHeader  headerDataDic={this.state.headerDataDic}>*/}

                    {/*</VideoHeader>*/}

                    {/*<VideoFooter style={styles.rowStyle} footerDataDic={this.state.footerDataDic}>*/}

                    {/*</VideoFooter>*/}


                {/*</ScrollView>*/}
            </View>

        );
    }
    onScroll(e){

        var offSetY = e.nativeEvent.contentOffset.y;
        console.log('offSetY=', offSetY);
        console.log('headerHeight=', headerHeight);
        if (offSetY > headerHeight){
            console.log('更改了状态');
       
        }

    }

    onContentSize(contentWidth,contentHeight){
        console.log('contentHeight=', contentHeight);
    }

    scrollEnd(e){

        var offset =  e.nativeEvent.contentOffset.y;
        console.log("offset=",offset);
        if (offset>=134){
            console.log("可以滑动了");
            console.log(this.similar);
            this.similar.makeScroll();
        }
    }

    startShow=()=>{

    }

    renderHeader(){
        if (!this.state.headerDataDic) return <View></View>;
        console.log('返回视图');
        return(
            <View style={styles.headViewStyle}>
                {/*左边*/}
                <Image source={{uri:this.state.headerDataDic.pic}} style={styles.imageViewStyle}/>
                {/*右边*/}

                <View style={styles.rightContentStyle}>


                    <View style={styles.contentStyle}>
                        <Text style={{color:'white',fontSize:12}}>类型: {this.state.headerDataDic.keywords}</Text>

                    </View>
                    <View style={styles.contentStyle}>
                        <Text style={{color:'white',fontSize:12}}>地区: {this.state.headerDataDic.area}</Text>
                    </View>

                    <View style={styles.contentStyle}>
                        <Text style={{color:'white',fontSize:12}}>年份: {this.state.headerDataDic.year}</Text>
                    </View>

                    <View style={styles.contentStyle}>
                        <Text style={{color:'white',fontSize:12}}  onPress={this.originAction.bind(this,true)}>来源: {this.state.headerDataDic.vod_url_list[0].origin.name}</Text>
                    </View>

                    <View style={styles.btn}>
                        <Text style={styles.btn_text}  onPress={()=>{
                            const { navigator } = this.props;

                            if (navigator) {
                                navigator.push({
                                    name: '详情页面',
                                    component: VideoPlayIOS,
                                    params:this.state.headerDataDic.vod_url_list[0].list[0]
                                })
                            }
                        } }>播放</Text>
                    </View>

                </View>
            </View>

        );
    }

    originAction(visible){
        this.setState({ modalVisible: visible });

    }

    setModalVisible = (visible) => {
        this.setState({ modalVisible: visible });
    }


    renderRow(rowData){
        let rowStyle =  Platform.OS == 'ios' ? { width:width, height:height - 64}:null ;
        return(

            <View style={rowStyle}>
                <ScrollableTabView
                    tabBarUnderlineColor='#FF0000'
                    tabBarUnderlineStyle={styles.lineStyle}
                    tabBarActiveTextColor='#00ae54'
                    tabBarInactiveTextColor='#262626'
                    tabBarTextStyle={{fontSize: 14}}
                >

                    <SimilarList  tabLabel="类似"  ref={(similar)=>{this.similar = similar} }data={rowData['near_list']} navigator={this.props.navigator} />
                    <CommentList tabLabel="影评"  data={rowData['comment_list']} navigator={this.props.navigator}/>
                    <BriefList tabLabel="简介" data={rowData['content']} navigator={this.props.navigator}/>

                </ScrollableTabView>
            </View>
        )
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

                // 处理网络数据
                this.dealWithData(responseData);
            }
        ).catch(
            (err) => {
                if (err){
                    console.log(err);
                }
            }
        )
    }


    dealWithData(responseData) {
        var jsonData = responseData['data'];
        var listDataArr = [];
        listDataArr.push(jsonData);

        this.setState(
            {
                footerDataDic:jsonData,
                headerDataDic:jsonData,
                dataSource :this.state.dataSource.cloneWithRows(listDataArr)

            }

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

class SimilarList extends Component {
    constructor(props) {
        super(props);
        var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.state = {
            scrollVar:false,
            // cell的数据源
            dataSource: ds.cloneWithRows(this.props.data)

        }
        this.renderSimilarRow= this.renderSimilarRow.bind(this);

    }

    makeScroll(){
        this.setState({
            scrollVar:true
        });
    }

    unEnabledScroll(){
        this.setState({
            scrollVar:false
        });
    }

    render(){
        return(
            <ListView
                ref="listView"
                dataSource={this.state.dataSource}
                renderRow={this.renderSimilarRow}
                onScrollEndDrag={(e)=>this.scrollEnd(e)}
                    scrollEnabled={this.state.scrollVar}
            />
        )
    }

    scrollEnd(e){

        var offset =  e.nativeEvent.contentOffset.y;

        if (offset<=0){


           this.unEnabledScroll();
        }else {
            this.makeScroll();
        }

    }

    renderSimilarRow(rowData){

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

class CommentList extends Component {
    constructor(props) {
        super(props);

    }

    render(){
        return(
            <View>
                <Text>评论</Text>
            </View>
        )
    }
}

class BriefList extends Component {
    constructor(props) {
        super(props);

    }

    render() {
        return (
            <View>
                <Text>简介</Text>
            </View>
        )
    }

}


const styles = StyleSheet.create({


    container:{
        flex:1,
        backgroundColor:'rgba(255,255,255,1)'
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
    lineStyle:{
        backgroundColor:'#00ae54'
    },
    cellStyle:{
        width:width,
        height:height -  Platform.OS == 'ios' ? 64 : 44
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


    innerContainer: {
        borderRadius: 10,
        alignItems: 'center',
    },
    row: {
        alignItems: 'center',

        flex: 1,
        flexDirection: 'row',
        marginBottom: 20,
    },
    rowTitle: {
        flex: 1,
        fontWeight: 'bold',
    },
    button: {
        borderRadius: 5,
        flex: 1,
        height: 44,
        alignSelf: 'stretch',
        justifyContent: 'center',
        overflow: 'hidden',
    },
    buttonText: {
        fontSize: 18,
        margin: 5,
        textAlign: 'center',
    },

    page: {
        flex: 1,
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        top: 0,
    },
    zhifu: {
        height: 150,
    },

    flex: {
        flex: 1,
    },
    at: {
        borderWidth: 1 / PixelRatio.get(),
        width: 80,
        marginLeft:10,
        marginRight:10,
        borderColor: '#18B7FF',
        height: 1,
        marginTop: 10

    },
    date: {
        textAlign: 'center',
        marginBottom: 5
    },
    station: {
        fontSize: 20
    },
    mp10: {
        marginTop: 5,
    },
    btn: {
        justifyContent:'center',
        marginTop:5,
        width: 100,
        height: 40,
        borderRadius: 3,
        backgroundColor: '#00ae54',
    },
    btn_text: {
        lineHeight: 18,
        textAlign: 'center',
        color: '#fff',
    },

    footerStyle:
    {
        width:width,
        height:height - 64 -64
    },



});


