import {AsyncStorage, DeviceEventEmitter} from 'react-native'
import GitHubTrending from 'GitHubTrending'

export let FLAG_STORAGE = {flag_popular: 'popular', flag_trending: 'trending'}
export default class DataRepository {
    constructor(flag) {
        this.flag = flag
        if (flag === FLAG_STORAGE.flag_trending) this.trending = new GitHubTrending()
    }

    async fetchRepository(url) {
        try {
            let localResult = await this.fetchLocalRepository(url)
            if (localResult) return localResult
            return await this.fetchNetRepository(url)
        } catch (e) {
            return e
        }

    }

    fetchLocalRepository(url) {
        return new Promise((resolve, reject) => {
            AsyncStorage.getItem(url, (error, result) => {
                if (!error) {
                    try {
                        DeviceEventEmitter.emit('showToast', '显示缓存数据')
                        resolve(JSON.parse(result))
                    } catch (e) {
                        reject(e)
                    }
                } else {
                    reject(e)
                }
            })
        })
    }

    fetchNetRepository(url) {

        return new Promise((resolve, reject) => {
            if (this.flag === FLAG_STORAGE.flag_trending) {
                this.trending.fetchTrending(url)
                    .then(result => {
                        if (!result) {
                            reject(new Error('responseData is null'))
                            return
                        }
                        this.saveRepository(url, result)
                        resolve(result)
                    })
            } else {
                fetch(url)
                    .then(response => response.json())
                    .then(result => {
                        if (!result) {
                            reject(new Error('responseData is null'))
                            return
                        }
                        DeviceEventEmitter.emit('showToast', '显示网络数据')
                        resolve(result.items)
                        this.saveRepository(url, result.items)
                    })
                    .catch(error => {
                        reject(error)
                    })
            }
        })
    }

    saveRepository(url, items, callback) {
        if (!url || !items) return
        let wrapData = {
            items: items,
            update_data: new Date().getTime()
        }
        AsyncStorage.setItem(url, JSON.stringify(wrapData), callback)
    }

    checkDate(longTime) {
        let currentDate = new Date();
        let targetDate = new Date();
        targetDate.setTime(longTime);
        if (currentDate.getMonth() !== targetDate.getMonth()) return false;
        if (currentDate.getDate() !== targetDate.getDate()) return false;
        if (currentDate.getHours() - targetDate.getHours() > 4) return false;
        return true;
    }

}