import React from 'react';
import {
    StyleSheet,
    Navigator,
    Text,
    View,
    TouchableOpacity,
    Image
} from 'react-native'

export default class ArrayUtils {
    static updateArray(array, item) {
        for (let i = 0; i < array.length; i++) {
            let temp = array[i]
            if (temp === item) {
                array.splice(i, 1)
                return
            }
        }
        array.push(item)
    }
}