import React, {Component} from 'react';
import {
    StyleSheet,
    Navigator,
    Text,
    View,
    Image
} from 'react-native'
import NavigationBar from '../common/NavigationBar'
import HomePage from './HomePage'

export default class WelcomePage extends Component {
    componentDidMount() {
        this.timer = setTimeout(() => {
            this.props.navigator.resetTo({
                component: HomePage
            })
        }, 100)
    }

    componentWillUnmount() {
        this.timer && clearTimeout(this.timer)
    }

    render() {
        return <View>
            <NavigationBar
                title={'欢迎'}
            />
            <Text>欢迎</Text>
        </View>
    }
}