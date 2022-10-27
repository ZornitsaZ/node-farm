const fs = require('fs');
const http = require('http');
const url = require('url');
const replaceTemplate = require('./starter/modules/replaceTemplate');

// // Blocking, synchronous way
// const textInput = fs.readFileSync('./starter/txt/input.txt', 'utf-8');
// const textOutput = `This is some information about avocado: ${textInput}\n Created on ${Date.now()}`;
// fs.writeFileSync('./starter/txt/output.txt', textOutput);
// console.log('File written');

// // Non-blocking, asynchronous way
// fs.readFile('.starter/txt/')

//////////////////////
//SERVER

const tempOverView = fs.readFileSync(`${__dirname}/starter/templates/template-overview.html`, 'utf-8');
const tempProduct = fs.readFileSync(`${__dirname}/starter/templates/template-product.html`, 'utf-8');
const tempCard = fs.readFileSync(`${__dirname}/starter/templates/template-card.html`, 'utf-8');

const data = fs.readFileSync(`${__dirname}/starter/dev-data/data.json`, 'utf-8');
const dataObj = JSON.parse(data);

const server = http.createServer((req, res) => {

    const {query, pathname} = url.parse(req.url, true);
 
    //OVERVIEW PAGE
    if(pathname === '/' || pathname === '/overview'){
        res.writeHead(200, { 
            'Content-type': 'text/html'
        });

        const cardsHtml = dataObj.map(el => replaceTemplate(tempCard, el)).join('');
        const output = tempOverView.replace('{%PRODUCT_CARDS%}', cardsHtml);
        res.end(output);

    //API
    } else if(pathname === '/api'){
       res.writeHead(200, {
        'Content-type': 'application/json'
       });
       res.end(data);

    //PRODUCT PAGE
    } else if (pathname === '/product'){
        res.writeHead(200, {
            'Content-type': 'text/html'
        });
        const product = dataObj[query.id];
        const output = replaceTemplate(tempProduct, product);
        res.end(output);

    //NOT FOUND
    } else {
        res.writeHead(404, {
            'Content-type': 'text/html',
            'my-own-header': 'hello-world'
        });
        res.end('<h1>Page not found</h1>');
    }
});
server.listen(5500, '127.0.0.1', () => {
    console.log('Server started on port 5500');
})