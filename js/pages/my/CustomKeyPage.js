import React, {Component} from 'react';
import {
    StyleSheet,
    Navigator,
    Text,
    TouchableOpacity,
    View,
    ScrollView,
    Image
} from 'react-native'
import NavigationBar from '../../common/NavigationBar'
import ViewUtils from '../../common/util/ViewUtils'

export default class CustomKeyPage extends Component {
    onSave() {
        this.props.navigator.pop()
    }

    renderView() {

    }

    render() {
        let rightButton = <TouchableOpacity
            onPress={() => this.onSave()}
        >
            <View style={{margin: 10}}>
                <Text style={styles.title}>保存</Text>
            </View>
        </TouchableOpacity>
        return <View style={styles.container}>
            <NavigationBar
                title={'自定义标签页'}
                leftButton={ViewUtils.getLeftButton(() => this.onSave())}
                rightButton={rightButton}
            />
            <ScrollView>
                {this.renderView()}
            </ScrollView>
        </View>
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    tips: {
        fontSize: 29
    },
    title: {
        color: 'white',
        fontSize: 20
    }
})