import React, {Component} from 'react';
import {
    StyleSheet,
    Navigator,
    Text,
    View,
    RefreshControl,
    ActivityIndicator,
    DeviceEventEmitter,
    TouchableOpacity,
    Platform,
    ListView,
    TextInput
} from 'react-native'
import ViewUtils from '../util/ViewUtils'
import GlobalStyles from '../../res/styles/GlobalStyles'
import Toast, {DURATION} from 'react-native-easy-toast'
import ProjectModel from '../model/ProjectModel'
import Utils from '../util/Utils'
import RepositoryCell from '../common/RepositoryCell'
import {FLAG_STORAGE} from '../expand/dao/DataRepository'
import FavoriteDao from '../expand/dao/FavoriteDao'
import ActionUtils from '../util/ActionUtils'
import LanguageDao, {FLAG_LANGUAGE} from '../expand/dao/LanguageDao'
import {ACTION_HOME} from './HomePage'
import makeCancelable from '../util/Cancelable'
import BackPressComponent from '../common/BackPressComponent'

const API_URL = 'https://api.github.com/search/repositories?q='
const QUERY_STR = '&sort=stars'
export default class PopularPage extends Component {
    constructor(props) {
        super(props)
        this.backPress = new BackPressComponent({backPress: (e) => this.onBackPress(e)})
        this.favoriteDao = new FavoriteDao(FLAG_STORAGE.flag_popular)
        this.languageDao = new LanguageDao(FLAG_LANGUAGE.flag_key)
        this.isKeyChanged = false
        this.keys = []
        this.favoritKeys = []
        this.state = {
            rightButtonText: '搜索',
            isLoading: false,
            showBottomButton: false,
            dataSource: new ListView.DataSource({
                rowHasChanged: (r1, r2) => r1 !== r2
            })
        }
    }

    componentDidMount() {
        this.backPress.componentDidMount()
        this.initKeys()
    }

    componentWillUnmount() {
        if (this.isKeyChanged) {
            DeviceEventEmitter.emit('ACTION_HOME', ACTION_HOME.A_RESTART)
        }
        this.backPress.componentWillUnmount()
    }

    saveKey() {
        let key = this.inputKey
        if (this.checkKeyIsExist(this.keys, key)) {
            this.toast.show(key + '已经存在', DURATION.LENGTH_LONG)
        } else {
            key = {
                "path": key,
                "name": key,
                "checked": true
            }
            this.keys.unshift(key)
            this.languageDao.save(this.keys)
            this.toast.show(key.name + '保存成功', DURATION.LENGTH_LONG)
            this.isKeyChanged = true
        }
    }

    async initKeys() {
        this.keys = await this.languageDao.fetch()
    }

    checkKeyIsExist(keys, key) {
        for (let i = 0, len = keys.length; i < len; i++) {
            if (key.toLowerCase() === keys[i].name.toLowerCase()) return true
        }
        return false
    }

    loadData() {
        this.updateState({
            isLoading: true
        })
        this.cancelable = makeCancelable(fetch(this.genFetchUrl(this.inputKey)))
        this.cancelable.promise
            .then(response => response.json())
            .then(responseDate => {
                if (!this || !responseDate || !responseDate.items || responseDate.items.length === 0) {
                    this.toast.show(this.inputKey + '没有结果', DURATION.LENGTH_LONG)
                    this.updateState({isLoading: false, rightButton: '搜索'})
                    return
                }
                this.items = responseDate.items
                this.getFavoriteKeys()
                if (!this.checkKeyIsExist(this.keys, this.inputKey)) {
                    this.updateState({showBottomButton: true})
                } else {
                    this.updateState({showBottomButton: false})
                }
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
        return true
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
            this.cancelable && this.cancelable.cancel()
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
                backgroundColor: this.props.theme.themeColor,
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

    renderRow(projectModel) {
        return <RepositoryCell
            onSelect={() => ActionUtils.onSelectRepository({
                flag: FLAG_STORAGE.flag_popular,
                projectModel: projectModel,
                parentComponent: this,
                ...this.props
            })}
            key={projectModel.item.id}
            projectModel={projectModel}
            theme={this.props.theme}
            onFavorite={(item, isFavorite) => ActionUtils.onFavorite(this.favoriteDao, item)}
        />
    }

    render() {
        let statusBar = null
        if (Platform.OS === 'ios') {
            statusBar = <View
                style={[styles.statusBar, this.props.theme.styles.navBar]}
            />
        }
        let listView = !this.state.isLoading ?
            <ListView
                dataSource={this.state.dataSource}
                renderRow={e => this.renderRow(e)}
            /> : null
        let indicatorView = this.state.isLoading ?
            <ActivityIndicator
                size='large'
                style={styles.centering}
                animating={this.state.isLoading}
            /> : null
        let resultView =
            <View style={{flex: 1}}>
                {indicatorView}
                {listView}
            </View>
        let bottomButton = this.state.showBottomButton ?
            <TouchableOpacity
                onPress={() => {
                    this.saveKey()
                }}
                style={[styles.bottomButton, {backgroundColor: this.props.theme.themeColor}]}
            >
                <View style={{justifyContent: 'center'}}>
                    <Text style={styles.title}>添加标签</Text>
                </View>
            </TouchableOpacity> : null
        return <View style={GlobalStyles.root_container}>
            {statusBar}
            {this.renderNavBar()}
            {resultView}
            {bottomButton}
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
    },
    centering: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1
    },
    bottomButton: {
        alignItems: 'center',
        justifyContent: 'center',
        opacity: 0.9,
        height: 40,
        position: 'absolute',
        left: 10,
        right: 10,
        top: GlobalStyles.window_height - 75,
        borderRadius: 3
    }
})