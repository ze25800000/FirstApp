import React, {Component} from 'react';
import {
    StyleSheet,
    Navigator,
    Text,
    View,
    RefreshControl,
    DeviceEventEmitter,
    TouchableOpacity,
    Platform,
    ListView,
    TextInput
} from 'react-native'
import NavigationBar from '../common/NavigationBar'
import ViewUtils from '../common/util/ViewUtils'
import GlobalStyles from '../../res/styles/GlobalStyles'
import Toast, {DURATION} from 'react-native-easy-toast'
import ProjectModel from '../model/ProjectModel'
import Utils from '../common/util/Utils'
import RepositoryCell from '../common/RepositoryCell'
import {FLAG_STORAGE} from '../expand/dao/DataRepository'
import FavoriteDao from '../expand/dao/FavoriteDao'
import RepositoryDetail from './RepositoryDetail'

const API_URL = 'https://api.github.com/search/repositories?q='
const QUERY_STR = '&sort=stars'
export default class PopularPage extends Component {
    constructor(props) {
        super(props)
        this.favoriteDao = new FavoriteDao(FLAG_STORAGE.flag_popular)
        this.favoritKeys = []
        this.state = {
            rightButtonText: '搜索',
            isLoading: false,
            dataSource: new ListView.DataSource({
                rowHasChanged: (r1, r2) => r1 !== r2
            })
        }
    }

    loadData() {
        this.updateState({
            isLoading: true
        })
        fetch(this.genFetchUrl(this.inputKey))
            .then(response => response.json())
            .then(responseDate => {
                if (!this || !responseDate || !responseDate.items || responseDate.items.length === 0) {
                    this.toast.show(this.inputKey + '没有结果', DURATION.LENGTH_LONG)
                    this.updateState({isLoading: false, rightButton: '搜索'})
                    return
                }
                this.items = responseDate.items
                this.getFavoriteKeys()

            }).catch(e => {
            this.updateState({
                isLoading: false,
                rightButtonText: '搜索'
            })
        })
    }

    async getFavoriteKeys() {
        try {
            let keys = await this.favoriteDao.getFavoriteKeys()
            if (keys) this.favoritKeys = keys || []
            this.flushFavoriteState()
        } catch (e) {
            this.flushFavoriteState()
        }
    }

    flushFavoriteState() {
        let projectModels = []
        let items = this.items
        for (let i = 0, len = items.length; i < len; i++) {
            projectModels.push(new ProjectModel(items[i], Utils.checkFavorite(items[i], this.favoritKeys)))
        }
        this.updateState({
            isLoading: false,
            dataSource: this.getDataSource(projectModels),
            rightButtonText: '搜索'
        })
    }

    getDataSource(data) {
        return this.state.dataSource.cloneWithRows(data)
    }

    genFetchUrl(key) {
        return API_URL + key + QUERY_STR
    }

    updateState(dic) {
        this.setState(dic)
    }

    onBackPress() {
        this.refs.input.blur()
        this.props.navigator.pop()
    }

    onRightButtonClick() {
        if (this.state.rightButtonText === '搜索') {
            this.loadData()
            this.updateState({
                rightButtonText: '取消'
            })
        } else {
            this.updateState({
                rightButtonText: '搜索',
                isLoading: false
            })
        }
    }

    renderNavBar() {
        let backButton = ViewUtils.getLeftButton(() => this.onBackPress())
        let inputView = <TextInput
            ref={'input'}
            onChangeText={text => this.inputKey = text}
            underlineColorAndroid={'white'}
            style={styles.textInput}
        >

        </TextInput>
        let rightButton =
            <TouchableOpacity
                onPress={() => {
                    this.onRightButtonClick()
                    this.refs.input.blur()
                }}
            >
                <View style={{marginRight: 10}}>
                    <Text style={styles.title}>{this.state.rightButtonText}</Text>
                </View>
            </TouchableOpacity>
        return <View
            style={{
                backgroundColor: '#2196f3',
                flexDirection: 'row',
                alignItems: 'center',
                height: (Platform.OS === 'ios') ? GlobalStyles.nav_bar_height_ios : GlobalStyles.nav_bar_height_android
            }}
        >
            {backButton}
            {inputView}
            {rightButton}
        </View>
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
            this.favoriteDao.saveFavoriteItem(item.id.toString(), JSON.stringify(item))
        } else {
            this.favoriteDao.removeFavoriteItem(item.id.toString())
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
        let statusBar = null
        if (Platform.OS === 'ios') {
            statusBar = <View
                style={[styles.statusBar, {backgroundColor: '#2196F3'}]}
            />
        }
        let listView =
            <ListView
                dataSource={this.state.dataSource}
                renderRow={e => this.renderRow(e)}
            />

        return <View style={GlobalStyles.root_container}>
            {statusBar}
            {this.renderNavBar()}
            {listView}
            <Toast ref={toast => this.toast = toast}/>
        </View>
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'stretch'
    },
    statusBar: {
        height: 20
    },
    textInput: {
        flex: 1,
        height: (Platform.OS === 'ios') ? 30 : 40,
        borderWidth: (Platform.OS === 'ios') ? 0.4 : 0,
        borderColor: 'white',
        alignSelf: 'center',
        paddingLeft: 5,
        marginRight: 10,
        marginLeft: 5,
        borderRadius: 3,
        opacity: 0.7,
        color: 'white'
    },
    title: {
        fontSize: 18,
        color: 'white',
        fontWeight: '500'
    }
})