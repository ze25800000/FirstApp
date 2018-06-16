import React, {Component} from 'react';
import {
    StyleSheet,
    Navigator,
    Text,
    View,
    TextInput
} from 'react-native'
import NavigationBar from '../common/NavigationBar'
import DataRepository from '../expand/dao/DataRepository'

const URL = 'https://api.github.com/search/repositories?q='
const QUERY_STR = '&sort=stars'
export default class PopularPage extends Component {
    constructor(props) {
        super(props)
        this.dataRepository = new DataRepository()
        this.state = {
            result: ''
        }
    }

    async onLoad() {
        let url = this.genUrl(this.text)
        try {
            let result = await this.dataRepository.fetchNetRepository(url)
            this.setState({
                result: JSON.stringify(result)
            })
        } catch (e) {
            this.setState({
                result: JSON.stringify(e)
            })
        }

    }

    genUrl(key) {
        return URL + key + QUERY_STR
    }

    render() {
        return <View>
            <NavigationBar
                title={'最热'}
            />
            <Text
                onPress={() => {
                    this.onLoad()
                }}
            >获取数据</Text>
            <TextInput
                onChangeText={text => this.text = text}
                style={{height: 50, borderWidth: 1}}/>
            <Text style={{height: 500}}>{this.state.result}</Text>
        </View>
    }
}