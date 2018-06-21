import React, {Component} from 'react';
import {
    StyleSheet,
    Navigator,
    Text,
    View,
    TouchableHighlight,
    TouchableOpacity,
    Alert,
    Image
} from 'react-native'
import NavigationBar from '../../common/NavigationBar'
import LanguageDao, {FLAG_LANGUAGE} from '../../expand/dao/LanguageDao'
import ArrayUtils from '../../common/util/ArrayUtils'
import SortableListView from 'react-native-sortable-listview'
import ViewUtils from '../../common/util/ViewUtils'

export default class MyPage extends Component {
    constructor(props) {
        super(props)
        this.dataArray = []
        this.sortResultArray = []
        this.originalCheckedArray = []
        this.state = {
            checkedArray: []
        }
    }

    componentDidMount() {
        this.languageDao = new LanguageDao(this.props.flag)
        this.loadData()
    }

    async loadData() {
        try {
            let result = await this.languageDao.fetch()
            this.getCheckedItems(result)
        } catch (e) {

        }
    }

    getCheckedItems(result) {
        this.dataArray = result
        let checkedArray = []
        for (let i = 0, len = result.length; i < len; i++) {
            let data = result[i]
            if (data.checked) checkedArray.push(data)
        }
        this.setState({
            checkedArray: checkedArray
        })
        this.originalCheckedArray = ArrayUtils.clone(checkedArray)
    }

    onSave(isChecked) {
        if (!isChecked && ArrayUtils.isEquire(this.originalCheckedArray, this.state.checkedArray)) {
            this.props.navigator.pop()
            return
        }
        this.getSortResult()
        this.languageDao.save(this.sortResultArray)
        this.props.navigator.pop()
    }

    onBack() {
        if (ArrayUtils.isEquire(this.originalCheckedArray, this.state.checkedArray)) {
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
                        this.onSave(true)
                    }
                }
            ]
        )
    }

    getSortResult() {
        this.sortResultArray = ArrayUtils.clone(this.dataArray)
        for (let i = 0, l = this.originalCheckedArray.length; i < l; i++) {
            let item = this.originalCheckedArray[i]
            let index = this.dataArray.indexOf(item)
            this.sortResultArray.splice(index, 1, this.state.checkedArray[i])
        }
    }

    render() {
        let title = this.props.flag === FLAG_LANGUAGE.flag_language ? '语言排序' : '标签排序'
        let rightButton = <TouchableOpacity
            onPress={() => this.onSave()}
        >
            <View style={{margin: 10}}>
                <Text style={styles.title}>保存</Text>
            </View>
        </TouchableOpacity>
        return <View style={styles.container}>
            <NavigationBar
                title={title}
                leftButton={ViewUtils.getLeftButton(() => this.onBack())}
                rightButton={rightButton}
            />
            <SortableListView
                data={this.state.checkedArray}
                order={Object.keys(this.state.checkedArray)}
                onRowMoved={(e) => {
                    this.state.checkedArray.splice(e.to, 0, this.state.checkedArray.splice(e.from, 1)[0]);
                    this.forceUpdate();
                }}
                renderRow={row => <SortCell data={row} {...this.props}/>}
            />
        </View>
    }
}

class SortCell extends Component {
    render() {
        return <TouchableHighlight
            underlayColor={'#eee'}
            delayLongPress={200}
            style={styles.item}
            {...this.props.sortHandlers}
        >
            <View style={styles.row}>
                <Image
                    style={styles.image}
                    source={require('./images/ic_sort.png')}/>
                <Text>{this.props.data.name}</Text>
            </View>
        </TouchableHighlight>
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    tips: {
        fontSize: 29
    },
    item: {
        padding: 15,
        backgroundColor: '#F8F8F8',
        borderBottomWidth: 1,
        borderColor: '#eee'
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    title: {
        color: 'white',
        fontSize: 20
    },
    image: {
        tintColor: '#2196F3',
        height: 16,
        width: 16,
        marginRight: 10
    }
})