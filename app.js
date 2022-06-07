const http = require('http');
const url = require('url');
const fs = require('fs');
const qs = require('qs');

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

function showListUser(data) {
    let html = '';
    for (let i = 0; i < data.length; i++){
        html += '<tr>';
        html += `<td>${i + 1}</td>`
        html += `<td>${data[i].name}</td>`
        html += `<td>${data[i].email}</td>`
        html += `<td>${data[i].phone}</td>`
        html += `<td>
<a href="users/delete?id=${i}" class="btn btn-danger">Delete</a>
<a href="users/update?id=${i}" class="btn btn-primary">Update</a>
</td>`
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
    console.log(urlPath)

    let queryString = urlPath.query;

    // dùng switch-case điều hướng  theo url và method của request
    // nó đóng vai trò là router
    let index;

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
            index = queryString.id;
            deleteUser(index);
            console.log(users)
            // set lại location cho res để trình duyệt gọi lên 1 request khác
            res.writeHead(301, {
                "Location": "http://localhost:8081"
            })
            res.end();
        break;
        case '/users/update':
            index = queryString.id;
            let userUpdate = users[index];

            if (req.method === 'GET') {
                fs.readFile('./views/edit.html', 'utf8', ((err, data) => {
                    if (err) {
                        throw new Error(err.message)
                    }

                    data = data.replace('<input type="text" value="" name="name">', `<input type="text" value="${userUpdate.name}" name="name">`)
                    data = data.replace('<input type="text" value="" name="email">', `<input type="text" value="${userUpdate.email}" name="email">`)
                    data = data.replace('<input type="text" value="" name="phone">', `<input type="text" value="${userUpdate.phone}" name="phone">`)
                    data = data.replace('<form action="/users/update" method="post">', `<form action="/users/update?id=${index}" method="post">`)
                    res.writeHead(200,'success', {'Content-type': 'text/html'})
                    res.write(data)

                    res.end()
                }))
            } else {
                let data = ''
                req.on('data', chunk => {
                    data += chunk
                })

                req.on('end', () => {
                    let dataForm = qs.parse(data);
                    userUpdate.name = dataForm.name;
                    userUpdate.email = dataForm.email;
                    userUpdate.phone = dataForm.phone;

                    res.writeHead(301, {
                        "Location": "http://localhost:8081"
                    })
                    res.end();
                })
            }
            break;
        case '/js/my.js':
            fs.readFile('./js/my.js','utf8', ((err, data) => {
                    if (err) {
                        throw new Error(err.message)
                    }

                    res.writeHead(200,'success', {'Content-type': 'text/javascript'})
                    res.write(data);
                    res.end();
                }
            ))
            break;
        default:
            res.end()

    }
}))

server.listen(8081, 'localhost', () => {
    console.log('server running in http://localhost:8081')
})
