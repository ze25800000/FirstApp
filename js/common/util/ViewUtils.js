import React from 'react';
import {
    StyleSheet,
    Navigator,
    Text,
    View,
    TouchableOpacity,
    Image
} from 'react-native'

export default class ViewUtils {
    static getLeftButton(callback) {
        return <TouchableOpacity
            style={{padding: 8}}
            onPress={callback}
        >
            <Image
                style={{width: 26, height: 26, tintColor: 'white'}}
                source={require('../../../res/images/ic_arrow_back_white_36pt.png')}
            />

        </TouchableOpacity>
    }

    static getRightButton(title, callback) {
        return <TouchableOpacity
            onPress={callback}
        >
            <View style={{margin: 10}}>
                <Text style={styles.title}>{title}</Text>
            </View>
        </TouchableOpacity>
    }
}

const styles = StyleSheet.create({
    title: {
        color: 'white',
        fontSize: 20
    }
})