import React, {Component} from 'react';
import {
    StyleSheet,
    Navigator,
    Text,
    View,
    Image
} from 'react-native'

import SortableListView from 'react-native-sortable-listview'

export default class Test extends Component {
    constructor(props) {
        super(props)
        this.state = {
            checkedArray: [
                {name: 123},
                {name: 234},
                {name: 234},
                {name: 234},
                {name: 345}
            ]
        }
    }

    render() {
        return <View style={{flex: 1}}>
            {/*<Text>{JSON.stringify(this.state.checkedArray)}</Text>*/}
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
        </View>
    }
}

class SortCell extends Component {
    render() {
        return <View>
            <Text>{this.props.data.name}</Text>
        </View>
    }
}