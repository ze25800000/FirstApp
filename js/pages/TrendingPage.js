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
import DataRepository, {FLAG_STORAGE} from '../expand/dao/DataRepository'
import ScrollableTabView, {ScrollableTabBar} from 'react-native-scrollable-tab-view'
import TrendingCell from '../common/TrendingCell'
import LanguageDao, {FLAG_LANGUAGE} from '../expand/dao/LanguageDao'
import RepositoryDetail from './RepositoryDetail'

const API_URL = 'https://github.com/trending/'
export default class TrendingPage extends Component {
    constructor(props) {
        super(props)
        this.languageDao = new LanguageDao(FLAG_LANGUAGE.flag_language)
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
                    return lan.checked ?
                        <TrendingTab key={i} tabLabel={lan.name}
                                     path={lan.path} {...this.props}>{lan.name}</TrendingTab> : null
                })}
            </ScrollableTabView> : null
        return <View style={styles.container}>
            <NavigationBar
                title={'趋势'}
                statusBar={{
                    backgroundColor: '#2196F3'
                }}
            />
            {content}
        </View>
    }
}

class TrendingTab extends Component {
    constructor(props) {
        super(props)
        this.dataRepository = new DataRepository(FLAG_STORAGE.flag_trending)
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
        let url = this.genFetchUrl('?since=daily', this.props.path)
        try {
            let result = await this.dataRepository.fetchRepository(url)
            let items = result && result.items ? result.items : result ? result : []
            this.setState({
                dataSource: this.state.dataSource.cloneWithRows(items),
                isLoading: false
            })
            if (result && result.update_date && !this.dataRepository.checkDate(result.update_date)) {
                let items = await this.dataRepository.fetchNetRepository(url)
                this.setState({
                    dataSource: this.state.dataSource.cloneWithRows(items)
                })
            }
        } catch (e) {
            console.log(e)
        }
    }

    onSelect(item) {
        this.props.navigator.push({
            component: RepositoryDetail,
            params: {
                item: item,
                ...this.props
            }
        })
    }

    genFetchUrl(timeSpan, category) {
        return API_URL + category + timeSpan
    }

    renderRow(data) {
        return <TrendingCell
            onSelect={() => this.onSelect(data)}
            key={data.id}
            data={data}/>
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