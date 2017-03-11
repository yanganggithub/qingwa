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
    TouchableOpacity
} from 'react-native';




import request from '../Common/request';
import config from '../Common/config';


export default class Channel extends Component{
    constructor(props){
        super(props);
        this.state ={
            cateData:[],
            hotChannelData:[]
        };
     
    }
    
    render() {
        let list = [];
        for (let i in this.state.cateData) {
            console.log('i:', i);
            console.log('length:',this.state.cateData.length);
            console.log('cateData:',this.state.cateData);
            if (i % 2 == 0) {
                let row = (
                    <View style={styles.row} key={i}>
                        {/*<Text>hello</Text>*/}

                        <CateItem data={this.state.cateData[parseInt(i)]}
                                  
                        
                        >
                            
                        </CateItem>
                        
                        
                        <CateItem data={this.state.cateData[i+1]}
                        >
                            
                        </CateItem>

                    </View>
                );
                list.push(row);
            }
        }

        return (
           <ScrollView>
               {list}


           </ScrollView>
        );
    }

    componentDidMount(){
        console.log(config.api.base + 'channel');
        request.get(config.api.base + 'channel',{

        }).then(
            (responseData)=>{
                var jsonData = responseData['data'];
                console.log('channel:',jsonData);
                var cateData = [];
                var moveDic = {};
                moveDic["id"]= jsonData.lulu_category.move_id;
                moveDic["bg"] =  jsonData.category_bg.move_bg;
                moveDic["total"] = jsonData.channel_total.move_total;
                cateData.push(moveDic);
                
                var tvDic = {};
                tvDic["id"] = jsonData.lulu_category.tv_id;
                tvDic["bg"] =  jsonData.category_bg.tv_bg;
                tvDic["total"] = jsonData.channel_total.tv_total;
                cateData.push(tvDic);

                var artsDic = {};
                artsDic["id"] = jsonData.lulu_category.arts_id;
                artsDic["bg"]=  jsonData.category_bg.arts_bg;
                artsDic["total"] = jsonData.channel_total.arts_total;
                cateData.push(artsDic);

                var comicDic = {};
                comicDic["id"] = jsonData.lulu_category.comic_id;
                comicDic["bg"] =  jsonData.category_bg.comic_bg;
                comicDic["total"] = jsonData.channel_total.comic_total;
                cateData.push(comicDic);
                
                this.setState(
                    {
                        cateData:cateData
                    }
                );
                
            }
        ).catch(
            (err) => {

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

        console.log(this.props.data);

            return (
                <View style={styles.item}>
                    <TouchableOpacity onPress={this.props.press}>



                        <Text  style={styles.channel_text}>{this.props.data.id}</Text>
                        <Text  style={styles.channel_text}>{this.props.data.total}</Text>
                        <Image key={i} source={{uri: this.props.data.bg}} style={{position:'absolute',width:width/2.0, height:width/2.0 * (187.5/121)}}>

                        </Image>


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
});


