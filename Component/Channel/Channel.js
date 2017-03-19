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
    ScrollView,
    Dimensions,
    TouchableOpacity
} from 'react-native';

import ChannelDetail from '../Channel/ChannelDetail';
import Loading from 'react-native-loading-w';
var {width,height} = Dimensions.get('window');

var imgW = width/2.0;
var imgH = imgW * (121/187.5);
var hotW = width/4.0;
var hotH = 40;
import request from '../Common/request';
import config from '../Common/config';


export default class Channel extends Component{
    constructor(props){
        super(props);
        this.state ={
            cateData:[],
            hotData:[]
        };
     
    }
    
    render() {
        let listCate = [];
        let listHot = [];


        if (this.state.cateData.length == 4) {


            let row1 = (
                <View style={styles.row} key={1}>
                    {/*<Text>hello</Text>*/}

                    <CateItem data={this.state.cateData[0]}
                              viewColor='rgba(28,181,19,1)'
                              press={this.press.bind(this, this.state.cateData[0]) }

                    >

                    </CateItem>


                    <CateItem data={this.state.cateData[1]}
                              viewColor='rgba(23,124,205,1)'
                              press={this.press.bind(this, this.state.cateData[1]) }

                    >

                    </CateItem>

                </View>
            );

            listCate.push(row1);

            let row2 = (
                <View style={styles.row} key={2}>
                    {/*<Text>hello</Text>*/}

                    <CateItem data={this.state.cateData[2]}
                              viewColor='rgba(239,68,14,1)'
                              press={this.press.bind(this, this.state.cateData[2]) }

                    >

                    </CateItem>


                    <CateItem data={this.state.cateData[3]}
                              viewColor='rgba(230,113,11,1)'
                              press={this.press.bind(this, this.state.cateData[3]) }
                    >

                    </CateItem>

                </View>
            );
            listCate.push(row2);
        }

        let count = this.state.hotData.length;
        for (let i in this.state.hotData) {

            console.log('i:',i);

            if (i % 4 === 0) {
                //两个等号 ：不判断类型
                let data1 = null;
                let data2 = null;
                let data3 = null;
                let data4 = null;
                //三个等号：判断类型
                if(parseInt(i) <= count - 1){
                    data1 = this.state.hotData[parseInt(i)];
                }
                if(parseInt(i) + 1 <= count - 1){
                    data2 = this.state.hotData[parseInt(i) + 1];
                }

                if(parseInt(i) + 2 <= count - 1){
                    data3 = this.state.hotData[parseInt(i) + 2];
                }

                if(parseInt(i) + 3 <= count - 1){
                    data4 =  this.state.hotData[parseInt(i) + 3];
                }




                let row = (
                    <View style={styles.row} key={i}>

                        <HotItem  data = {data1}
                                  press={this.press.bind(this, data1) }

                        ></HotItem>



                        <HotItem data = {data2}
                                 press={this.press.bind(this, data2) }
                        ></HotItem>



                        <HotItem data = {data3}
                                 press={this.press.bind(this, data3) }
                        ></HotItem>


                        <HotItem data = {data4}
                                 press={this.press.bind(this, data4) }
                        ></HotItem>

                    </View>


                );
                listHot.push(row);

            }
        }



        return (
            <View style={styles.container}>
                <Loading ref={'loading'} text={'Loading...'} />
                {/*导航*/}
                {this.renderNavBar()}
                <ScrollView>
                     {listCate}
                     {listHot}
                </ScrollView>
            </View>
        );


    }
    getLoading() {
        return this.refs['loading'];
    }

    press(data){
        const { navigator } = this.props;

        if (navigator) {
            navigator.push({
                name: '详情页面',
                component: ChannelDetail,
                params:data
            })
        }
    }


    // 导航条
    renderNavBar(){
        return(
            <View style={styles.navOutViewStyle}>
                <TouchableOpacity  style={styles.leftViewStyle}>
                    <Image source={{uri: 'nav_search'}} style={styles.navImageStyle}/>
                </TouchableOpacity>
                <View style={styles.txtStyle}>
                    <Text style={{color:'white', fontSize:18, fontWeight:'bold'}}>频道</Text>
                </View>

                <TouchableOpacity onPress={()=>{alert('点了!')}} style={styles.rightViewStyle}>
                    <Image source={{uri: 'nav_record'}} style={styles.navImageStyle}/>
                </TouchableOpacity>
            </View>
        )
    }

