import {AsyncStorage, DeviceEventEmitter} from 'react-native'
import GitHubTrending from 'GitHubTrending'

export let FLAG_STORAGE = {flag_popular: 'popular', flag_trending: 'trending', flag_my: 'my'}
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
            if (this.flag !== FLAG_STORAGE.flag_trending) {
                fetch(url)
                    .then(response => response.json())
                    .then(result => {
                        if (this.flag === FLAG_STORAGE.flag_my && result) {
                            this.saveRepository(url, result.items)
                            resolve(result)
                        } else if (result && result.items) {
                            this.saveRepository(url, result.items)
                            resolve(result.items)
                        } else {
                            reject(new Error('responseData is null'))
                        }
                    })
                    .catch(error => {
                        reject(error)
                    })
            } else {
                this.trending.fetchTrending(url)
                    .then(result => {
                        if (!result) {
                            reject(new Error('responseData is null'))
                            return
                        }
                        this.saveRepository(url, result)
                        resolve(result)
                    })
            }
        })
    }

    saveRepository(url, items, callback) {
        if (!url || !items) return
        let wrapData
        if (this.flag === FLAG_STORAGE.flag_my) {
            wrapData = {
                item: items,
                update_data: new Date().getTime()
            }
        } else {
            wrapData = {
                items: items,
                update_data: new Date().getTime()
            }
        }
        AsyncStorage.setItem(url, JSON.stringify(wrapData), callback)
    }
}