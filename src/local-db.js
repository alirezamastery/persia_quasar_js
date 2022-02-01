const localDb = {
  key: '__PERSIA_ATLAS__LOCALE__DATABASE__',
  get(key) {
    let data = '{}'

    data = localStorage.getItem(this.key) || data

    try {
      data = JSON.parse(data)
    } catch (er) {
      console.warn('could not parse local database: ', data)
      data = {}
    }

    if (key) {
      return data[key]
    }

    return data
  },
  set(key, value) {
    let data = this.get()

    data[key] = value

    localStorage.setItem(this.key, JSON.stringify(data))
  },
  getOrSet(key, defaultValue) {
    let result = this.get(key)
    if (result === undefined) {
      result = defaultValue
      this.set(key, defaultValue)
    }
    return result
  },
  clear(key) {
    let data = this.get()

    if (key) {
      if (data[key] === undefined)  // for performance reasons, so we won't write to local storage
        return
      data[key] = undefined
    }

    localStorage.setItem(this.key, JSON.stringify(data))
  },
  clearAll(){
    localStorage.setItem(this.key, JSON.stringify({}))
  }
}

export default localDb
