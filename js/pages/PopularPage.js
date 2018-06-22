import React, {Component} from 'react';
import {
    StyleSheet,
    Navigator,
    Text,
    View,
    ListView,
    RefreshControl,
    DeviceEventEmitter,
    TextInput
} from 'react-native'
import NavigationBar from '../common/NavigationBar'
import DataRepository, {FLAG_STORAGE} from '../expand/dao/DataRepository'
import ScrollableTabView, {ScrollableTabBar} from 'react-native-scrollable-tab-view'
import RepositoryCell from '../common/RepositoryCell'
import LanguageDao, {FLAG_LANGUAGE} from '../expand/dao/LanguageDao'
import RepositoryDetail from './RepositoryDetail'
import ProjectModel from '../model/ProjectModel'
import FavoriteDao from '../expand/dao/FavoriteDao'
import Utils from '../common/util/Utils'

const URL = 'https://api.github.com/search/repositories?q='
const QUERY_STR = '&sort=stars'
let favoriteDao = new FavoriteDao(FLAG_STORAGE.flag_popular)

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
                    return lan.checked ?
                        <PopularTab key={i} tabLabel={lan.name} {...this.props}>{lan.name}</PopularTab> : null
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
        this.isFavoriteChanged = false
        this.dataRepository = new DataRepository(FLAG_STORAGE.flag_popular)
        this.state = {
            dataSource: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}),
            isLoading: false,
            favoriteKeys: []
        }
    }

    componentDidMount() {
        this.loadData()
        this.listenner = DeviceEventEmitter.addListener('favoriteChanged_popular', () => {
            this.isFavoriteChanged = true
        })
    }

    componentWillUnmount() {
        if (this.listenner) this.listenner.remove()
    }

    componentWillReceiveProps() {
        if (this.isFavoriteChanged) {
            this.isFavoriteChanged = false
            this.getFavoriteKeys()
        }
    }

    flushFavoriteState() {
        let projectModels = []
        let items = this.items
        for (let i = 0, len = items.length; i < len; i++) {
            projectModels.push(new ProjectModel(items[i], Utils.checkFavorite(items[i], this.state.favoriteKeys)))
        }
        this.updateState({
            isLoading: false,
            dataSource: this.getDataSource(projectModels)
        })
    }

    getDataSource(data) {
        return this.state.dataSource.cloneWithRows(data)
    }

    async getFavoriteKeys() {
        try {
            let keys = await favoriteDao.getFavoriteKeys()
            if (keys) this.updateState({favoriteKeys: keys})
            this.flushFavoriteState()
        } catch (e) {
            this.flushFavoriteState()
        }
    }

    updateState(dic) {
        if (!this) return
        this.setState(dic)
    }

    async loadData() {
        this.updateState({
            isLoading: true
        })
        let url = URL + this.props.tabLabel + QUERY_STR
        try {
            let result = await this.dataRepository.fetchRepository(url)
            this.items = result && result.items ? result.items : result ? result : []
            this.getFavoriteKeys()
            if (!this.items || result && result.update_date && !this.dataRepository.checkDate(result.update_date)) {
                this.items = await this.dataRepository.fetchNetRepository(url)
                this.getFavoriteKeys()
            }
        } catch (e) {
            console.log(e)
            this.updateState({
                isLoading: false
            })
        }
    }

    onSelect(projectModel) {
        let item = projectModel.item
        this.props.navigator.push({
            title: item.full_name,
            component: RepositoryDetail,
            params: {
                flag: FLAG_STORAGE.flag_popular,
                projectModel: projectModel,
                parentComponent: this,
                ...this.props
            }
        })
    }

    onFavorite(item, isFavorite) {
        if (isFavorite) {
            favoriteDao.saveFavoriteItem(item.id.toString(), JSON.stringify(item))
        } else {
            favoriteDao.removeFavoriteItem(item.id.toString())
        }
    }


    renderRow(projectModel) {
        return <RepositoryCell
            onSelect={() => this.onSelect(projectModel)}
            key={projectModel.item.id}
            projectModel={projectModel}
            onFavorite={(item, isFavorite) => this.onFavorite(item, isFavorite)}
        />
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