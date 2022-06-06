const http = require('http');
const url = require('url');
const fs = require('fs');

let users = [
    {
        name: 'Tai',
        email: 'tai@gmial.com',
        phone: '090909090'
    },
    {
        name: 'Tai 2',
        email: 'tai2@gmial.com',
        phone: '090909090'
    },
    {
        name: 'Tai 3',
        email: 'tai3@gmial.com',
        phone: '090909090'
    },
]

console.log(users);

function showListUser(data) {
    let html = '';
    for (let i = 0; i < data.length; i++){
        html += '<tr>';
        html += `<td>${i + 1}</td>`
        html += `<td>${data[i].name}</td>`
        html += `<td>${data[i].email}</td>`
        html += `<td>${data[i].phone}</td>`
        html += `<td><a href="users/delete?id=${i}" class="btn btn-danger">Delete</a></td>`
        html += '</tr>';
    }
    return html;
}

function search(keyword) {
    return users.filter((item, index) => {
        return item.name.toLowerCase() === keyword.toLowerCase()
    })
}

function deleteUser(index) {
    users.splice(index, 1);
    return users;
}

// tạo server
const server = http.createServer(((req, res) => {

    // phân tích url
    const urlPath = url.parse(req.url, true);
    let queryString = urlPath.query;

    // dùng switch-case điều hướng  theo url và method của request
    // nó đóng vai trò là router

    switch (urlPath.pathname) {
        case '/':
            fs.readFile('./views/index.html','utf8', ((err, data) => {
                if (err) {
                    throw new Error(err.message)
                }

                let newData = showListUser(users);
                data = data.replace('{list-user}', newData)
                res.writeHead(200,'success', {'Content-type': 'text/html'})
                res.write(data)
                res.end()
            }))
             break;
        case '/search':
            let keyword = queryString.name;
            let dataSearch = search(keyword);
            console.log(dataSearch)
            fs.readFile('./views/index.html','utf8', ((err, data) => {
                if (err) {
                    throw new Error(err.message)
                }

                let newData = showListUser(dataSearch);

                data = data.replace('{list-user}', newData)

                data = data.replace('<a href="" hidden></a>', '<a href="/">Back</a>')

                res.writeHead(200,'success', {'Content-type': 'text/html'})
                res.write(data)

                res.end()
            }))
            break;
        case '/users/delete':
            let index = queryString.id;
            deleteUser(index);

            // set lại location cho res để trình duyệt gọi lên 1 request khác
            res.writeHead(301, {
                Location: "http://localhost:8081"
            })

            res.end()
        break;
    }

}))

server.listen(8081, 'localhost', () => {
    console.log('server running in http://localhost:8081')
})
