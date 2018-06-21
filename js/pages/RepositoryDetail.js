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
import NavigationBar from '../common/NavigationBar'
import ViewUtils from '../common/util/ViewUtils'

const TRENDING_URL = 'https://github.com/'
export default class RepositoryDetail extends Component {
    constructor(props) {
        super(props)
        this.url = this.props.item.html_url ? this.props.item.html_url : TRENDING_URL + this.props.item.fullName
        let title = this.props.item.full_name ? this.props.item.full_name : this.props.item.fullName
        this.state = {
            url: this.url,
            title: title,
            canGoBack: false
        }
    }

    goBack() {
        if (this.state.canGoBack) {
            this.webView.goBack()
        } else {
            this.props.navigator.pop()
        }
    }

    go() {
        this.setState({
            url: this.text
        })
    }

    onNavigationStateChange(e) {
        this.setState({
            canGoBack: e.canGoBack
        })
    }

    render() {
        return (
            <View style={{flex: 1}}>
                <NavigationBar
                    title={this.state.title}
                    leftButton={ViewUtils.getLeftButton(() => this.goBack())}
                />
                <WebView
                    ref={webView => this.webView = webView}
                    source={{uri: this.state.url}}
                    onNavigationStateChange={e => this.onNavigationStateChange(e)}
                    startInLoadingState={true}
                />
            </View>
        )
    }
}
const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        margin: 10
    },
    tips: {fontSize: 20},
    input: {height: 40, flex: 1, borderWidth: 1, margin: 2}
})