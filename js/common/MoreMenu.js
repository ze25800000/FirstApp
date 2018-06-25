import React, {Component, PropTypes} from 'react'
import {
    View,
    Text,
    Image,
    StatusBar,
    TouchableOpacity,
    Platform,
    Linking,
    StyleSheet
} from 'react-native'
import Popover from '../common/Popover'
import SortKeyPage from '../pages/my/SortKeyPage'
import CustomKeyPage from '../pages/my/CustomKeyPage'
import AboutPage from '../pages/about/AboutPage'
import {FLAG_LANGUAGE} from '../expand/dao/LanguageDao'
import AboutMePage from '../pages/about/AboutMePage'


export const MORE_MENU = {
    Custom_Language: '自定义语言',
    Sort_Language: '语言排序',
    Custom_Theme: '自定义主题',
    Custom_Key: '自定义标签',
    Sort_Key: '排序标签',
    Remove_Key: '标签移除',
    About_Author: '关于作者',
    About: '关于',
    WebSite: 'WebSite',
    Feedback: '反馈',
    Share: '分享'
}
export default class MoreMenu extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isVisible: false,
            buttonRect: {}
        }
    }

    static propTypes = {
        contentStyle: View.propTypes.style,
        menus: PropTypes.array.isRequired,
        anchorView: PropTypes.func
    }

    open() {
        this.showPopover()
    }

    showPopover() {
        if (!this.props.anchorView) return
        let anchorView = this.props.anchorView()
        anchorView.measure((ox, oy, width, height, px, py) => {
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

    onMoreMenuSelect(tab) {
        this.closePopover()
        let TargetComponent, params = {...this.props, menuType: tab}
        switch (tab) {
            case MORE_MENU.Custom_Language:
                TargetComponent = CustomKeyPage;
                params.flag = FLAG_LANGUAGE.flag_language;
                break;
            case MORE_MENU.Custom_Key:
                TargetComponent = CustomKeyPage;
                params.flag = FLAG_LANGUAGE.flag_key;
                break;
            case MORE_MENU.Remove_Key:
                TargetComponent = CustomKeyPage;
                params.flag = FLAG_LANGUAGE.flag_key;
                params.isRemoveKey = true
                break;
            case MORE_MENU.Sort_Language:
                TargetComponent = SortKeyPage;
                params.flag = FLAG_LANGUAGE.flag_language;
                break;
            case MORE_MENU.Sort_Key:
                TargetComponent = SortKeyPage;
                params.flag = FLAG_LANGUAGE.flag_key;
                break;
            case MORE_MENU.Custom_Theme:
                break;
            case MORE_MENU.About_Author:
                TargetComponent = AboutMePage;
                break;
            case MORE_MENU.About:
                TargetComponent = AboutPage;
                break;
            case MORE_MENU.Feedback:
                let url = 'mailto:ze258100000@sina.com'
                Linking.canOpenURL(url).then(supported => {
                    if (!supported) {
                        console.log('Can\'t handle url: ' + url);
                    } else {
                        return Linking.openURL(url);
                    }
                }).catch(err => console.error('An error occurred', err));
                break;
            case MORE_MENU.Share:
                break;
        }
        if (TargetComponent) {
            this.props.navigator.push({
                component: TargetComponent,
                params: params
            })
        }
    }

    renderMoreView() {
        return <Popover
            isVisible={this.state.isVisible}
            fromRect={this.state.buttonRect}
            onClose={() => this.closePopover()}
            placement='bottom'
            contentMarginRight={20}
            contentStyle={{backgroundColor: '#343434', opacity: 0.82}}
        >
            {this.props.menus.map((result, i, arr) => {
                return <TouchableOpacity
                    onPress={() => this.onMoreMenuSelect(arr[i])}
                    key={i}
                >
                    <Text
                        underlayColor={'transparent'}
                        style={{fontSize: 18, padding: 8, color: 'white', fontWeight: '400'}}
                    >{arr[i]}</Text>
                </TouchableOpacity>
            })}
        </Popover>
    }

    render() {
        return this.renderMoreView()
    }
}