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