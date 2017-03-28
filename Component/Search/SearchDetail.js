/**
 * Created by yangang on 17/3/22.
 */
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
    ActivityIndicator,
    Dimensions,
    TouchableOpacity,
} from 'react-native';
import request from '../Common/request';
import config from '../Common/config';
import VideoDetail from '../VideoDetail/VideoDetail';
var {width} = Dimensions.get('window');

var cols = 3;
var space = 8;
var imgW = (width - (cols + 1) * space)/cols;
var imgH =  (152.0/114.0 )*imgW;
var cellW = imgW;
var cellH = imgH + 44;


export default class SearchDetail extends Component{
    constructor(props){
        super(props);
        this.cachedResults = {
            nextPage:1,
            items:[],
            total:0,
        }

        this.state= {
                isLoading:false,
                dataSource: new ListView.DataSource({rowHasChanged: (row1, row2) => row1 !== row2})
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
                contentContainerStyle={styles.contentViewStyle}
                scrollEnabled={false}
            />
        );
    }


    // 具体的cell
    renderRow(rowdata){
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

        request.post(config.api.base + 'search',{
            keywords:this.props.text,
            page:page
        }).then(
            (responseData)=>{
                console.log("searchData:",responseData);
                var jsonData = responseData['data'];


                // 处理网络数据
                this.dealWithData(jsonData,page);
            }
        ).catch(
            (err) => {
                console.log(err);
                if (err){
                    this.cachedResults.nextPage--;
                    this.setState({
                        // cell的数据源
                        isLoading: false,
                    });
                }


            }
        )
    }

    dealWithData(jsonData,page){

        if (page == 1){
            this.cachedResults.items.splice(0,this.cachedResults.items.length);
        }
        let items = this.cachedResults.items.slice();
        items = this.cachedResults.items.concat(jsonData['search_list']);
        this.cachedResults.items = items;
        this.cachedResults.total = jsonData['search_count'];
        console.log('itemsCount=',this.cachedResults.items.length);
        // 更新状态机
        this.setState({
            // cell的数据源
            isLoading:false,
            dataSource: this.state.dataSource.cloneWithRows(this.cachedResults.items)
        });
    }



}

const styles = StyleSheet.create({
    contentViewStyle:{
        // 设置主轴的方向
        flexDirection:'row',
        // 多个cell在同一行显示
        flexWrap:'wrap',
        // 宽度
        width:width,
        alignItems:'flex-start'

    },
    loadingMore:{

        marginVertical:10
    },

    titleStyle:{
        width:imgW,
        height:20,
        backgroundColor:'rgba(0,0,0,0.6)',
        justifyContent:'center',
        alignItems:'flex-end',
        // 定位
        position:'absolute',
        bottom:44

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