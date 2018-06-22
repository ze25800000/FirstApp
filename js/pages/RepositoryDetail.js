import React, {Component} from 'react';
import {
    StyleSheet,
    Navigator,
    Text,
    View,
    WebView,
    TouchableOpacity,
    Image,
    DeviceEventEmitter
} from 'react-native'
import NavigationBar from '../common/NavigationBar'
import ViewUtils from '../common/util/ViewUtils'
import FavoriteDao from '../expand/dao/FavoriteDao'

const TRENDING_URL = 'https://github.com/'
export default class RepositoryDetail extends Component {
    constructor(props) {
        super(props)
        this.url = this.props.projectModel.item.html_url ? this.props.projectModel.item.html_url : TRENDING_URL + this.props.projectModel.item.fullName
        let title = this.props.projectModel.item.full_name ? this.props.projectModel.item.full_name : this.props.projectModel.item.fullName
        this.favoriteDao = new FavoriteDao(this.props.flag)
        this.state = {
            url: this.url,
            title: title,
            canGoBack: false,
            isFavorite: this.props.projectModel.isFavorite,
            favoriteIcon: this.props.projectModel.isFavorite ?
                require('../../res/images/ic_star.png') : require('../../res/images/ic_star_navbar.png')
        }
    }

    goBack() {
        if (this.state.canGoBack) {
            this.webView.goBack()
        } else {
            this.props.navigator.pop()
        }
    }

    onNavigationStateChange(e) {
        this.setState({
            canGoBack: e.canGoBack
        })
    }

    setFavoriteState(isFavorite) {
        this.props.projectModel.isFavorite = isFavorite
        this.setState({
            isFavorite: isFavorite,
            favoriteIcon: isFavorite ?
                require('../../res/images/ic_star.png') : require('../../res/images/ic_star_navbar.png')
        })
    }

    onRightButtonClick() {
        let projectModel = this.props.projectModel
        this.setFavoriteState(projectModel.isFavorite = !projectModel.isFavorite)
        let key = projectModel.item.fullName ? projectModel.item.fullName : projectModel.item.id.toString()
        if (projectModel.isFavorite) {
            this.favoriteDao.saveFavoriteItem(key, JSON.stringify(projectModel.item))
        } else {
            this.favoriteDao.removeFavoriteItem(key)
        }
    }


    renderRightButton() {
        let projectModel = this.props.projectModel
        return <TouchableOpacity
            onPress={() => this.onRightButtonClick()}
        >
            <Image
                style={{width: 20, height: 20, marginRight: 10}}
                source={this.state.favoriteIcon}
            />
        </TouchableOpacity>
    }

    render() {
        return (
            <View style={{flex: 1}}>
                <NavigationBar
                    title={this.state.title}
                    leftButton={ViewUtils.getLeftButton(() => this.goBack())}
                    rightButton={this.renderRightButton()}
                />
                <WebView
                    ref={webView => this.webView = webView}
                    source={{uri: this.state.url}}
                    onNavigationStateChange={e => this.onNavigationStateChange(e)}
                    startInLoadingState={true}
                />
            </View>
        )
    }
}
const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        margin: 10
    },
    tips: {fontSize: 20},
    input: {height: 40, flex: 1, borderWidth: 1, margin: 2}
})