const http = require("http"),            //тут идет подключение файла или библиотеки
      crud = require("./crud"),
      statics = require("node-static");

const staticFileDir = new statics.Server("./public");

const echo = (res, content) => {             //закрывает наш поток и записывает доп.данные
    res.end(JSON.stringify(content));
}

const student = (req, res) => {
    res.writeHead(200,{"Content-type": "application/json"});   //отправляет код состояния 200(ОК) и записывает данные из JSON

    const url = req.url.substring(1).split("/");   //тут в url создается массив, который идет с первого элемента(в начале убирается лишняя /)
    //элементы массива разделяются с помощью /
    switch (req.method) {    //определяет method нашего запроса(GET, POST и другие)
        case "GET":  //получает данные обо всех студентах
            if (url.length > 1)    // если имеется id после student - мы получаем его
                echo (res, crud.get(url[1]))
            else
                echo (res, crud.getAll())   //если после student не стоит /id, то мы получаем все данные
            break;
        case "POST":  //метод добавления
            getAsyncData (req, data => {
                echo(res, crud.create(JSON.parse(data)))
            })
            break;
        case "PUT":  //метод изменения
            getAsyncData (req, data => {
                echo(res, crud.update(JSON.parse(data)))
            })
            break;
        case "DELETE":  //метод удаления
            if(url.length > 1)
                echo(res, crud.delete(url[1]))  //если после student у нас все же стоит /id, то мы удаляем вместе с ним
            else
                echo(res,{error:"Не передан id"}) //если происходит удаление без /id после student
            break;
        default: echo(res,{error:"500"})
    }
}

const getAsyncData = (req, callback) => {           //связывает функцию chunk с нашей data, и пока на сервер поступают данные
    let data = "";                                  //в data добавляются строчки, которые мы ввели из json
    req.on("data", chunk => {data += chunk})        //само событие data генерируется, когда на наш сервер поступают данные
    req.on("end", () => {callback(data)})           //когда все данные поступили на сервер - мы вызваем data, а end генерируется, когда все данные уже поступили
}

const handler = function (req, res) {
    const url = req.url.substring(1).split("/")
    switch (url[0]) {
        case "student":  //если у нас первый url после localhost - это student, то
            student(req, res); //вызываем функцию
            return
    }
    staticFileDir.serve(req, res);
}

http.createServer(handler).listen(8090, () => {
    console.log("Сервер был запущен на порту 8090")
})
