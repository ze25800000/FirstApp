import React, {Component} from 'react';
import {
    StyleSheet,
    Navigator,
    Text,
    View,
    ScrollView,
    ListView,
    TouchableHighlight,
    Platform,
    Dimensions,
    Image
} from 'react-native'
import ViewUtils from '../../common/util/ViewUtils'
import {MORE_MENU} from '../../common/MoreMenu'
import CustomKeyPage from '../my/CustomKeyPage'
import {FLAG_LANGUAGE} from '../../expand/dao/LanguageDao'
import SortKeyPage from '../my/SortKeyPage'
import GlobalStyles from '../../../res/styles/GlobalStyles'
import AboutCommon, {FLAG_ABOUT} from './AboutCommon'

export default class AboutPage extends Component {
    constructor(props) {
        super(props);
        this.aboutCommon = new AboutCommon(props, (dic) => this.updateState(dic), FLAG_ABOUT.flag_about)
    }

    updateState(dic) {
        this.setState(dic)
    }

    onClick(tab) {
        let TargetComponent, params = {...this.props, menuType: tab}
        switch (tab) {
            case MORE_MENU.About_Author:
                break;
            case MORE_MENU.WebSite:
                break;
            case MORE_MENU.Feedback:
                break;
        }
        if (TargetComponent) {
            this.props.navigator.push({
                component: TargetComponent,
                params: params
            })
        }
    }


    render() {
        let content = <View>
            {ViewUtils.getSettingItem(() => this.onClick(MORE_MENU.WebSite), require('../../../res/images/ic_computer.png'), MORE_MENU.WebSite, {tintColor: '#2196F3'})}
            <View style={GlobalStyles.line}/>
            {ViewUtils.getSettingItem(() => this.onClick(MORE_MENU.About_Author), require('../my/images/ic_insert_emoticon.png'), MORE_MENU.About_Author, {tintColor: '#2196F3'})}
            <View style={GlobalStyles.line}/>
            {ViewUtils.getSettingItem(() => this.onClick(MORE_MENU.Feedback), require('../../../res/images/ic_feedback.png'), MORE_MENU.Feedback, {tintColor: '#2196F3'})}
            <View style={GlobalStyles.line}/>
        </View>
        return this.aboutCommon.renderView(content, {
            'name': 'GitHub Popular',
            'description': '这是一个用来查看GitHub最受欢迎与最热项目的App,它基于React Native支持Android和iOS双平台。',
            'avatar': 'https://avatars3.githubusercontent.com/u/21348680?s=460&v=4',
            'backgroundImg': 'https://ss0.baidu.com/73x1bjeh1BF3odCf/it/u=200754655,1853880921&fm=85&s=A2E24CA5400202FC07BD313603005003'
        })
    }
}