import React, {Component} from 'react';
import {
    StyleSheet,
    Navigator,
    Text,
    View,
    ListView,
    RefreshControl,
    DeviceEventEmitter,
    TouchableOpacity,
    Platform,
    TextInput
} from 'react-native'
import NavigationBar from '../common/NavigationBar'
import ViewUtils from '../common/util/ViewUtils'
import GlobalStyles from '../../res/styles/GlobalStyles'

export default class PopularPage extends Component {
    constructor(props) {
        super(props)
        this.state = {
            rightButtonText: '搜索'
        }
    }

    updateState(dic) {
        this.setState(dic)
    }

    onBackPress() {
        this.refs.input.blur()
        this.props.navigator.pop()
    }

    onRightButtonClick() {
        if (this.state.rightButtonText === '搜索') {
            this.updateState({
                rightButtonText: '取消'
            })
        } else {
            this.updateState({
                rightButtonText: '搜索'
            })
        }
    }

    renderNavBar() {
        let backButton = ViewUtils.getLeftButton(() => this.onBackPress())
        let inputView = <TextInput
            ref={'input'}
            underlineColorAndroid={'white'}
            style={styles.textInput}
        >

        </TextInput>
        let rightButton =
            <TouchableOpacity
                onPress={() => {
                    this.onRightButtonClick()
                    this.refs.input.blur()
                }}
            >
                <View style={{marginRight: 10}}>
                    <Text style={styles.title}>{this.state.rightButtonText}</Text>
                </View>
            </TouchableOpacity>
        return <View
            style={{
                backgroundColor: '#2196f3',
                flexDirection: 'row',
                alignItems: 'center',
                height: (Platform.OS === 'ios') ? GlobalStyles.nav_bar_height_ios : GlobalStyles.nav_bar_height_android
            }}
        >
            {backButton}
            {inputView}
            {rightButton}
        </View>
    }

    render() {
        let statusBar = null
        if (Platform.OS === 'ios') {
            statusBar = <View
                style={[styles.statusBar, {backgroundColor: '#2196F3'}]}
            />
        }
        return <View style={GlobalStyles.root_container}>
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
        height: (Platform.OS === 'ios') ? 30 : 40,
        borderWidth: (Platform.OS === 'ios') ? 0.4 : 0,
        borderColor: 'white',
        alignSelf: 'center',
        paddingLeft: 5,
        marginRight: 10,
        marginLeft: 5,
        borderRadius: 3,
        opacity: 0.7,
        color: 'white'
    },
    title: {
        fontSize: 18,
        color: 'white',
        fontWeight: '500'
    }
})