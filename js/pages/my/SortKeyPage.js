import React, {Component} from 'react';
import {
    StyleSheet,
    Navigator,
    Text,
    View,
    Image
} from 'react-native'
import NavigationBar from '../../common/NavigationBar'
import LanguageDao, {FLAG_LANGUAGE} from '../../expand/dao/LanguageDao'
import ArrayUtils from '../../common/util/ArrayUtils'
import SortableListView from 'react-native-sortable-listview'

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
        this.languageDao = new LanguageDao(FLAG_LANGUAGE.flag_key)
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

    render() {
        return <View style={styles.container}>
            <NavigationBar
                title={'标签排序'}
            />
            <SortableListView
                style={{flex: 1}}
                data={this.state.checkedArray}
                order={Object.keys(this.state.checkedArray)}
                onRowMoved={e => {
                    order.splice(e.to, 0, this.state.checkedArray.splice(e.from, 1)[0])
                    this.forceUpdate()
                }}
                renderRow={row => <SortCell data={row}/>}
            />
        </View>
    }
}

class SortCell extends Component {
    render() {
        return <View>
            <Text>{this.props.data.name}</Text>
        </View>
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    tips: {
        fontSize: 29
    }
})