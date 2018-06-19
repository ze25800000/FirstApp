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
import LanguageDao, {FLAG_LANGUAGE} from '../../expand/dao/LanguageDao'

export default class CustomKeyPage extends Component {
    constructor(props) {
        super(props)
        this.languageDao = new LanguageDao(FLAG_LANGUAGE.flag_key)
        this.state = {
            dataArray: []
        }
    }

    onSave() {
        this.props.navigator.pop()
    }

    componentDidMount() {
        this.loadData()
    }

    async loadData() {
        let result = await this.languageDao.fetch()
        try {
            this.setState({
                dataArray: result
            })
        } catch (e) {
            console.log(e)
        }
    }

    renderView() {
        if (!this.state.dataArray || this.state.dataArray.length === 0) return null
        let len = this.state.dataArray.length
        let views = []
        for (let i = 0, l = len - 2; i < l; i += 2) {

        }
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