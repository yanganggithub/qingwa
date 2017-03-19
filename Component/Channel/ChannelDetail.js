/**
 * Created by yangang on 17/3/14.
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
    ScrollView,
    TouchableOpacity,
    ListView,
    Dimensions,
    ActivityIndicator,
} from 'react-native';

var {width} = Dimensions.get('window');
import request from '../Common/request';
import config from '../Common/config';
import VideoDetail from '../VideoDetail/VideoDetail'

var cols = 3;
var space = 8;
var imgW = (width - (cols + 1) * space)/cols;
var imgH =  (152.0/114.0 )*imgW;
var cellW = imgW;
var cellH = imgH + 44;

export default class ChannelDetail extends Component{
    constructor(props){
        super(props);

        this.cachedResults = {
            nextPage:1,
            items:[],
            total:0,
        }

        this.state = {
            pid:this.props.pid,
            cateData:null,
            areData:null,
            yearData:null,
            cateid:this.props.id,
            areid:null,
            yearid:null,
            isLoading:false,
            // cell的数据源
            dataSource: new ListView.DataSource({
                rowHasChanged: (r1, r2) => r1 !== r2
            })

        };
        this.renderRow = this.renderRow.bind(this);
        this.renderFooter = this.renderFooter.bind(this);

    }



    render() {
        let cateList = [];
        let areaList = [];
        let yearList = [];
        console.log('促发render方法');
        if (this.state.cateData) {
            console.log("cateData:",this.state.cateData);
            // for (let i = 0; i < this.state.cateData.length; i++) {
            //     let itemData = this.state.cateData[i];
            //     let selectedVar = false;
            //     if (this.state.cateid == this.state.cateData[i].id){
            //         selectedVar = true;
            //     }
            //     console.log('selectedVar:',selectedVar);
            //     cateList.push(
            //         <Item name={itemData.name} selected = {selectedVar} key={i} press={this.press.bind(this,this.state.cateData[i])}/>
            //     );
            //
            // }
            // cateList.unshift( <Item name={"全部类别"} key={this.state.cateData.length}/>)

            const { cateData, cateid } = this.state;
            cateList = cateData.map(data => {
                return <Item name={data.name} key={data.name} selected={cateid === data.id} press={() => this.pressCate(data)} />
            })


        }

        if (this.state.areaData) {

            const { areaData, areid } = this.state;
            console.log('areid:',areid);
            areaList = areaData.map(data => {
                return <Item name={data} key={data} selected={areid === data} press={() => this.pressArea(data)} />
            })

        }

        if (this.state.yearData) {

            const { yearData, yearid } = this.state;
            yearList = yearData.map(data => {
                return <Item name={data} key={data} selected={yearid === data} press={() => this.pressYear(data)} />
            })
        }
        return (
            <View style={styles.container}>
                <View style={styles.scrollStyle}>
                    <ScrollView horizontal={true}
                        // 隐藏水平滚动条
                                showsHorizontalScrollIndicator={false}
                                paddingTop={10}
                    >
                        {cateList}

                    </ScrollView>
                 </View>

                <View style={styles.scrollStyle}>
                    <ScrollView horizontal={true}
                        // 隐藏水平滚动条
                                showsHorizontalScrollIndicator={false}
                                paddingTop={10}>
                        {areaList}
                    </ScrollView>
                </View>

                <View style={styles.scrollStyle}>
                    <ScrollView horizontal={true}
                        // 隐藏水平滚动条
                                showsHorizontalScrollIndicator={false}
                                paddingTop={10}>
                        {yearList}
                    </ScrollView>
                </View>

                <ListView
                    contentContainerStyle={styles.contentViewStyle}
                    dataSource={this.state.dataSource}
                    renderRow={this.renderRow}
                    onEndReached={this.loadMoreData}
                    onEndReachedThreshold={20}
                    renderFooter={this.renderFooter}
                />

            </View>
        );
    }



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
        console.log('total:',this.cachedResults.total);
        console.log('count:',this.cachedResults.items.length);
        console.log("boolVar:",this.cachedResults.items.length !== this.cachedResults.total);
        console.log("boolVar:",this.hasMore());
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

    loadDataFromNet(page){

        console.log(config.api.base + 'list');
        let params = {};
        params.id = this.state.pid;

        if(this.state.cateid){
            params.cid = this.state.cateid;
        }

        if(this.state.yearid){
            params.year = this.state.yearid ==="全部年份" ? null : this.state.yearid;
        }
        if(this.state.areid){
            params.area = this.state.areid === "全部地区" ? null : this.state.areid;
        }

        params.pages = this.cachedResults.nextPage;

        console.log('params:',params);
        request.post(config.api.base + 'category/list', params).then(
            (responseData)=> {
                let jsonData = responseData['data'];
                console.log('channelDetail:',jsonData);
                let cateList = jsonData.category_list;
                cateList.unshift({ "id": null,
                    "name": "全部类别"});
                let areaList =  jsonData.area_list;
                areaList.unshift("全部地区");

                let yearList =  jsonData.year_list;
                yearList.unshift("全部年份");

                if (page == 1){
                    this.cachedResults.items.splice(0,this.cachedResults.items.length);
                }
                let items = this.cachedResults.items.slice();
                items = this.cachedResults.items.concat(jsonData['vod_list']);
                this.cachedResults.items = items;
                this.cachedResults.total = parseInt(jsonData['vod_count']);
                console.log('count:',this.cachedResults.items.length);
                console.log('total:',this.cachedResults.total);
                let areid = this.state.areid ? this.state.areid : areaList[0];
                let yearid = this.state.yearid ? this.state.yearid : yearList[0];
                this.setState(
                    {
                        isLoading:false,
                        cateData:cateList,
                        areaData:areaList,
                        yearData:yearList,

                        areid:areid,
                        yearid:yearid,
                        dataSource :this.state.dataSource.cloneWithRows( this.cachedResults.items)

                    }
                );
            }
        ).catch(
            (err) => {
                if (err){
                    if (this.cachedResults.nextPage !=1 ){
                        this.cachedResults.nextPage--;
                    }


                }


            }
        )


    }


    pressCate(data){
        this.setState({
            cateid:data.id,
        }, function () {
            this.cachedResults.nextPage = 1;
            this.loadDataFromNet(1);
        });

    }

    pressArea(data){
        this.setState({
            areid:data,
        },
           function () {
               this.cachedResults.nextPage = 1;
               this.loadDataFromNet(1);
           });

    }

    pressYear(data){
        this.setState({
            yearid:data,
        },
            function () {
                this.cachedResults.nextPage = 1;
                this.loadDataFromNet(1);
            });

    }

    componentDidMount(){
        this.loadDataFromNet(1);
    }

}
// class Item extends Component {
//     constructor(props) {
//         super(props);
//         console.log('item init');
//
//     }
//
//     render(){
//         console.log('selectd:',this.props.selected);
//         let txtStyle = this.props.selected ? {color:'rgba(0,174,84,1)'}:{color:'rbga(38,38,38,1)'}
//         return(
//             <TouchableOpacity activeOpacity={1}  onPress={this.props.press}>
//                 <View style={styles.itemStyle}>
//                     <Text style={txtStyle}>
//                         {this.props.name}
//                     </Text>
//                 </View>
//             </TouchableOpacity>
//         );
//     }
//
//     componentWillReceiveProps(){
//
//         let txtStyle = this.props.selected ? {color:'rgba(0,174,84,1)'}:{color:'rbga(38,38,38,1)'}
//         return(
//             <TouchableOpacity activeOpacity={1}  onPress={this.props.press}>
//                 <View style={styles.itemStyle}>
//                     <Text style={txtStyle}>
//                         {this.props.name}
//                     </Text>
//                 </View>
//             </TouchableOpacity>
//         );
//     }
//
//
//
// }

const Item = ({selected, press, name}) => {
    return (
        <TouchableOpacity onPress={press} style={styles.itemStyle}>
            <Text style={{color:selected ?  'rgb(0, 174, 84)' : 'rgb(38, 38, 38)'}}>{name}</Text>
        </TouchableOpacity>
    )
}





const styles = StyleSheet.create({

    container:{
        flex:1,
    },

    scrollStyle:{
        height:40,
        justifyContent:'center'
    },
    itemStyle:{
        marginLeft:14
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

    loadingMore:{
        alignItems:'center',
        marginVertical:10
    },
    loadingText:{
        fontSize:13,
        color:'gray',
        textAlign:'center'
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




});


