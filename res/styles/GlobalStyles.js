import {Dimensions} from 'react-native'

const {height, width} = Dimensions.get('window')
module.exports = {
    line: {
        flex: 1,
        height: 1,
        opacity: 0.5,
        backgroundColor: 'darkgray'
    },
    root_container: {
        flex: 1,
        backgroundColor: '#f3f3f4'
    },
    nav_bar_height_ios: 40,
    nav_bar_height_android: 50,
    window_height: height
}