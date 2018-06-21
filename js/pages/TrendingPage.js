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
import NavigationBar from './../common/NavigationBar'
import DataRepository, {FLAG_STORAGE} from '../expand/dao/DataRepository'

let URL = 'http://github.com/trending/'
export default class TrendingTest extends Component {
    constructor(props) {
        super(props)
        this.dataRepository = new DataRepository(FLAG_STORAGE.flag_trending)
        this.state = {
            result: ''
        }
    }

    async loadData() {
        let url = URL + this.text
        let result = await this.dataRepository.fetchNetRepository(url)
        this.setState({
            result: JSON.stringify(result)
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
                        onPress={() => this.loadData()}
                    >
                        加载数据
                    </Text>
                    <Text style={{flex: 1}}>{this.state.result}</Text>
                </View>
            </View>
        )
    }
}