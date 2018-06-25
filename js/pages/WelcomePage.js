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
import ThemeDao from '../expand/dao/ThemeDao'

export default class WelcomePage extends Component {
    componentDidMount() {
        new ThemeDao().getTheme().then(data => {
            this.theme = data
        })
        this.timer = setTimeout(() => {
            this.props.navigator.resetTo({
                component: HomePage,
                params: {
                    theme: this.theme
                }
            })
        }, 500)
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