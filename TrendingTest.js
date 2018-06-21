import React, {Component} from 'react';
import {
    StyleSheet,
    Navigator,
    Text,
    View,
    WebView,
    TextInput,
    Image,
    DeviceEventEmitter
} from 'react-native'
import NavigationBar from './js/common/NavigationBar'
import Toast from 'react-native-easy-toast'
import GitHubTrending from 'GitHubTrending'

const URL = 'http://github.com/trending/'
export default class TrendingTest extends Component {
    constructor(props) {
        super(props)
        this.trending = new GitHubTrending()
        this.state = {
            result: ''
        }
    }

    onLoad() {
        let url = URL + this.text
        this.trending.fetchTrending(url)
            .then(result => {
                this.setState({
                    result: JSON.stringify(result)
                })
            })
    }

    render() {
        return (
            <View>
                <NavigationBar
                    title="GitHubTrending的使用"
                />
                <TextInput
                    style={{height: 30, borderWidth: 1}}
                    onChangeText={text => {
                        this.text = text
                    }}
                />
                <View style={{flexDirection: 'row'}}>
                    <Text
                          onPress={() => this.onLoad()}
                    >
                        加载数据
                    </Text>
                    <Text style={{flex: 1}}>{this.state.result}</Text>
                </View>
            </View>
        )
    }
}