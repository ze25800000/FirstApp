import React, {Component} from 'react';
import {
    StyleSheet,
    Navigator,
    Text,
    View,
    Image,
    ListView,
    RefreshControl,
    DeviceEventEmitter,
    TouchableOpacity,
    TextInput
} from 'react-native'
import NavigationBar from '../common/NavigationBar'
import DataRepository, {FLAG_STORAGE} from '../expand/dao/DataRepository'
import ScrollableTabView, {ScrollableTabBar} from 'react-native-scrollable-tab-view'
import RepositoryCell from '../common/RepositoryCell'
import LanguageDao, {FLAG_LANGUAGE} from '../expand/dao/LanguageDao'
import ProjectModel from '../model/ProjectModel'
import FavoriteDao from '../expand/dao/FavoriteDao'
import Utils from '../util/Utils'
import SearchPage from './SearchPage'
import ActionUtils from '../util/ActionUtils'
import ViewUtils from '../util/ViewUtils'
import MoreMenu, {MORE_MENU} from '../common/MoreMenu'
import {FLAG_TAB} from './HomePage'
import BaseComponent from './BaseComponent'
import CustomThemePage from './my/CustomTheme'

const URL = 'https://api.github.com/search/repositories?q='
const QUERY_STR = '&sort=stars'
let favoriteDao = new FavoriteDao(FLAG_STORAGE.flag_popular)

export default class PopularPage extends BaseComponent {
    constructor(props) {
        super(props)
        this.languageDao = new LanguageDao(FLAG_LANGUAGE.flag_key)
        this.state = {
            language: [],
            theme: this.props.theme,
            customThemeViewVisible: false
        }
        this.loadLanguage()
    }

    async loadLanguage() {
        let result = await this.languageDao.fetch()
        try {
            this.setState({
                language: result
            })
        } catch (e) {
            console.log(e)
        }
    }

    renderRightButton() {
        return <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <TouchableOpacity
                onPress={() => {
                    this.props.navigator.push({
                        component: SearchPage,
                        params: {
                            ...this.props
                        }
                    })
                }}
            >
                <View style={{padding: 5, marginRight: 8}}>
                    <Image
                        style={{height: 24, width: 24}}
                        source={require('../../res/images/ic_search_white_48pt.png')}
                    />
                </View>
            </TouchableOpacity>
            {ViewUtils.getMoreButton(() => this.refs.moreMenu.open())}
        </View>
    }

    renderMoreView() {
        let params = {...this.props, fromPage: FLAG_TAB.flag_popularTab}
        return <MoreMenu
            ref={'moreMenu'}
            {...params}
            menus={[MORE_MENU.Custom_Key, MORE_MENU.Sort_Key, MORE_MENU.Remove_Key, MORE_MENU.Custom_Theme, MORE_MENU.About_Author, MORE_MENU.About]}
            anchorView={() => this.refs.moreMenuButton}
            onMoreMenuSelect={(e) => {
                if (e === MORE_MENU.Custom_Theme) {
                    this.setState({
                        customThemeViewVisible: true
                    })
                }
            }}
        />
    }
    renderCustomThemeView() {
        return (
            <CustomThemePage
                visible={this.state.customThemeViewVisible}
                {...this.props}
                onClose={() => this.setState({customThemeViewVisible: false})}
            />
        )
    }
    render() {
        let statusBar = {
            backgroundColor: this.state.theme.themeColor
        }
        let navigationBar =
            <NavigationBar
                title={'最热'}
                rightButton={this.renderRightButton()}
                style={this.state.theme.styles.navBar}
                statusBar={statusBar}
            />
        let content = this.state.language.length > 0 ?
            <ScrollableTabView
                tabBarBackgroundColor={this.state.theme.themeColor}
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
            {navigationBar}
            {content}
            {this.renderMoreView()}
            {this.renderCustomThemeView()}
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
            favoriteKeys: [],
            theme: this.props.theme
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

    componentWillReceiveProps(nextProps) {
        if (this.isFavoriteChanged) {
            this.isFavoriteChanged = false
            this.getFavoriteKeys()
        } else if (nextProps.theme !== this.state.theme) {
            this.updateState({theme: nextProps.theme})
            this.flushFavoriteState()
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
            if (!this.items || result && result.update_date && !Utils.checkDate(result.update_date)) {
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

    renderRow(projectModel) {
        return <RepositoryCell
            onSelect={() => ActionUtils.onSelectRepository({
                flag: FLAG_STORAGE.flag_popular,
                projectModel: projectModel,
                parentComponent: this,
                ...this.props
            })}
            theme={this.state.theme}
            key={projectModel.item.id}
            projectModel={projectModel}
            onFavorite={(item, isFavorite) => ActionUtils.onFavorite(favoriteDao, item, isFavorite)}
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
                    colors={[this.state.theme.themeColor]}
                    tintColor={this.state.theme.themeColor}
                    title={'Loading...'}
                    titleColor={this.state.theme.themeColor}
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