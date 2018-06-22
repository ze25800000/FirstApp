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
            let id = item.id ? item.id.toString() : item.fullName
            if (id === items[i]) return true
        }
        return false
    }

    static checkDate(longTime) {
        let currentDate = new Date();
        let targetDate = new Date();
        targetDate.setTime(longTime);
        if (currentDate.getMonth() !== targetDate.getMonth()) return false;
        if (currentDate.getDate() !== targetDate.getDate()) return false;
        if (currentDate.getHours() - targetDate.getHours() > 4) return false;
        return true;
    }
}