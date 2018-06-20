import React, {Component} from 'react';
import {
    StyleSheet,
    Navigator,
    Text,
    View,
    ListView,
    RefreshControl,
    TextInput
} from 'react-native'
import NavigationBar from '../common/NavigationBar'
import DataRepository from '../expand/dao/DataRepository'
import ScrollableTabView, {ScrollableTabBar} from 'react-native-scrollable-tab-view'
import RepositoryCell from '../common/RepositoryCell'
import LanguageDao, {FLAG_LANGUAGE} from '../expand/dao/LanguageDao'

const URL = 'https://api.github.com/search/repositories?q='
const QUERY_STR = '&sort=stars'
export default class PopularPage extends Component {
    constructor(props) {
        super(props)
        this.languageDao = new LanguageDao(FLAG_LANGUAGE.flag_key)
        this.state = {
            language: []
        }
    }

    componentDidMount() {
        this.loadData()
    }

    async loadData() {
        let result = await this.languageDao.fetch()
        try {
            this.setState({
                language: result
            })
        } catch (e) {
            console.log(e)
        }
    }

    render() {
        let content = this.state.language.length > 0 ?
            <ScrollableTabView
                tabBarBackgroundColor={'#2196F3'}
                tabBarActiveTextColor={'#fff'}
                tabBarInactiveTextColor={'mintcream'}
                tabBarUnderlineStyle={{backgroundColor: '#e7e7e7', height: 2}}
                renderTabBar={() => <ScrollableTabBar/>}
            >
                {this.state.language.map((result, i, arr) => {
                    let lan = arr[i]
                    return lan.checked ? <PopularTab key={i} tabLabel={lan.name}>{lan.name}</PopularTab> : null
                })}
            </ScrollableTabView> : null
        return <View style={styles.container}>
            <NavigationBar
                title={'最热'}
                statusBar={{
                    backgroundColor: '#2196F3'
                }}
            />
            {content}
        </View>
    }
}

class PopularTab extends Component {
    constructor(props) {
        super(props)
        this.dataRepository = new DataRepository()
        this.state = {
            dataSource: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}),
            isLoading: false
        }
    }

    componentDidMount() {
        this.loadData()
    }

    async loadData() {
        this.setState({
            isLoading: true
        })
        let url = URL + this.props.tabLabel + QUERY_STR
        try {
            let result = await this.dataRepository.fetchNetRepository(url)
            this.setState({
                dataSource: this.state.dataSource.cloneWithRows(result.items),
                isLoading: false
            })
        } catch (e) {
            console.log(e)
        }
    }

    renderRow(data) {
        return <RepositoryCell data={data}/>
    }

    render() {
        return <View style={{flex: 1}}>
            <ListView
                dataSource={this.state.dataSource}
                renderRow={(data) => this.renderRow(data)}
                refreshControl={<RefreshControl
                    refreshing={this.state.isLoading}
                    onRefresh={() => this.loadData()}
                    colors={['#2196F3']}
                    tintColor={['#2196F3']}
                    title={'Loading...'}
                    titleColor={'#2196F3'}
                />}
            />
        </View>
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    }
})