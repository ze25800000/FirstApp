import React, {Component} from 'react';
import {
    StyleSheet,
    Navigator,
    Text,
    View,
    ScrollView,
    TouchableHighlight,
    Image
} from 'react-native'
import CustomKeyPage from './CustomKeyPage'
import SortKeyPage from './SortKeyPage'
import NavigationBar from '../../common/NavigationBar'
import {FLAG_LANGUAGE} from '../../expand/dao/LanguageDao'
import {MORE_MENU, MoreMenu} from '../../common/MoreMenu'
import GlobalStyles from '../../../res/styles/GlobalStyles'
import ViewUtils from '../../util/ViewUtils'
import AboutPage from '../about/AboutPage'
import AboutMePage from '../about/AboutMePage'
import CustomThemePage from './CustomTheme'

export default class MyPage extends Component {
    constructor(props) {
        super(props)
        this.state = {
            customThemeViewVisible: false,
            theme: this.props.theme
        }
    }

    renderCustomThemeView() {
        return (
            <CustomThemePage
                visible={this.state.customThemeViewVisible}
                {...this.props}
                onClose={() => this.setState({customThemeViewVisible: false})}
            />
        )
    }

    onClick(tab) {
        let TargetComponent, params = {...this.props, menuType: tab}
        switch (tab) {
            case MORE_MENU.Custom_Language:
                TargetComponent = CustomKeyPage;
                params.flag = FLAG_LANGUAGE.flag_language;
                break;
            case MORE_MENU.Custom_Key:
                TargetComponent = CustomKeyPage;
                params.flag = FLAG_LANGUAGE.flag_key;
                break;
            case MORE_MENU.Remove_Key:
                TargetComponent = CustomKeyPage;
                params.flag = FLAG_LANGUAGE.flag_key;
                params.isRemoveKey = true
                break;
            case MORE_MENU.Sort_Language:
                TargetComponent = SortKeyPage;
                params.flag = FLAG_LANGUAGE.flag_language;
                break;
            case MORE_MENU.Sort_Key:
                TargetComponent = SortKeyPage;
                params.flag = FLAG_LANGUAGE.flag_key;
                break;
            case MORE_MENU.Custom_Theme:
                this.setState({
                    customThemeViewVisible: true
                })
                break;
            case MORE_MENU.About_Author:
                TargetComponent = AboutMePage;
                break;
            case MORE_MENU.About:
                TargetComponent = AboutPage;
                break;
        }
        if (TargetComponent) {
            this.props.navigator.push({
                component: TargetComponent,
                params: params
            })
        }
    }

    getItem(tag, icon, text) {
        return ViewUtils.getSettingItem(() => this.onClick(tag), icon, text, this.state.theme.styles.tabBarSelectedIcon, null)

    }

    render() {
        let statusBar = {
            backgroundColor: this.state.theme.themeColor
        }
        let navigationBar = <NavigationBar
            title={'我的'}
            style={this.props.theme.styles.navBar}
            statusBar={statusBar}
        />
        return <View style={GlobalStyles.root_container}>
            {navigationBar}
            <ScrollView>
                <TouchableHighlight
                    onPress={() => this.onClick(MORE_MENU.About)}
                >
                    <View style={[styles.item, {height: 90}]}>
                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                            <Image
                                style={[{width: 40, height: 40, marginRight: 10}, this.state.theme.styles.tabBarSelectedIcon]}
                                source={require('../../../res/images/ic_trending.png')}/>
                            <Text>GitHub Popular</Text>
                        </View>
                        <Image
                            style={[{
                                marginRight: 10,
                                height: 22,
                                width: 22
                            }, this.state.theme.styles.tabBarSelectedIcon]}
                            source={require('../../../res/images/ic_tiaozhuan.png')}/>
                    </View>
                </TouchableHighlight>
                <View style={GlobalStyles.line}/>

                {/*趋势管理*/}
                <Text style={styles.groupTitle}>趋势管理</Text>
                <View style={GlobalStyles.line}/>
                {this.getItem(MORE_MENU.Custom_Language, require('./images/ic_custom_language.png'), '自定义语言')}
                <View style={GlobalStyles.line}/>
                {/*语言排序*/}
                {this.getItem(MORE_MENU.Sort_Language, require('./images/ic_swap_vert.png'), '语言排序')}

                {/*标签管理*/}
                <View style={GlobalStyles.line}/>
                <Text style={styles.groupTitle}>最热管理</Text>
                <View style={GlobalStyles.line}/>
                {this.getItem(MORE_MENU.Custom_Key, require('./images/ic_custom_language.png'), '自定义标签')}
                <View style={GlobalStyles.line}/>
                {/*标签排序*/}
                {this.getItem(MORE_MENU.Sort_Key, require('./images/ic_swap_vert.png'), '标签排序')}
                {/*标签移除*/}
                <View style={GlobalStyles.line}/>
                {this.getItem(MORE_MENU.Remove_Key, require('./images/ic_swap_vert.png'), '标签移除')}

                {/*设置*/}
                <View style={GlobalStyles.line}/>
                <Text style={styles.groupTitle}>设置</Text>
                <View style={GlobalStyles.line}/>
                {/*自定义主题*/}
                {this.getItem(MORE_MENU.Custom_Theme, require('./images/ic_view_quilt.png'), '自定义主题')}
                <View style={GlobalStyles.line}/>
                {this.getItem(MORE_MENU.About_Author, require('./images/ic_insert_emoticon.png'), '关于作者')}
            </ScrollView>
            {this.renderCustomThemeView()}
        </View>
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    item: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
        backgroundColor: 'white',
        height: 60
    },
    groupTitle: {
        marginLeft: 10,
        marginTop: 10,
        marginBottom: 5,
        fontSize: 12,
        color: 'gray'
    }
})