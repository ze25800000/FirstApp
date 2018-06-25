import React, {Component} from 'react';
import {
    StyleSheet,
    Navigator,
    Text,
    View,
    ListView,
    DeviceEventEmitter,
    RefreshControl,
    TextInput
} from 'react-native'
import NavigationBar from '../common/NavigationBar'
import DataRepository, {FLAG_STORAGE} from '../expand/dao/DataRepository'
import ScrollableTabView, {ScrollableTabBar} from 'react-native-scrollable-tab-view'
import RepositoryCell from '../common/RepositoryCell'
import TrendingCell from '../common/TrendingCell'
import RepositoryDetail from './RepositoryDetail'
import ProjectModel from '../model/ProjectModel'
import FavoriteDao from '../expand/dao/FavoriteDao'
import ArrayUtils from '../util/ArrayUtils'
import ActionUtils from '../util/ActionUtils'

export default class FavoritePage extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        let Navigation =
            <NavigationBar
                title={'收藏'}
                statusBar={{
                    backgroundColor: '#2196F3'
                }}
            />
        let content =
            <ScrollableTabView
                tabBarBackgroundColor={'#2196F3'}
                tabBarActiveTextColor={'#fff'}
                tabBarInactiveTextColor={'mintcream'}
                tabBarUnderlineStyle={{backgroundColor: '#e7e7e7', height: 2}}
                renderTabBar={() => <ScrollableTabBar/>}
            >
                <FavoriteTab tabLabel={'最热'} {...this.props} flag={FLAG_STORAGE.flag_popular}/>
                <FavoriteTab tabLabel={'趋势'} {...this.props} flag={FLAG_STORAGE.flag_trending}/>
            </ScrollableTabView>

        return <View style={styles.container}>
            {Navigation}
            {content}
        </View>
    }
}

class FavoriteTab extends Component {
    constructor(props) {
        super(props)
        this.favoriteDao = new FavoriteDao(this.props.flag)
        this.unFavoriteItems = []
        this.state = {
            dataSource: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}),
            isLoading: false,
            favoriteKeys: []
        }
    }

    componentDidMount() {
        this.loadData(true)
    }

    componentWillReceiveProps() {
        this.loadData(false)
    }

    updateState(dic) {
        if (!this) return
        this.setState(dic)
    }

    async loadData(isShowLoading) {
        if (isShowLoading) {
            this.updateState({
                isLoading: true
            })
        }
        try {
            let items = await this.favoriteDao.getAllItems()
            let resultData = []
            for (let i = 0, len = items.length; i < len; i++) {
                resultData.push(new ProjectModel(items[i], true))
            }
            this.updateState({
                isLoading: false,
                dataSource: this.getDataSource(resultData)
            })
        } catch (e) {
            this.updateState({
                isLoading: false
            })
        }
    }

    getDataSource(items) {
        return this.state.dataSource.cloneWithRows(items)
    }

    onFavorite(item, isFavorite) {
        let key = this.props.flag === FLAG_STORAGE.flag_popular ? item.id.toString() : item.fullName
        if (isFavorite) {
            this.favoriteDao.saveFavoriteItem(key, JSON.stringify(item))
        } else {
            this.favoriteDao.removeFavoriteItem(key)
        }
        ArrayUtils.updateArray(this.unFavoriteItems, item)
        if (this.unFavoriteItems.length > 0) {
            if (this.props.flag === FLAG_STORAGE.flag_popular) {
                DeviceEventEmitter.emit('favoriteChanged_popular')
            } else {
                DeviceEventEmitter.emit('favoriteChanged_trending')
            }
        }
    }


    renderRow(projectModel) {
        let CellComponent = this.props.flag === FLAG_STORAGE.flag_popular ? RepositoryCell : TrendingCell
        return <CellComponent
            key={this.props.flag === FLAG_STORAGE.flag_popular ? projectModel.item.id : projectModel.item.fullName}
            projectModel={projectModel}
            onSelect={() => ActionUtils.onSelectRepository({
                flag: FLAG_STORAGE.flag_popular,
                projectModel: projectModel,
                parentComponent: this,
                ...this.props
            })}
            onFavorite={(item, isFavorite) => this.onFavorite(item, isFavorite)}
        />
    }

    render() {
        return <View style={{flex: 1}}>
            <ListView
                dataSource={this.state.dataSource}
                renderRow={(data) => this.renderRow(data)}
                enableEmptySections={true}
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