    componentDidMount(){
        this.getLoading().show();
        console.log(config.api.base + 'channel');
        request.get(config.api.base + 'channel',{

        }).then(
            (responseData)=>{
                this.getLoading().dismiss();
                let jsonData = responseData['data'];
                let hotData = jsonData.hot_channel;
                console.log('channel:',jsonData);
                let cateData = [];
                let moveDic = {};
                moveDic["id"]= "电影";
                moveDic["bg"] =  jsonData.category_bg.move_bg;
                moveDic["total"] = jsonData.channel_total.move_total;
                cateData.push(moveDic);

                let tvDic = {};
                tvDic["id"] = "电视剧";
                tvDic["bg"] =  jsonData.category_bg.tv_bg;
                tvDic["total"] = jsonData.channel_total.tv_total;
                cateData.push(tvDic);

                let artsDic = {};
                artsDic["id"] = "综艺";
                artsDic["bg"]=  jsonData.category_bg.arts_bg;
                artsDic["total"] = jsonData.channel_total.arts_total;
                cateData.push(artsDic);

                let comicDic = {};
                comicDic["id"] = "动漫";
                comicDic["bg"] =  jsonData.category_bg.comic_bg;
                comicDic["total"] = jsonData.channel_total.comic_total;
                cateData.push(comicDic);
                
                this.setState(
                    {
                        cateData:cateData,
                        hotData:hotData
                    }
                );
                
            }
        ).catch(
            (err) => {
                if (err){
                    this.getLoading().dismiss();
                    console.log('error:',err);
                }
            }
        )
    }
}
class CateItem extends Component{
    constructor(props) {
        super(props);
        console.log('cateItem init');

    }
    
    render() {

        console.log(this.props.data.id);
        console.log(this.props.data.bg);
        console.log('color:',this.props.viewColor);



            return (
                <View style={[styles.item, {backgroundColor:this.props.viewColor}]}>

                    <TouchableOpacity onPress={this.props.press}>

                        <Text  style={{color:'white',fontSize:30}}>{this.props.data.id}</Text>
                        <View style={{marginTop: 5,alignItems:'center'}}>
                            <Text  style={{color:'white',fontSize:12}}>{this.props.data.total}</Text>
                        </View>

                        <Image  source={{uri: this.props.data.bg}} style={{position:'absolute',width:imgW, height:imgH}}>

                        </Image>
                    </TouchableOpacity>


                </View>



            );


    }
}

class HotItem extends Component {
    constructor(props) {
        super(props);
        console.log('hotItem init');
        console.log('pic:',this.props.data.pic);
    }
    render() {
        return (
            <View style={styles.hotItem}>
                <TouchableOpacity onPress={this.props.press}>

                    <Image  source={{uri: this.props.data.pic}} style={{width:hotW, height:hotH}}>

                    </Image>


                    <View style={{marginTop: 5,alignItems:'center'}}>
                        <Text  style={{color:'rgba(38,38,38,1.0)',fontSize:14}}>{this.props.data.name}</Text>
                    </View>
                </TouchableOpacity>


            </View>



        );
    }

}

// { lulu_category: { move_id: 1, tv_id: 2, comic_id: 3, arts_id: 4 },
//     category_bg:
//     { move_bg: 'http://s.qw.cc/mobile/ui/lulu/move_bg.jpg',
//         tv_bg: 'http://s.qw.cc/mobile/ui/lulu/tv_bg.jpg',
//         arts_bg: 'http://s.qw.cc/mobile/ui/lulu/arts_bg.jpg',
//         comic_bg: 'http://s.qw.cc/mobile/ui/lulu/comic_bg.jpg' },
//     channel_total:
//     { move_total: 14182,
//         tv_total: 8513,
//         comic_total: 9353,
//         arts_total: 7028 },
//     hot_channel:
//         [ { id: '17',
//             name: '欧美剧',
//             pid: '2',
//             pic: 'http://s.qw.cc/mobile/ui/lulu/17.jpg' },




const styles = StyleSheet.create({
    iconStyle:{
        width: Platform.OS === 'ios' ? 30 : 25,
        height:Platform.OS === 'ios' ? 30 : 25
    },

    selectedTitleStyle:{
        color:'orange'
    },
    row: {
        flex: 1,
        flexDirection: 'row',
    },

    item: {
        flex: 1,
        height: imgH,
        alignItems:'center',
        justifyContent:'center',
    },

    hotItem:{
        flex: 1,
        height:70,
        alignItems:'center',
        justifyContent:'center',
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


