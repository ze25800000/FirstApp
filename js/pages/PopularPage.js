import React, {Component} from 'react';
import {
    StyleSheet,
    Navigator,
    Text,
    View,
    ListView,
    RefreshControl,
    TextInput
} from 'react-native'
import NavigationBar from '../common/NavigationBar'
import DataRepository from '../expand/dao/DataRepository'
import ScrollableTabView, {ScrollableTabBar} from 'react-native-scrollable-tab-view'
import RepositoryCell from '../common/RepositoryCell'

const URL = 'https://api.github.com/search/repositories?q='
const QUERY_STR = '&sort=stars'
export default class PopularPage extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        return <View style={styles.container}>
            <NavigationBar
                title={'最热'}
                statusBar={{
                    backgroundColor: '#2196F3'
                }}
            />
            <ScrollableTabView
                tabBarBackgroundColor={'#2196F3'}
                tabBarActiveTextColor={'#fff'}
                tabBarInactiveTextColor={'mintcream'}
                tabBarUnderlineStyle={{backgroundColor: '#e7e7e7', height: 2}}
                renderTabBar={() => <ScrollableTabBar/>}
            >
                <PopularTab tabLabel='Java'>JAVA</PopularTab>
                <PopularTab tabLabel='iOS'>IOS</PopularTab>
                <PopularTab tabLabel='Android'>android</PopularTab>
                <PopularTab tabLabel='Javascript'>js</PopularTab>
            </ScrollableTabView>
        </View>
    }
}

class PopularTab extends Component {
    constructor(props) {
        super(props)
        this.dataRepository = new DataRepository()
        this.state = {
            dataSource: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}),
            isLoading: false
        }
    }

    componentDidMount() {
        this.loadData()
    }

    async loadData() {
        this.setState({
            isLoading: true
        })
        let url = URL + this.props.tabLabel + QUERY_STR
        try {
            let result = await this.dataRepository.fetchNetRepository(url)
            this.setState({
                dataSource: this.state.dataSource.cloneWithRows(result.items),
                isLoading: false
            })
        } catch (e) {
            console.log(e)
        }
    }

    renderRow(data) {
        return <RepositoryCell data={data}/>
    }

    render() {
        return <View style={{flex: 1}}>
            <ListView
                dataSource={this.state.dataSource}
                renderRow={(data) => this.renderRow(data)}
                refreshControl={<RefreshControl
                    refreshing={this.state.isLoading}
                    onRefresh={() => this.loadData()}
                    colors={['#2196F3']}
                    tintColor={['#2196F3']}
                    title={'Loading...'}
                    titleColor={'#2196F3'}
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