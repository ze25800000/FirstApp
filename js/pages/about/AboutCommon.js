import React, {Component} from 'react';
import {
    StyleSheet,
    Navigator,
    Text,
    View,
    ScrollView,
    ListView,
    TouchableHighlight,
    Platform,
    Dimensions,
    Image
} from 'react-native'
import ParallaxScrollView from 'react-native-parallax-scroll-view'
import ViewUtils from '../../common/util/ViewUtils'
import FavoriteDao from '../../expand/dao/FavoriteDao'
import {FLAG_STORAGE} from '../../expand/dao/DataRepository'
import Utils from '../../common/util/Utils'
import ProjectModel from '../../model/ProjectModel'
import RepositoryCell from '../../common/RepositoryCell'
import RepositoryDetail from '../RepositoryDetail'
import RepositoryUtils from '../../expand/dao/RepositoryUtils'

let favoriteDao = new FavoriteDao(FLAG_STORAGE.flag_popular)

export let FLAG_ABOUT = {flag_about: 'about', flag_about_me: 'about_me'}
export default class AboutCommon {
    constructor(props, updateState, flag_about, config) {
        this.props = props
        this.updateState = updateState
        this.flag_about = flag_about
        this.config = config
        this.repositories = []
        this.favoriteKeys = null
        this.favoriteDao = new FavoriteDao(FLAG_STORAGE.flag_popular)
        this.repositoryUtils = new RepositoryUtils(this)
    }

    componentDidMount() {
        if (this.flag_about === FLAG_ABOUT.flag_about) {
            this.repositoryUtils.fetchRepository(this.config.info.currentRepoUrl)
        } else {
            let urls = []
            let items = this.config.items
            for (let i = 0, l = items.length; i < l; i++) {
                urls.push(this.config.info.url + items[i])
            }
            this.repositoryUtils.fetchRepositories(urls)
        }
    }

    onNotifyDataChanged(items) {
        this.updateFavorite(items)
    }

    async updateFavorite(repositories) {
        if (repositories) this.repositories = repositories
        if (!this.repositories) return
        if (!this.favoriteKeys) {
            this.favoriteKeys = await  this.favoriteDao.getFavoriteKeys()
        }
        let projectModels = []
        let items = this.repositories
        for (let i = 0, len = items.length; i < len; i++) {
            let data = items[i]
            data = data.item ? data.item : data
            projectModels.push({
                isFavorite: Utils.checkFavorite(data, this.favoriteKeys ? this.favoriteKeys : []),
                item: data.item ? data.item : data
            })
        }
        this.updateState({
            projectModel: projectModels
        })
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

    renderRepository(projectModels) {
        if (!projectModels || projectModels.length === 0) return null
        let views = []
        for (let i = 0, l = projectModels.length; i < l; i++) {
            let projectModel = projectModels[i]
            views.push(
                <RepositoryCell
                    onSelect={() => this.onSelect(projectModel)}
                    key={projectModel.item.id}
                    projectModel={projectModel}
                    onFavorite={(item, isFavorite) => this.onFavorite(item, isFavorite)}
                />
            )
        }
        return views
    }

    getParallaxRenderConfig(params) {
        let config = {}
        config.renderBackground = () => (
            <View key="background">
                <Image source={{
                    uri: params.backgroundImg,
                    width: window.width,
                    height: PARALLAX_HEADER_HEIGHT
                }}/>
                <View style={{
                    position: 'absolute',
                    top: 0,
                    width: window.width,
                    backgroundColor: 'rgba(0,0,0,.4)',
                    height: PARALLAX_HEADER_HEIGHT
                }}/>
            </View>
        )
        config.renderForeground = () => (
            <View key="parallax-header" style={styles.parallaxHeader}>
                <Image style={styles.avatar} source={{
                    uri: params.avatar,
                    width: AVATAR_SIZE,
                    height: AVATAR_SIZE
                }}/>
                <Text style={styles.sectionSpeakerText}>
                    {params.name}
                </Text>
                <Text style={styles.sectionTitleText}>
                    {params.description}
                </Text>
            </View>
        )
        config.renderStickyHeader = () => (
            <View key="sticky-header" style={styles.stickySection}>
                <Text style={styles.stickySectionText}>{params.name}</Text>
            </View>
        )
        config.renderFixedHeader = () => (
            <View key="fixed-header" style={styles.fixedSection}>
                {ViewUtils.getLeftButton(() => this.props.navigator.pop())}
            </View>
        )
        return config
    }

    renderView(contentView, params) {
        let renderConfig = this.getParallaxRenderConfig(params)
        return (
            <ParallaxScrollView
                headerBackgroundColor="#2196F3"
                backgroundColor='#2196F3'
                stickyHeaderHeight={STICKY_HEADER_HEIGHT}
                parallaxHeaderHeight={PARALLAX_HEADER_HEIGHT}
                backgroundSpeed={10}
                {...renderConfig}
            >
                {contentView}
            </ParallaxScrollView>
        );
    }
}

const window = Dimensions.get('window');

const AVATAR_SIZE = 120;
const ROW_HEIGHT = 60;
const PARALLAX_HEADER_HEIGHT = 350;
const STICKY_HEADER_HEIGHT = 70;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black'
    },
    background: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: window.width,
        height: PARALLAX_HEADER_HEIGHT
    },
    stickySection: {
        height: STICKY_HEADER_HEIGHT,
        paddingTop: (Platform.OS === 'ios') ? 20 : 0,
        justifyContent: 'center',
        alignItems: 'center'
    },
    stickySectionText: {
        color: 'white',
        fontSize: 20,
        margin: 10
    },
    fixedSection: {
        position: 'absolute',
        bottom: 0,
        right: 10,
        left: 0,
        top: 0,
        paddingRight: 8,
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: (Platform.OS === 'ios') ? 20 : 0,
        justifyContent: 'space-between'
    },
    fixedSectionText: {
        color: '#999',
        fontSize: 20
    },
    parallaxHeader: {
        alignItems: 'center',
        flex: 1,
        flexDirection: 'column',
        paddingTop: 100
    },
    avatar: {
        marginBottom: 10,
        borderRadius: AVATAR_SIZE / 2
    },
    sectionSpeakerText: {
        color: 'white',
        fontSize: 24,
        paddingVertical: 5
    },
    sectionTitleText: {
        color: 'white',
        fontSize: 18,
        paddingVertical: 5
    },
    row: {
        overflow: 'hidden',
        paddingHorizontal: 10,
        height: ROW_HEIGHT,
        backgroundColor: 'white',
        borderColor: '#ccc',
        borderBottomWidth: 1,
        justifyContent: 'center'
    },
    rowText: {
        fontSize: 20
    }
});
