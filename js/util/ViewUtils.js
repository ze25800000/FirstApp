import React from 'react';
import {
    StyleSheet,
    Navigator,
    Text,
    View,
    TouchableOpacity,
    TouchableHighlight,
    Image
} from 'react-native'

export default class ViewUtils {
    static getSettingItem(callBack, icon, text, tintStyle, expandableIco) {
        return (
            <TouchableHighlight
                onPress={callBack}
            >
                <View style={styles.item}>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        {icon ?
                            <Image source={icon} resizeMode='stretch'
                                   style={[{opacity: 1, width: 16, height: 16, marginRight: 10}, tintStyle]}/> :
                            <View style={{opacity: 1, width: 16, height: 16, marginRight: 10}}/>
                        }
                        <Text>{text}</Text>
                    </View>
                    <Image
                        style={[{
                            marginRight: 10,
                            height: 22,
                            width: 22
                        }, {tintColor: '#2196f3'}]}
                        source={expandableIco ? expandableIco : require('../../res/images/ic_tiaozhuan.png')}/>
                </View>
            </TouchableHighlight>
        )

    }

    static getLeftButton(callback) {
        return <TouchableOpacity
            style={{padding: 8}}
            onPress={callback}
        >
            <Image
                style={{width: 26, height: 26, tintColor: 'white'}}
                source={require('../../res/images/ic_arrow_back_white_36pt.png')}
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
    container: {
        flex: 1
    },
    title: {
        color: 'white',
        fontSize: 20
    },
    item: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
        height: 60,
        backgroundColor: 'white'
    }
})