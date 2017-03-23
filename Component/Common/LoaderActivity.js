/**
 * Created by yangang on 17/3/20.
 */
import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Image,
    Platform,   // 判断当前运行的系统
    Navigator
} from 'react-native';

import Loading from 'react-native-loading-w';






export default class LoaderActivity extends Component{
    constructor(props){
        super(props);

    }

    getLoading() {
        return this.refs['loading'];
    }

    show(){
        this.refs['loading'].show();
    }

    dismiss(){
        this.refs['loading'].dismiss();
    }


    render() {
        return (

            <Loading ref={'loading'} text={'Loading...'} />

        );
    }


}


