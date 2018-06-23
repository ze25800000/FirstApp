import {AsyncStorage} from 'react-native'
import DataRepository, {FLAG_STORAGE} from './DataRepository'
import Utils from '../../common/util/Utils'

export default class RepositoryUtils {
    constructor(aboutCommon) {
        this.aboutCommon = aboutCommon
        this.itemMap = new Map()
        this.DataRepository = new DataRepository(FLAG_STORAGE.flag_my)
    }

    updateData(k, v) {
        this.itemMap.set(k, v)
        let arr = []
        for (let value of this.itemMap.values()) {
            arr.push(value)
        }
        this.aboutCommon.onNotifyDataChanged(arr)
    }

    async fetchRepository(url) {
        let result = await this.DataRepository.fetchRepository(url)
        if (result) {
            this.updateData(url, result)
            if (Utils.checkDate(result.update_data)) {
                let item = await this.DataRepository.fetchNetRepository(url)
                if (item) this.updateData(url, item)
            }
        }
    }

    fetchRepositories(urls) {
        for (let i = 0, l = urls.length; i < l; i++) {
            let url = urls[i]
            this.fetchRepository(url)
        }
    }
}