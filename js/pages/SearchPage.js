import React, {Component} from 'react';
import {
    StyleSheet,
    Navigator,
    Text,
    View,
    ListView,
    RefreshControl,
    DeviceEventEmitter,
    Platform,
    TextInput
} from 'react-native'
import NavigationBar from '../common/NavigationBar'
import ViewUtils from '../common/util/ViewUtils'

export default class PopularPage extends Component {
    onBackPress() {

    }

    renderNavBar() {
        let backButton = ViewUtils.getLeftButton(() => this.onBackPress())
        let inputView = <TextInput
            style={styles.textInput}
        >

        </TextInput>
        return <View>
            {backButton}
            {inputView}
        </View>
    }

    render() {
        let statusBar = null
        if (Platform.OS === 'ios') {
            statusBar = <View
                style={[styles.statusBar, {backgroundColor: '#2196F3'}]}
            />
        }
        return <View>
            {statusBar}
            {this.renderNavBar()}
        </View>
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'stretch'
    },
    statusBar: {
        height: 20
    },
    textInput: {
        flex: 1,
        height: (Platform.OS === 'ios') ? 30 : 30,
        borderWidth: 1,
        borderColor: 'white'
    }
})