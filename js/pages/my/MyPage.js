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
import ViewUtils from '../../common/util/ViewUtils'

export default class MyPage extends Component {
    onClick() {

    }

    getItem(tag, icon, text) {
        return ViewUtils.getSettingItem(() => this.onClick(tag), icon, text, {tintColor: '#2196F3'}, null)

    }

    render() {
        let navigationBar = <NavigationBar
            title={'我的'}
            statusBar={{
                backgroundColor: '#2196F3'
            }}
        />
        return <View style={GlobalStyles.root_container}>
            {navigationBar}
            <ScrollView>
                <TouchableHighlight
                    onPress={() => this.onClick(MoreMenu.About)}
                >
                    <View style={styles.item}>
                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                            <Image
                                style={[{width: 40, height: 40, marginRight: 10}, {tintColor: '#2196f3'}]}
                                source={require('../../../res/images/ic_trending.png')}/>
                            <Text>GitHub Popular</Text>
                        </View>
                        <Image
                            style={[{
                                marginRight: 10,
                                height: 22,
                                width: 22
                            }, {tintColor: '#2196f3'}]}
                            source={require('../../../res/images/ic_tiaozhuan.png')}/>
                    </View>
                </TouchableHighlight>
                <View style={GlobalStyles.line}/>
                {/*趋势管理*/}
                <Text style={styles.groupTitle}>趋势管理</Text>
                <View style={GlobalStyles.line}/>
                {this.getItem(MORE_MENU.Custom_Key, require('./images/ic_custom_language.png'), '趋势管理')}
                <View style={GlobalStyles.line}/>
            </ScrollView>
            <Text
                style={styles.tips}
                onPress={() => {
                    this.props.navigator.push({
                        component: CustomKeyPage,
                        params: {
                            ...this.props,
                            flag: FLAG_LANGUAGE.flag_key
                        }
                    })
                }}
            >自定义标签</Text>
            <Text
                style={styles.tips}
                onPress={() => {
                    this.props.navigator.push({
                        component: CustomKeyPage,
                        params: {
                            ...this.props,
                            flag: FLAG_LANGUAGE.flag_language
                        }
                    })
                }}
            >自定义语言</Text>
            <Text
                style={styles.tips}
                onPress={() => {
                    this.props.navigator.push({
                        component: SortKeyPage,
                        params: {
                            ...this.props,
                            flag: FLAG_LANGUAGE.flag_key
                        }
                    })
                }}
            >标签排序</Text>
            <Text
                style={styles.tips}
                onPress={() => {
                    this.props.navigator.push({
                        component: SortKeyPage,
                        params: {
                            ...this.props,
                            flag: FLAG_LANGUAGE.flag_language
                        }
                    })
                }}
            >语言排序</Text>
            <Text
                style={styles.tips}
                onPress={() => {
                    this.props.navigator.push({
                        component: CustomKeyPage,
                        params: {
                            ...this.props,
                            isRemoveKey: true
                        }
                    })
                }}
            >标签移除</Text>
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