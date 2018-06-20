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

    static clone(from) {
        if (!from) return []

        let newArray = []
        for (let i = 0, len = from.length; i < len; i++) {
            newArray[i] = from[i]
        }
        return newArray
    }

    static isEquire(arr1, arr2) {
        if (!arr1 && !arr2) return false
        if (arr1.length !== arr2.length) return false
        for (let i = 0, l = arr2.length; i < l; i++) {
            if (arr1[i] !== arr2[i]) return false
        }
        return true
    }
}