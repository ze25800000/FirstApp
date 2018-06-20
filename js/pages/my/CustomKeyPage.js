import React, {Component} from 'react';
import {
    StyleSheet,
    Navigator,
    Text,
    TouchableOpacity,
    View,
    ScrollView,
    Alert,
    Image
} from 'react-native'
import NavigationBar from '../../common/NavigationBar'
import ViewUtils from '../../common/util/ViewUtils'
import LanguageDao, {FLAG_LANGUAGE} from '../../expand/dao/LanguageDao'
import CheckBox from 'react-native-check-box'
import ArrayUtils from '../../common/util/ArrayUtils'

export default class CustomKeyPage extends Component {
    constructor(props) {
        super(props)
        this.isRemoveKey = this.props.isRemoveKey ? true : false
        this.languageDao = new LanguageDao(FLAG_LANGUAGE.flag_key)
        this.chanageValues = []
        this.state = {
            dataArray: []
        }
    }

    onSave() {
        if (this.chanageValues.length === 0) {
            this.props.navigator.pop()
            return
        }
        if (this.isRemoveKey) {
            for (let i = 0, l = this.chanageValues.length; i < l; i++) {
                ArrayUtils.remove(this.state.dataArray, this.chanageValues[i])
            }
        }
        this.languageDao.save(this.state.dataArray)
        this.props.navigator.pop()
    }

    onBack() {
        if (this.chanageValues.length === 0) {
            this.props.navigator.pop()
            return
        }
        Alert.alert(
            '提示',
            '要保存修改么？',
            [
                {
                    text: '不保存', onPress: () => {
                        this.props.navigator.pop()
                    }
                },
                {
                    text: '保存', onPress: () => {
                        this.onSave()
                    }
                }
            ]
        )
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
            views.push(
                <View key={i}>
                    <View style={styles.item}>
                        {this.renderCheckBox(this.state.dataArray[i])}
                        {this.renderCheckBox(this.state.dataArray[i + 1])}
                    </View>
                    <View style={styles.line}></View>
                </View>
            )
        }
        views.push(
            <View key={len - 1}>
                <View style={styles.item}>
                    {len % 2 === 0 ? this.renderCheckBox(this.state.dataArray[len - 2]) : null}
                    {this.renderCheckBox(this.state.dataArray[len - 1])}
                </View>
                <View style={styles.line}></View>
            </View>
        )
        return views
    }

    onClick(data) {
        if (!this.isRemoveKey) data.checked = !data.checked
        ArrayUtils.updateArray(this.chanageValues, data)
    }

    renderCheckBox(data) {
        let leftText = data.name
        let isChecked = this.isRemoveKey ? false : data.checked
        return (
            <CheckBox
                style={{flex: 1, padding: 10}}
                onClick={() => this.onClick(data)}
                leftText={leftText}
                isChecked={isChecked}
                checkedImage={<Image style={{tintColor: '#6495ED'}}
                                     source={require('./images/ic_check_box.png')}/>}
                unCheckedImage={<Image style={{tintColor: '#6495ED'}}
                                       source={require('./images/ic_check_box_outline_blank.png')}/>}

            />
        )
    }

    render() {
        let title = this.isRemoveKey ? '标签移除' : '自定义标签页'
        let rightButtonTitle = this.isRemoveKey ? '移除' : '保存'
        return <View style={styles.container}>
            <NavigationBar
                title={title}
                leftButton={ViewUtils.getLeftButton(() => this.onBack())}
                rightButton={ViewUtils.getRightButton(rightButtonTitle, () => this.onSave())}
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
    },
    line: {
        height: 1,
        backgroundColor: 'darkgray'
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center'
    }
})