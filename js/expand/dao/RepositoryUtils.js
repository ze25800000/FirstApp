import {AsyncStorage} from 'react-native'
import DataRepository, {FLAG_STORAGE} from './DataRepository'

export default class RepositoryUtils {
    constructor(aboutCommon) {
        this.aboutCommon = aboutCommon
        this.DataRepository = new DataRepository(FLAG_STORAGE.flag_my)
    }

    fetchRepository(url) {

    }

    fetchRepositories(url) {

    }
}