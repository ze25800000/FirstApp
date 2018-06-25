export default function makeCancelable(promise) {
    let hasCanceled_ = false
    const wrappedPromise = new Promise((reolve, reject) => {
        promise.then((val) =>
            hasCanceled_ ? reject({isCanceled: true}) : reolve(val)
        )
        promise.catch(error =>
            hasCanceled_ ? reject({isCanceled: true}) : reject(error)
        )
    })
    return {
        promise: wrappedPromise,
        cancel() {
            hasCanceled_ = true
        }
    }
}