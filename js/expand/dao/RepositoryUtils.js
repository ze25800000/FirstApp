import {AsyncStorage} from 'react-native'
import DataRepository, {FLAG_STORAGE} from './DataRepository'
import Utils from '../../common/util/Utils'

let itemMap = new Map()
export default class RepositoryUtils {
    constructor(aboutCommon) {
        this.aboutCommon = aboutCommon
        this.DataRepository = new DataRepository(FLAG_STORAGE.flag_my)
    }

    updateData(k, v) {
        itemMap.set(k, v)
        let arr = []
        for (let value of itemMap.values()) {
            arr.push(value)
        }
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