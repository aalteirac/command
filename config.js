var path = require('path')
var extend = require('extend')


//var certPath = path.join(__dirname, '.', 'certs');
var certPath = "C:\\ProgramData\\Qlik\\Sense\\Repository\\Exported Certificates\\.Local Certificates";

var config = extend(true, {

    hostname:'windows10',
	remotehostname:'localhost',
    cookieName: 'X-Qlik-Session',
    origin: 'http://localhost:3000',

    certificates: {
        pfx:path.resolve(certPath, 'client.pfx'),
        client: path.resolve(certPath, 'client.pem'),
        server: path.resolve(certPath, 'server.pem'),
        root: path.resolve(certPath, 'root.pem'),
        client_key: path.resolve(certPath, 'client_key.pem'),
        server_key: path.resolve(certPath, 'server_key.pem')
    },

    prefix: '', //end it with / if not empty


});

module.exports = config;