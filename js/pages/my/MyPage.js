import React, {Component} from 'react';
import {
    StyleSheet,
    Navigator,
    Text,
    View,
    Image
} from 'react-native'
import CustomKeyPage from './CustomKeyPage'
import SortKeyPage from './SortKeyPage'
import NavigationBar from '../../common/NavigationBar'
import {FLAG_LANGUAGE} from '../../expand/dao/LanguageDao'

export default class MyPage extends Component {

    render() {
        return <View>
            <NavigationBar
                title={'我的'}
            />
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
                        params: {...this.props}
                    })
                }}
            >标签排序</Text>
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
    tips: {
        fontSize: 29
    }
})