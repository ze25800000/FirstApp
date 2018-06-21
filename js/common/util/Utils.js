import React from 'react';
import {
    StyleSheet,
    Navigator,
    Text,
    View,
    TouchableOpacity,
    Image
} from 'react-native'

export default class Utils {
    static checkFavorite(item, items) {
        for (let i = 0, len = items.length; i < len; i++) {
            if (item.id.toString() === items[i]) return true
        }
        return false
    }
}