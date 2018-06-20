import React, {Component} from 'react';
import {
    StyleSheet,
    Navigator,
    Text,
    View,
    Image
} from 'react-native'
import DataRepository from './js/expand/dao/DataRepository'

export default class Test extends Component {
    constructor(props) {
        super(props)
        this.dataRepository = new DataRepository()
    }

    render() {
        return <View style={{flex: 1}}>
            <Text>{this.dataRepository.checkDate(new Date().getTime())}</Text>
        </View>
    }
}
