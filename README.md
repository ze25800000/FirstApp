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