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
import ParallaxScrollView from 'react-native-parallax-scroll-view'
import ViewUtils from '../../common/util/ViewUtils'
import {MORE_MENU} from '../../common/MoreMenu'
import CustomKeyPage from '../my/CustomKeyPage'
import {FLAG_LANGUAGE} from '../../expand/dao/LanguageDao'
import SortKeyPage from '../my/SortKeyPage'
import GlobalStyles from '../../../res/styles/GlobalStyles'

export default class AboutPage extends Component {
    constructor(props) {
        super(props);
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

    getParallaxRenderConfig(params) {
        let config = {}
        config.renderBackground = () => (
            <View key="background">
                <Image source={{
                    uri: params.backgroundImg,
                    width: window.width,
                    height: PARALLAX_HEADER_HEIGHT
                }}/>
                <View style={{
                    position: 'absolute',
                    top: 0,
                    width: window.width,
                    backgroundColor: 'rgba(0,0,0,.4)',
                    height: PARALLAX_HEADER_HEIGHT
                }}/>
            </View>
        )
        config.renderForeground = () => (
            <View key="parallax-header" style={styles.parallaxHeader}>
                <Image style={styles.avatar} source={{
                    uri: params.avatar,
                    width: AVATAR_SIZE,
                    height: AVATAR_SIZE
                }}/>
                <Text style={styles.sectionSpeakerText}>
                    {params.name}
                </Text>
                <Text style={styles.sectionTitleText}>
                    {params.description}
                </Text>
            </View>
        )
        config.renderStickyHeader = () => (
            <View key="sticky-header" style={styles.stickySection}>
                <Text style={styles.stickySectionText}>{params.name}</Text>
            </View>
        )
        config.renderFixedHeader = () => (
            <View key="fixed-header" style={styles.fixedSection}>
                {ViewUtils.getLeftButton(() => this.props.navigator.pop())}
            </View>
        )
        return config
    }

    renderView(contentView, params) {
        let renderConfig = this.getParallaxRenderConfig(params)
        return (
            <ParallaxScrollView
                headerBackgroundColor="#2196F3"
                backgroundColor='#2196F3'
                stickyHeaderHeight={STICKY_HEADER_HEIGHT}
                parallaxHeaderHeight={PARALLAX_HEADER_HEIGHT}
                backgroundSpeed={10}
                {...renderConfig}
            >
                {contentView}
            </ParallaxScrollView>
        );
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
        return this.renderView(content, {
            'name': 'GitHub Popular',
            'description': '这是一个用来查看GitHub最受欢迎与最热项目的App,它基于React Native支持Android和iOS双平台。',
            'avatar': 'https://avatars3.githubusercontent.com/u/21348680?s=460&v=4',
            'backgroundImg': 'https://ss0.baidu.com/73x1bjeh1BF3odCf/it/u=200754655,1853880921&fm=85&s=A2E24CA5400202FC07BD313603005003'
        })
    }
}

const window = Dimensions.get('window');

const AVATAR_SIZE = 120;
const ROW_HEIGHT = 60;
const PARALLAX_HEADER_HEIGHT = 350;
const STICKY_HEADER_HEIGHT = 70;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black'
    },
    background: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: window.width,
        height: PARALLAX_HEADER_HEIGHT
    },
    stickySection: {
        height: STICKY_HEADER_HEIGHT,
        paddingTop: (Platform.OS === 'ios') ? 20 : 0,
        justifyContent: 'center',
        alignItems: 'center'
    },
    stickySectionText: {
        color: 'white',
        fontSize: 20,
        margin: 10
    },
    fixedSection: {
        position: 'absolute',
        bottom: 0,
        right: 10,
        left: 0,
        top: 0,
        paddingRight: 8,
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: (Platform.OS === 'ios') ? 20 : 0,
        justifyContent: 'space-between'
    },
    fixedSectionText: {
        color: '#999',
        fontSize: 20
    },
    parallaxHeader: {
        alignItems: 'center',
        flex: 1,
        flexDirection: 'column',
        paddingTop: 100
    },
    avatar: {
        marginBottom: 10,
        borderRadius: AVATAR_SIZE / 2
    },
    sectionSpeakerText: {
        color: 'white',
        fontSize: 24,
        paddingVertical: 5
    },
    sectionTitleText: {
        color: 'white',
        fontSize: 18,
        paddingVertical: 5
    },
    row: {
        overflow: 'hidden',
        paddingHorizontal: 10,
        height: ROW_HEIGHT,
        backgroundColor: 'white',
        borderColor: '#ccc',
        borderBottomWidth: 1,
        justifyContent: 'center'
    },
    rowText: {
        fontSize: 20
    }
});
