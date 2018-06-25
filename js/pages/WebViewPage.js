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
import GlobalStyles from '../../res/styles/GlobalStyles'
import ViewUtils from '../util/ViewUtils'

const URL = 'http://www.imooc.com'
export default class WebViewTest extends Component {
    constructor(props) {
        super(props)
        this.state = {
            url: this.props.url,
            title: this.props.title,
            canGoBack: false
        }
    }

    onBackPress() {
        if (this.state.canGoBack) {
            this.webView.goBack()
        } else {
            this.props.navigator.pop()
        }
    }


    onNavigationStateChange(e) {
        this.setState({
            canGoBack: e.canGoBack,
            url: e.url
        })
    }

    render() {
        return (
            <View style={GlobalStyles.root_container}>
                <NavigationBar
                    title={this.state.title}
                    style={{backgroundColor: '#2196f3'}}
                    leftButton={ViewUtils.getLeftButton(() => this.onBackPress())}
                />
                <WebView
                    ref={webView => this.webView = webView}
                    source={{uri: this.state.url}}
                    onNavigationStateChange={e => this.onNavigationStateChange(e)}
                />
            </View>
        )
    }
}