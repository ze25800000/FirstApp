import React, {Component} from 'react'
import {
    View,
    Text,
    TouchableOpacity,
    ListView,
    Image,
    RefreshControl,
    StyleSheet
} from 'react-native'
import NavigationBar from './NavigationBar'
import Toast, {DURATION} from 'react-native-easy-toast'

let data = {
    "result": [
        {
            "email": "1@qq.com",
            "fullName": "hello1 world"
        },
        {
            "email": "2@qq.com",
            "fullName": "hello2 world"
        },
        {
            "email": "3@qq.com",
            "fullName": "hello3 world"
        },
        {
            "email": "4@qq.com",
            "fullName": "hello4 world"
        },
        {
            "email": "5@qq.com",
            "fullName": "hello5 world"
        },
        {
            "email": "6@qq.com",
            "fullName": "hello6 world"
        },
        {
            "email": "7@qq.com",
            "fullName": "hello7 world"
        },
        {
            "email": "8@qq.com",
            "fullName": "hello8 world"
        }
    ]
}
export default class ListViewTest extends Component {
    constructor(props) {
        super(props)
        const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})
        this.state = {
            dataSource: ds.cloneWithRows(data.result),
            isLoading: true
        }
        this.onLoad()
    }

    renderRow(item) {
        return <View style={styles.row} key={item.fullName}>
            <TouchableOpacity
                onPress={() => {
                    this.toast.show('你单击了：' + item.fullName, DURATION.LENGTH_LONG)
                }}
            >
                <Text style={styles.tips}>{item.fullName}</Text>
                <Text style={styles.tips}>{item.email}</Text>
            </TouchableOpacity>
        </View>

    }

    renderSeparator(sectionID, rowID, adjacentRowHighlighted) {
        return <View key={rowID} style={styles.line}>

        </View>
    }

    renderFooter() {
        return <Image style={{width: 400, height: 100}}
                      source={{uri: 'https://ss0.baidu.com/6ONWsjip0QIZ8tyhnq/it/u=3427682286,2075021510&fm=173&app=25&f=JPG?w=218&h=146&s=03F44522BEB613A318273E650300E06C'}}/>
    }

    onLoad() {
        setTimeout(() => {
            this.setState({
                isLoading: false
            })
        }, 2000)
    }

    render() {
        return (
            <View style={styles.container}>
                <NavigationBar
                    title={'ListViewTest'}
                />
                <ListView
                    dataSource={this.state.dataSource}
                    renderRow={(item) => this.renderRow(item)}
                    renderSeparator={(sectionID, rowID, adjacentRowHighlighted) => this.renderSeparator(sectionID, rowID, adjacentRowHighlighted)}
                    renderFooter={() => this.renderFooter()}
                    refreshControl={<RefreshControl
                        refreshing={this.state.isLoading}
                        onRefresh={() => this.onLoad()}
                    />}
                />
                <Toast ref={toast => {
                    this.toast = toast
                }}/>
            </View>
        )
    }
}

const styles = StyleSheet.create(({
    container: {
        flex: 1,
        backgroundColor: '#fff'
    },
    text: {
        fontSize: 22
    },
    tips: {
        fontSize: 18
    },
    row: {
        height: 150
    },
    line: {
        height: 1,
        backgroundColor: 'black'
    }
}))