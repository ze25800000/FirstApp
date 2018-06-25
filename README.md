# 1-5 项目底部导航菜单开发
- [react-native-tab-navigator](https://github.com/happypancake/react-native-tab-navigator)
- 改变底部导航选中的文字颜色
```
selectedTitleStyle={{color: 'red'}}
```
- 为图标着色
```
renderSelectedIcon={() => <Image style={[styles.image, {tintColor: 'red'}]} source={require('./res/images/ic_polular.png')}/>}
```
# 1-6 Navigator的基本使用及页面间数据传递实现
> 一个导航组件
> 进入下一个界面，返回上一个界面
> 传递数据给下一界面，返回数据给上一个界面

- 如何使用Navigator
导入Nagigator->render中返回Navigator->调用Naigator的相关方法
```
<Navigator
    // 指定默认显示界面
    initialRoute={{
        component: Boy
    }}
    // 设置页面跳转的配置
    renderScene={(route, navigator) => {
        // 从route中导入组件
        let Component = route.component;
        // 向组件中传递参数
        return <Component navigator={navigator} {...route.params}/>
    }}
></Navigator>
```
- 跳转到下一级页面
```
<Text style={styles.text}
      onPress={() => {
          // 使用push方法跳转到下一级页面
          this.props.navigator.push({
              // 指定跳转的组件
              component: Girl,
              // 指定向下一级页面传递的参数
              params: {
                  word: '一朵花',
                  // 使用回调函数接受下一级页面传回的参数
                  onCallBack: (word) => {
                      this.setState({
                          word: word
                      })
                  }
              }
          })
      }}
>送给你一朵花</Text>
```
- 下一级页面接受上一级页面传递的参数
```
<Text style={styles.text}>我收到了boy送的{this.props.word}</Text>
```
- 下一级页面向上一级页面传递参数
```
<Text style={styles.text}
      onPress={() => {
          // 调用上一级页面的回调函数，传递参数
          this.props.onCallBack('一盒巧克力')
          // 关闭当前页面
          this.props.navigator.pop()
      }}
>回赠巧克力</Text>
```
# 1-7,8,9 自定义组件NavigationBar
![navigationBar](http://pae9ggjgt.bkt.clouddn.com/navigationBar.jpg)
- 需要引入的组件
```
import React, {Component, PropTypes} from 'react' // PropTypes用来控制默认传入类型
import {
    View,
    Text,
    Image,
    StatusBar, //状态栏
    Platform, // 判断Android或iOS平台
    StyleSheet
} from 'react-native'
```
- 定义常量
```
const NAV_BAR_HEIGHT_ANDROID = 55
const NAV_BAR_HEIGHT_IOS = 44
const STATUS_BAR_HEIGHT = 20 // ios平台需要设置状态栏高度
const StatusBarShape = { // 定义StatusBar默认值类型
    backgroundColor: PropTypes.string,
    barStyle: PropTypes.oneOf(['default', 'light-content', 'dark-content']),
    hidden: PropTypes.bool
}
```
[StatusBar](https://facebook.github.io/react-native/docs/statusbar.html#docsNav)

- 传入参数默认值类型以及默认值
```
// 默认值类型
static propTypes = {
        style: View.propTypes.style, // 用户可以设置整个navagationBar整个样式
        title: PropTypes.string, // 默认值为字符
        titleView: PropTypes.element, // 默认值为元素
        hide: PropTypes.bool, // 默认值为布尔
        leftButton: PropTypes.element,
        rightButton: PropTypes.element,
        statusBar: PropTypes.shape(StatusBarShape) // 使用shape加载默认值
}
// 默认值
static defaultProps = {
    statusBar: {
        barStyle: 'light-content',
        hidden: false
    }
}
```
- 渲染组件
```
render() {
    let status = <View style={styles.statusBar}>
        // 获取传入的配置，如果没传入值，则使用默认值
        <StatusBar {...this.props.statusBar}/>
    </View>
    // 元素的优先级大于字符
    let titleView = this.props.titleView ? this.props.titleView :
        <Text style={styles.title}>{this.props.title}</Text>

    let content = <View style={styles.navBar}>
        // 传入左侧按钮
        {this.props.leftButton}
        <View style={styles.titleViewContainer}>
            {titleView}
        </View>
        // 传入右侧按钮
        {this.props.rightButton}
    </View>

    return (
        // 使用数组接收外部样式
        <View style={[styles.container, this.props.style]}>
            {status}
            {content}
        </View>
    )
}
```
- 判断iOS或者Android平台，来选择不同高度
```
navBar: {
    justifyContent: 'space-between',
    alignItems: 'center',
    // 判断iOS或者Android平台，来选择不同高度
    height: Platform.OS === 'ios' ? NAV_BAR_HEIGHT_IOS : NAV_BAR_HEIGHT_ANDROID,
    flexDirection: 'row'
},
// 当系统为iOS时，设置状态栏高度
statusBar: {
    height: Platform.OS === 'ios' ? STATUS_BAR_HEIGHT : 0
}
```
- 使用NavigationBar组件
```
// 首先import
import NavigationBar from './NavigationBar'

// 封装按钮
renderButton(image) {
    return <TouchableOpacity
        onPress={() => {
            this.props.navigator.pop()
        }}
    >
        <Image style={{width: 22, height: 22, margin: 5}}
               source={image}></Image>
    </TouchableOpacity>
}
// 使用组件
<NavigationBar
    title={'Girl'}
    style={{
        backgroundColor: '#EE6363'
    }}
    leftButton={
        this.renderButton(require('./res/images/ic_arrow_back_white_36pt.png'))
    }
    rightButton={
        this.renderButton(require('./res/images/ic_star.png'))
    }
/>

```
# 4-1 ListView列表、下拉刷新、上拉加载的基本使用
- 首先导入ListView，创建数据源，在state中设置dataSource初始值
```
constructor(props) {
    super(props)
    // 创建数据源
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})
    this.state = {
        // 设置初始值
        dataSource: ds.cloneWithRows(data.result),
        isLoading: true
    }
    this.onLoad()
}
```
- 渲染ListView
```
<ListView
    // 关联dataSource
    dataSource={this.state.dataSource}
    // 为每一行指定显示效果
    renderRow={(item) => this.renderRow(item)}
    // 为每一行设置分隔线或视图
    renderSeparator={(sectionID, rowID, adjacentRowHighlighted) => this.renderSeparator(sectionID, rowID, adjacentRowHighlighted)}
    // 设置底部视图
    renderFooter={() => this.renderFooter()}
    // 使用RefreshControl组件实现下拉刷新
    refreshControl={<RefreshControl
        refreshing={this.state.isLoading}
        onRefresh={() => this.onLoad()}
    />}
/>
```
- 使用toast组件
```
npm i react-native-easy-toast -S

// 引入组件，和常量
import Toast, {DURATION} from 'react-native-easy-toast'

// toast组件放在在最底部
<Toast ref={toast => {
    this.toast = toast
}}/>

// 点击
onPress={() => {
    this.toast.show('你单击了：' + item.fullName, DURATION.LENGTH_LONG)
}}
```

- 使用外部图片
```
<Image
    style={{width: 400, height: 100}}
    source={{uri: 'https://ss0.f=JPG?w=218&h=146&s=03F44522BEB613A318273E650300E06C'}}/>
```

# 4-2 网络编程利器-Fetch的基本使用
[Fetch](https://facebook.github.io/react-native/docs/network.html#using-fetch)
- get请求
```
fetch(url)
    .then(response => response.json())
    .then(result => {
        this.setState({
            result: JSON.stringify(result)
        })
    })
    .catch(error => {
        this.setState({
            result: JSON.stringify(error)
        })
    })
```
- post请求
```
fetch(url, {
    method: 'POST',
    header: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
})
    .then(response => response.json())
    .then(result => {
        this.setState({
            result: JSON.stringify(result)
        })
    })
    .catch(error => {
        this.setState({
            result: JSON.stringify(error)
        })
    })
```

# 4-3 网络编程利器-Fetch的轻量级封装
```
export default class HttpUtils {
    static get(url) {
        return new Promise((resolve, reject) => {
            fetch(url)
                .then(response => response.json())
                .then(result => {
                    resolve(result)
                })
                .catch(error => {
                    reject(error)
                })
        })
    }

    static post(url, data) {
        return new Promise((resolve, reject) => {
            fetch(url, {
                method: 'POST',
                header: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
                .then(response => response.json())
                .then(result => {
                    resolve(result)
                })
                .catch(error => {
                    reject(error)
                })
        })
    }
}
```

# 4-4 项目启动引导流程实现
![启动引导流程图](http://pae9ggjgt.bkt.clouddn.com/4-4-1.app%E5%90%AF%E5%8A%A8%E5%BC%95%E5%AF%BC%E6%B5%81%E7%A8%8B.jpg)

# 5-1 Popular(最热)模块的数据层设计


# 5-2 Popular(最热)模块的列表页面实现-1

- 安装顶部导航滑动组件[react-native-scrollable-tab-view](https://github.com/skv-headless/react-native-scrollable-tab-view)
- 引入组件
```
import ScrollableTabView, {ScrollableTabBar} from 'react-native-scrollable-tab-view'

```
- 使用组件
```
<ScrollableTabView
    renderTabBar={() => <ScrollableTabBar/>}
>
    <PopularTab tabLabel='Java'>JAVA</PopularTab>
    <PopularTab tabLabel='iOS'>IOS</PopularTab>
    <PopularTab tabLabel='Android'>android</PopularTab>
    <PopularTab tabLabel='Javascript'>js</PopularTab>
</ScrollableTabView>
// 必须给最外围标签加flex:1样式，才可以显示
const styles = StyleSheet.create({
    container: {
        flex: 1
    }
})
```
- 封装子组件PopularTab
```
class PopularTab extends Component {
    constructor(props) {
        super(props)
        this.dataRepository = new DataRepository()
        this.state = {
            dataSource: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})
        }
    }

    componentDidMount() {
        this.loadData()
    }

    async loadData() {
        let url = URL + this.props.tabLabel + QUERY_STR
        try {
            let result = await this.dataRepository.fetchNetRepository(url)
            this.setState({
                dataSource: this.state.dataSource.cloneWithRows(result.items)
            })
        } catch (e) {
            console.log(e)
        }
    }

    renderRow(data) {
        return <RepositoryCell data={data}/>
    }

    render() {
        return <View>
            <ListView
                dataSource={this.state.dataSource}
                renderRow={(data) => this.renderRow(data)}
            />
        </View>
    }
}
```

# 5-3 Popular(最热)模块的列表页面实现-2

# 5-4 Popular(最热)模块的列表页面实现-3

# 5-5 [AsyncStorage](https://facebook.github.io/react-native/docs/asyncstorage.html#docsNav)异步数据存储技术解析

```
onSave() {
    AsyncStorage.setItem(KEY, this.text, error => {
        if (!error) {
            this.toast.show('保存成功', DURATION.LENGTH_LONG)
        } else {
            this.toast.show('保存失败', DURATION.LENGTH_LONG)
        }
    })
}

onFetch() {
    AsyncStorage.getItem(KEY, (error, result) => {
        if (!error) {
            if (result) {
                this.toast.show('取出的内容：' + result)
            } else {
                this.toast.show('取出的内容不存在')
            }
        } else {
            this.toast.show('取出失败')
        }
    })
}

onRemove() {
    AsyncStorage.removeItem(KEY, error => {
        if (!error) {
            this.toast.show('删除成功', DURATION.LENGTH_LONG)
        } else {
            this.toast.show('删除失败', DURATION.LENGTH_LONG)
        }
    })
}
```

# 5-6 Popular(最热)模块的自定义标签功能实现-1
![自定义订阅标签](http://pae9ggjgt.bkt.clouddn.com/5-6-1%E8%87%AA%E5%AE%9A%E4%B9%89%E6%A0%87%E7%AD%BE.jpg)
![自定义标签页功能流程](http://pae9ggjgt.bkt.clouddn.com/5-6-2%E8%87%AA%E5%AE%9A%E4%B9%89%E6%A0%87%E7%AD%BE%E9%A1%B5%E5%8A%9F%E8%83%BD%E6%B5%81%E7%A8%8B.jpg)

# 5-7 Popular(最热)模块的自定义标签功能实现-2
# 5-8 Popular(最热)模块的自定义标签功能实现-3
- npm i react-native-chack-box --save
```
<CheckBox
    style={{flex: 1}}
    onClick={() => this.onClick(data)}
    leftText={leftText}
    checkedImage={<Image
        source={require('./images/ic_check_box.png')}/>}
    unCheckedImage={<Image
        source={require('./images/ic_check_box_outline_blank.png')}/>}

/>
```
# 5-9 Popular(最热)模块的自定义标签功能实现-4
# 5-10 Popular(最热)模块的标签排序功能实现-1
![5-10-1](http://pae9ggjgt.bkt.clouddn.com/5-10-1%E6%A0%87%E7%AD%BE%E6%8E%92%E5%BA%8F%E5%8E%9F%E7%90%86%E5%9B%BE.jpg)
- 排序关键方法
```
getSortResult() {
    this.sortResultArray = ArrayUtils.clone(this.dataArray)
    for (let i = 0, l = this.originalCheckedArray.length; i < l; i++) {
        let item = this.originalCheckedArray[i]
        let index = this.dataArray.indexOf(item)
        this.sortResultArray.splice(index, 1, this.state.checkedArray[i])
    }
}
```

- 引入[react-native-sortable-listview](https://github.com/deanmcpherson/react-native-sortable-listview/blob/master/example.js)
```
npm install react-native-sortable-listview --save

import SortableListView from 'react-native-sortable-listview'
// 注意最外层加flex:1样式
<SortableListView
    style={{flex: 1}}
    data={this.state.checkedArray}
    order={Object.keys(this.state.checkedArray)}
    onRowMoved={e => {
        order.splice(e.to, 0, this.state.checkedArray.splice(e.from, 1)[0])
        this.forceUpdate()
    }}
    renderRow={row => <SortCell data={row}/>}
/>
```
# 5-11 Popular(最热)模块的标签排序功能实现-2
# 5-12 Popular(最热)模块的标签移除功能实现
# 5-13 Popular(最热)模块的离线缓存功能实现
![离线缓存](http://pae9ggjgt.bkt.clouddn.com/5-13-1%E7%A6%BB%E7%BA%BF%E7%BC%93%E5%AD%98%E7%9A%84%E7%AD%96%E7%95%A5.jpg)
# 5-14 WebView控件实现简单浏览器
- [WebView](https://facebook.github.io/react-native/docs/webview.html#docsNav)

```
<WebView
    ref={webView => this.webView = webView}
    source={{uri: this.state.url}}
    onNavigationStateChange={e => this.onNavigationStateChange(e)}
/>

onNavigationStateChange(e) {
    this.setState({
        canGoBack: e.canGoBack,
        title: e.title
    })
}

```
# 5-15 Popular(最热)模块的详情页功能实现
- 注意使用{...this.props}专递延展属性，延展属性中包含根中的navagator
```
<PopularPage {...this.props}/>


{this.state.language.map((result, i, arr) => {
    let lan = arr[i]
    return lan.checked ?
        <PopularTab key={i} tabLabel={lan.name} {...this.props}>{lan.name}</PopularTab> : null
})}

```
- 踩坑点：
```
renderRow(data) {
    return <RepositoryCell
        // 不要写成(data) => this.onSelect(data)
        onSelect={() => this.onSelect(data)}
        key={data.id}
        data={data}/>
}

```
# 6-1 Trending(趋势)模块的数据接口实现原理及使用详解

# 6-2 Trending(趋势)模块的数据层设计

# 6-3 Trending(趋势)模块的列表页面实现
- 引入[react-native-htmlview](https://github.com/jsdf/react-native-htmlview)
```
let description = `<p>${data.description}</p>`

<HTMLView
    value={description}
    onLinkPress={(url) => {
    }}
    stylesheet={{
        p: styles.description,
        a: styles.description
    }}
/>
```
# 6-4 Pop弹窗功能实现
- 引入[Popover](https://github.com/jeanregisser/react-native-popover)组件，注意：不要使用npm方式安装，而是直接下载[Popover.js](https://raw.githubusercontent.com/jeanregisser/react-native-popover/master/Popover.js)

- 封装timeSpanTextArray模型
```
export default function TimeSpan(showText, searchText) {
    this.showText = showText
    this.searchText = searchText
}
```
- 在TrendingPage.js中定义
```
let timeSpanTextArray = [
    new TimeSpan('今 天', 'since=daily'),
    new TimeSpan('本 周', 'since=weekly'),
    new TimeSpan('本 月', 'since=monthly')
]
```

- 使用Popover
```
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
```

- 定义navigationBar
```
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
```
- Popview放在render最底部
```
.......
.......

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
```

- 当用户选择时间类型是，使用componentWillReceiveProps接受timeSpan
```

componentWillReceiveProps(nextProps) {
    if (nextProps.timeSpan !== this.props.timeSpan) {
        this.loadData(nextProps.timeSpan)
    }
}

```
# 6-5 Trending(趋势)模块的自定义语言功能实现
- 使用FLAG_LANGUAGE做标识 import {FLAG_LANGUAGE} from '../../expand/dao/LanguageDao'
- 传入flag标识
```
<Text
    style={styles.tips}
    onPress={() => {
        this.props.navigator.push({
            component: CustomKeyPage,
            params: {
                ...this.props,
                flag: FLAG_LANGUAGE.flag_key
            }
        })
    }}
>自定义标签</Text>
```

- 根据传人的flag，加载不同的数据

```
componentDidMount() {
    this.languageDao = new LanguageDao(this.props.flag)
    this.loadData()
}
```
# 6-6 Trending(趋势)模块的自定义语言排序功能实现
# 7-1 为Popular(最热)模块的列表页添加收藏功能-1
# 7-2 为Popular(最热)模块的列表页添加收藏功能-2
- 点击子组件向父组件传递回调方法
```
// 子组件
onPressFavorite() {
    this.setFavoriteState(!this.state.isFavorite)
    this.props.onFavorite(this.props.projectModel.item, !this.state.isFavorite)
}
```
```
// 父组件接受回调方法
renderRow(projectModel) {
    return <RepositoryCell
        onSelect={() => this.onSelect(projectModel)}
        key={projectModel.item.id}
        projectModel={projectModel}
        // 接受子组件的回调方法 和 参数
        onFavorite={(item, isFavorite) => this.onFavorite(item, isFavorite)}
    />
}
```
# 7-3 Favorite(收藏)模块的收藏状态数据DAO层设计
# 7-4 Favarite(收藏)模块的数据收藏状态实时更新
# 7-5 为Trending(趋势)模块的列表页添加收藏功能
# 7-6 为Popular(最热)与Trending(趋势)模块的详情页添加收藏的功能
# 7-7 Favorite(收藏)模块列表页面基本实现与用户所收藏的项目数据获取
- AsyncStorage.multiGet获取所有本地存储数据

```
getAllItems() {
    return new Promise((resolve, reject) => {
        this.getFavoriteKeys().then(keys => {
            let items = []
            if (keys) {
                AsyncStorage.multiGet(keys, (error, stores) => {
                    try {
                        stores.map((result, i, store) => {
                            let value = store[i][0]
                            if (value) items.push(value)
                        })
                        resolve(items)
                    } catch (e) {
                        reject(e)
                    }
                })
            } else {
                resolve(items)
            }
        })
            .catch(error => {
                reject(error)
            })
    })
}

```
# 7-8 Favorite(收藏)模块列表页面具体实现-1
# 7-9 Favorite(收藏)模块列表页面具体实现-2
# 8-1 My(我的)模块分组列表页面实现-1
# 8-2 My(我的)模块分组列表页面实现-2
# 8-3 My(我的)模块分组列表页面实现-3
# 8-4 My(我的)模块项目介绍页面简单实现（parallar-scroll-view）-1
- 安装react-native-parallax-scroll-view，0.19.0版本，其他版本报错
```
 "react-native-parallax-scroll-view": "^0.19.0",
```
# 8-5 My(我的)模块项目介绍页面简单实现（parallar-scroll-view）-2
# 8-6 My(我的)模块项目介绍页面复用代码提取技巧
# 8-7 My(我的)模块意见反馈，项目官网展示功能实现
# 8-8 My(我的)模块项目介绍数据请求工具开发（RepositoryUtil）-1
# 8-9 My(我的)模块项目介绍数据请求工具开发（RepositoryUtil）-2
- Map的使用
```
let itemMap = new Map()

updateData(k, v) {
    itemMap.set(k, v)
    let arr = []
    for (let value of itemMap.values()) {
        arr.push(value)
    }
}
```
# 8-10 My(我的)模块项目介绍数据展示-1
# 8-11 My(我的)模块项目介绍数据展示-2
# 8-12 My(我的)模块关于作者页面实现(自定义可扩展列表)-1
# 8-13 My(我的)模块关于作者页面实现-2
# 9-1 带搜索的NavBar实现-1
# 9-2 带搜索的NavBar实现-2
# 9-3 搜索数据显示与onFavorite()方法的提取-1
# 9-4 搜索数据显示与onFavorite()方法的提取-2
- 展示加载进度[ActivityIndicator](https://facebook.github.io/react-native/docs/activityindicator.html#docsNav)
```
let indicatorView = this.state.isLoading ?
    <ActivityIndicator
        size='large'
        style={styles.centering}
        animating={this.state.isLoading}
    /> : null
```

- 获取设备宽高[Dimensions](https://facebook.github.io/react-native/docs/dimensions.html#docsNav)
```
const {height, width} = Dimensions.get('window')
```
# 9-6 为Search（搜索）模块添加进度条与底部按钮-2
# 9-7 添加返回首页数据刷新功能
# 9-8 为Promise插上翅膀之可取消的异步任务
- 封装promise
```
export default function makeCancelable(promise) {
    let hasCanceled_ = false
    const wrappedPromise = new Promise((reolve, reject) => {
        promise.then((val) =>
            hasCanceled_ ? reject({isCanceled: true}) : reolve(val)
        )
        promise.catch(error =>
            hasCanceled_ ? reject({isCanceled: true}) : reject(error)
        )
    })
    return {
        promise: wrappedPromise,
        cancel() {
            hasCanceled_ = true
        }
    }
}
```
- 调用这个promise
```
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

```
- 点击取消
```
this.cancelable && this.cancelable.cancel()

```
# 10-1 可配置菜单的实现-1
# 10-2 可配置菜单的实现-2