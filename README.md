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