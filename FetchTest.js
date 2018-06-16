import React, {Component} from 'react'
import {
    View,
    Text,
    TouchableOpacity,
    Image,
    StyleSheet
} from 'react-native'
import NavigationBar from './NavigationBar'
import HttpUtils from './HttpUtils'

export default class FetchTest extends Component {
    constructor(props) {
        super(props)
        this.state = {
            result: ''
        }
    }

    async onLoad(url) {
        try {
            let result = await HttpUtils.get(url)
            this.setState({
                result: JSON.stringify(result)
            })
        } catch (e) {
            this.setState({
                result: JSON.stringify(e)
            })
        }
    }

    async onSubmit(url, data) {
        try {
            let result = await HttpUtils.post(url, data)
            this.setState({
                result: JSON.stringify(result)
            })
        } catch (e) {
            this.setState({
                result: JSON.stringify(e)
            })
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <NavigationBar
                    title={'FetchTest'}
                />
                <Text
                    onPress={() => this.onLoad('http://rap.taobao.org/mockjsdata/11793/test')}
                >获取数据</Text>
                <Text
                    onPress={() => this.onSubmit('http://rap.taobao.org/mockjsdata/11793/submit', {
                        userName: '小明',
                        password: '123456'
                    })}
                >提交数据</Text>
                <Text>返回数据：{this.state.result}</Text>
            </View>
        )
    }
}

const styles = StyleSheet.create(({
    container: {
        flex: 1,
        backgroundColor: '#fff'
    },
    text: {
        fontSize: 22
    }
}))