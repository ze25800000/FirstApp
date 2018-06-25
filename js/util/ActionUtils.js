import RepositoryDetail from '../pages/RepositoryDetail'
import {FLAG_STORAGE} from '../expand/dao/DataRepository'

export default class ActionUtils {
    static onSelectRepository(params) {
        let {navigator} = params
        navigator.push({
            component: RepositoryDetail,
            params: {
                ...params
            }
        })
    }

    static onFavorite(favoriteDao, item, isFavorite, flag) {
        let key = flag === FLAG_STORAGE.flag_trending ? item.fullName : item.id.toString()
        if (isFavorite) {
            favoriteDao.saveFavoriteItem(key, JSON.stringify(item))
        } else {
            favoriteDao.removeFavoriteItem(key)
        }
    }
}