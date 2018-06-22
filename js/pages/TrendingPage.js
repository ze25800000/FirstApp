import React, {Component} from 'react';
import {
    StyleSheet,
    Navigator,
    Image,
    Text,
    View,
    ListView,
    RefreshControl,
    DeviceEventEmitter,
    TouchableOpacity,
    TextInput
} from 'react-native'
import NavigationBar from '../common/NavigationBar'
import DataRepository, {FLAG_STORAGE} from '../expand/dao/DataRepository'
import ScrollableTabView, {ScrollableTabBar} from 'react-native-scrollable-tab-view'
import TrendingCell from '../common/TrendingCell'
import LanguageDao, {FLAG_LANGUAGE} from '../expand/dao/LanguageDao'
import RepositoryDetail from './RepositoryDetail'
import TimeSpan from '../model/TimeSpan'
import Popover from '../common/Popover'
import ProjectModel from '../model/ProjectModel'
import FavoriteDao from '../expand/dao/FavoriteDao'
import Utils from '../common/util/Utils'

let timeSpanTextArray = [
    new TimeSpan('今 天', 'since=daily'),
    new TimeSpan('本 周', 'since=weekly'),
    new TimeSpan('本 月', 'since=monthly')
]
let favoriteDao = new FavoriteDao(FLAG_STORAGE.flag_trending)
let dataRepository = new DataRepository(FLAG_STORAGE.flag_trending)
const API_URL = 'https://github.com/trending/'
export default class TrendingPage extends Component {
    constructor(props) {
        super(props)
        this.languageDao = new LanguageDao(FLAG_LANGUAGE.flag_language)
        this.state = {
            language: [],
            isVisible: false,
            timeSpan: timeSpanTextArray[0]
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

    showPopover() {
        this.refs.button.measure((ox, oy, width, height, px, py) => {
            this.setState({
                isVisible: true,
                buttonRect: {x: px, y: py, width: width, height: height}
            });
        });
    }

    closePopover() {
        this.setState({
            isVisible: false
        })
    }

    onSelectTimeSpan(timeSpan) {
        this.setState({
            timeSpan: timeSpan,
            isVisible: false
        })
    }

    renderTitleView() {
        return <View>
            <TouchableOpacity
                onPress={() => this.showPopover()}
                ref='button'>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Text
                        style={{
                            fontSize: 18,
                            color: 'white',
                            fontWeight: '400'
                        }}
                    >趋势 {this.state.timeSpan.showText}</Text>
                    <Image
                        style={{width: 12, height: 12}}
                        source={require('../../res/images/ic_spinner_triangle.png')}/>
                </View>
            </TouchableOpacity>
        </View>
    }

    render() {
        let navigationBar =
            <NavigationBar
                titleView={this.renderTitleView()}
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
                {this.state.language.map((result, i, arr) => {
                    let lan = arr[i]
                    return lan.checked ?
                        <TrendingTab key={i}
                                     tabLabel={lan.name}
                                     path={lan.path}
                                     timeSpan={this.state.timeSpan}
                                     {...this.props}>{lan.name}</TrendingTab> : null
                })}
            </ScrollableTabView> : null

        let timeSpanView =
            <Popover
                isVisible={this.state.isVisible}
                fromRect={this.state.buttonRect}
                onClose={() => this.closePopover()}
                placement='bottom'
                contentStyle={{backgroundColor: '#343434', opacity: 0.82}}
            >
                {timeSpanTextArray.map((result, i, arr) => {
                    return <TouchableOpacity key={i}>
                        <Text
                            underlayColor={'transparent'}
                            onPress={() => this.onSelectTimeSpan(arr[i])}
                            style={{fontSize: 18, padding: 8, color: 'white', fontWeight: '400'}}
                        >{arr[i].showText}</Text>
                    </TouchableOpacity>
                })}
            </Popover>

        return <View style={styles.container}>
            {navigationBar}
            {content}
            {timeSpanView}
        </View>
    }
}

class TrendingTab extends Component {
    constructor(props) {
        super(props)
        this.isFavoriteChanged = false
        this.state = {
            dataSource: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}),
            isLoading: false,
            favoriteKeys: []
        }
    }

    componentDidMount() {
        this.loadData(this.props.timeSpan, true)
        this.listenner = DeviceEventEmitter.addListener('favoriteChanged_trending', () => {
            this.isFavoriteChanged = true
        })
    }

    componentWillUnmount() {
        if (this.listenner) this.listenner.remove()
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.timeSpan !== this.props.timeSpan) {
            this.loadData(nextProps.timeSpan)
        } else if (this.isFavoriteChanged) {
            this.isFavoriteChanged = false
            this.getFavoriteKeys()
        }
    }

    onRefresh() {
        this.loadData(this.props.timeSpan)
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


    async loadData(timeSpan, isRefresh) {
        this.updateState({
            isLoading: true
        })
        let url = this.genFetchUrl(timeSpan, this.props.path)
        try {
            let result = await dataRepository.fetchRepository(url)
            this.items = result && result.items ? result.items : result ? result : []
            this.getFavoriteKeys()
            if (!this.items || result && result.update_date && !Utils.checkDate(result.update_date)) {
                this.items = await dataRepository.fetchNetRepository(url)
                this.getFavoriteKeys()
            }
        } catch (e) {
            console.log(e)
            this.updateState({
                isLoading: false
            })
        }
    }

    updateState(dic) {
        if (!this) return
        this.isRender = true
        this.setState(dic)
    }

    onSelect(projectModel) {
        let item = projectModel.item
        this.props.navigator.push({
            title: item.fullName,
            component: RepositoryDetail,
            params: {
                flag: FLAG_STORAGE.flag_trending,
                projectModel: projectModel,
                parentComponent: this,
                ...this.props
            }
        })
    }

    genFetchUrl(timeSpan, category) {
        return API_URL + category + '?' + timeSpan.searchText
    }

    onFavorite(item, isFavorite) {
        if (isFavorite) {
            favoriteDao.saveFavoriteItem(item.fullName, JSON.stringify(item))
        } else {
            favoriteDao.removeFavoriteItem(item.fullName)
        }
    }

    renderRow(projectModel) {
        return <TrendingCell
            onSelect={() => this.onSelect(projectModel)}
            key={projectModel.item.fullName}
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
                    onRefresh={() => this.onRefresh()}
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