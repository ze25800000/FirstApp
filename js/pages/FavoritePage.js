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
import {FLAG_STORAGE} from '../expand/dao/DataRepository'
import ScrollableTabView, {ScrollableTabBar} from 'react-native-scrollable-tab-view'
import RepositoryCell from '../common/RepositoryCell'
import TrendingCell from '../common/TrendingCell'
import ProjectModel from '../model/ProjectModel'
import FavoriteDao from '../expand/dao/FavoriteDao'
import ArrayUtils from '../util/ArrayUtils'
import ActionUtils from '../util/ActionUtils'
import {FLAG_TAB} from './HomePage'
import {MORE_MENU} from '../common/MoreMenu'
import MoreMenu from '../common/MoreMenu'
import ViewUtils from '../util/ViewUtils'
import BaseComponent from './BaseComponent'
import CustomThemePage from './my/CustomTheme'

export default class FavoritePage extends BaseComponent {
    constructor(props) {
        super(props)
        this.state = {
            theme: this.props.theme,
            customThemeViewVisible: false
        }
    }

    renderMoreView() {
        let params = {...this.props, fromPage: FLAG_TAB.flag_popularTab}
        return <MoreMenu
            ref={'moreMenu'}
            {...params}
            menus={[MORE_MENU.Custom_Theme, MORE_MENU.About_Author, MORE_MENU.About]}
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
        let Navigation =
            <NavigationBar
                title={'收藏'}
                style={this.state.theme.styles.navBar}
                rightButton={ViewUtils.getMoreButton(() => this.refs.moreMenu.open())}
                statusBar={statusBar}
            />
        let content =
            <ScrollableTabView
                tabBarBackgroundColor={this.state.theme.themeColor}
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
            {this.renderMoreView()}
            {this.renderCustomThemeView()}
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
            favoriteKeys: [],
            theme: this.props.theme
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
            theme={this.props.theme}
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
                    colors={[this.state.theme.themeColor]}
                    tintColor={[this.state.theme.themeColor]}
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