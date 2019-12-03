const debug = require('debug')('local-dev');
const http = require('http');
const fs = require('fs');
const path = require('path');

http.createServer(function (request, response) {
    debug(`requested URL: ${request.url}`);

    // special case: node_modules
    if (request.url.substr(0,14) === '/node_modules/') {
        debug('\tis a node module');
        const filename = require.resolve(request.url.substr(14));
        debug(`filename = ${filename}`);
        fs.readFile(filename, 'utf8', (err, content) => {
            const translatedContent = require("@babel/core").transform(content, {
              plugins: ["@babel/plugin-transform-runtime"],
            });
            response.writeHead(200, { 'Content-Type': 'application/javascript' });
            response.end(content, 'utf-8');
        });
        return;
    }
    debug('\tis not a node module');

    const partialPath = 'src' + request.url;
    if (partialPath == './')
        partialPath = './index.html';
    const filePath = path.resolve(partialPath);
    debug(`\t${filePath}`);

    const extname = path.extname(filePath);
    let contentType = 'text/html';
    switch (extname) {
        case '.js':
            contentType = 'text/javascript';
            break;
        case '.css':
            contentType = 'text/css';
            break;
        case '.json':
            contentType = 'application/json';
            break;
        case '.png':
            contentType = 'image/png';
            break;      
        case '.jpg':
            contentType = 'image/jpg';
            break;
        case '.wav':
            contentType = 'audio/wav';
            break;
        case '.md':
            contentType = 'text/markdown';
            break;
        case '.txt':
            contentType = 'text/plain';
            break;
    }
    const mightBeArticle = ['text/plain','text/markdown','text/html'].includes(contentType);
    let fileExists;
    fs.stat(filePath, (err, stats) => {
        if (err) {
            if (err.code == 'ENOENT') fileExists = false;
            else if (err) throw err;   
        }
        else fileExists = stats.isFile();
    })
    // special case: if it looks like an article, but it isn't, just serve index.html
    if (mightBeArticle && !fileExists) {
        fs.readFile('src/index.html', (err, content) => {
          response.writeHead(200, { 'Content-Type': 'text/html' });
          response.end(content, 'utf-8');
        })
        return;
    }

    fs.readFile(filePath, function(error, content) {
        if (error) {
            if(error.code == 'ENOENT'){
                response.writeHead(404);
                response.end('file not found');
                // fs.readFile('./404.html', function(error, content) {
                //     response.writeHead(200, { 'Content-Type': contentType });
                //     response.end(content, 'utf-8');
                // });
            }
            else {
                response.writeHead(500);
                response.end('Sorry, check with the site admin for error: '+error.code+' ..\n');
                response.end(); 
            }
        }
        else {
            response.writeHead(200, { 'Content-Type': contentType });
            response.end(content, 'utf-8');
        }
    });

}).listen(8080);
console.log('Server running at http://127.0.0.1:8080/');