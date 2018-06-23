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
    Linking,
    Image
} from 'react-native'
import ViewUtils from '../../common/util/ViewUtils'
import {MORE_MENU} from '../../common/MoreMenu'
import AboutMePage from './AboutMePage'
import GlobalStyles from '../../../res/styles/GlobalStyles'
import AboutCommon, {FLAG_ABOUT} from './AboutCommon'
import WebViewPage from '../WebViewPage'
import config from '../../../res/data/config'

export default class AboutPage extends Component {
    constructor(props) {
        super(props);
        this.aboutCommon = new AboutCommon(props, (dic) => this.updateState(dic), FLAG_ABOUT.flag_about, config)
        this.state = {
            projectModel: []
        }
    }

    componentDidMount() {
        this.aboutCommon.componentDidMount()
    }

    updateState(dic) {
        this.setState(dic)
    }

    onClick(tab) {
        let TargetComponent, params = {...this.props, menuType: tab}
        switch (tab) {
            case MORE_MENU.About_Author:
                TargetComponent = AboutMePage
                break;
            case MORE_MENU.WebSite:
                TargetComponent = WebViewPage
                params.url = 'http://www.devio.org/io/GitHubPopular/'
                params.title = 'GitHubPopular'
                break;
            case MORE_MENU.Feedback:
                let url = 'mailto:ze258100000@sina.com'
                Linking.canOpenURL(url).then(supported => {
                    if (!supported) {
                        console.log('Can\'t handle url: ' + url);
                    } else {
                        return Linking.openURL(url);
                    }
                }).catch(err => console.error('An error occurred', err));
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
            {this.aboutCommon.renderRepository(this.state.projectModel)}
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