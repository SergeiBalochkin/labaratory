const rep = require("./repository")

module.exports = new function () {
    this.get = id => rep.get(id)
    this.getAll = () => rep.getAll()
    this.create = data => rep.create(data)
    this.update = data => rep.update(data)
    this.delete = id => rep.delete(id)
}