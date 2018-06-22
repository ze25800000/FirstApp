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
import RepositoryCell from '../common/RepositoryCell'
import RepositoryDetail from './RepositoryDetail'
import ProjectModel from '../model/ProjectModel'
import FavoriteDao from '../expand/dao/FavoriteDao'
import Utils from '../common/util/Utils'

const URL = 'https://api.github.com/search/repositories?q='
const QUERY_STR = '&sort=stars'

export default class FavoritePage extends Component {
    constructor(props) {
        super(props)
        this.state = {}
    }

    componentDidMount() {
        this.loadData()
    }

    render() {
        let NavigationBar =
            <NavigationBar
                title={'收藏'}
                statusBar={{
                    backgroundColor: '#2196F3'
                }}
            />
        let content = this.state.language.length > 0 ?
            <ScrollableTabView
                tabBarBackgroundColor={'#2196F3'}
                tabBarActiveTextColor={'#fff'}
                tabBarInactiveTextColor={'mintcream'}
                tabBarUnderlineStyle={{backgroundColor: '#e7e7e7', height: 2}}
                renderTabBar={() => <ScrollableTabBar/>}
            >
                <FavoriteTab tabLabel={'最热'} {...this.props} flag={FLAG_STORAGE.flag_popular}/>
                <FavoriteTab tabLabel={'趋势'} {...this.props} flag={FLAG_STORAGE.flag_trending}/>
            </ScrollableTabView> : null
        return <View style={styles.container}>
            {NavigationBar}
            {content}
        </View>
    }
}

class FavoriteTab extends Component {
    constructor(props) {
        super(props)
        this.favoriteDao = new FavoriteDao(this.props.flag)
        this.state = {
            dataSource: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}),
            isLoading: false,
            favoriteKeys: []
        }
    }

    componentDidMount() {
    }


    updateState(dic) {
        if (!this) return
        this.setState(dic)
    }

    async loadData() {
        this.updateState({
            isLoading: true
        })
        try {
        } catch (e) {
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