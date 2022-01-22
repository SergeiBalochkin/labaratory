const rep = require("./repository")

module.exports = new function () {   //module.exports возвращает нам функцию require
    this.get = id => rep.get(id)    //вызываем функции, написанные в repository
    this.getAll = () => rep.getAll()
    this.create = data => rep.create(data)
    this.update = data => rep.update(data)
    this.delete = id => rep.delete(id)
}
