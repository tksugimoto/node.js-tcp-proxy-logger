const assert = require('assert');
const net = require('net');
const {
    parse: parseUrl,
} = require('url');

assert(process.argv[2], 'remote address("hostname:port") required.');

const {
    hostname: REMOTE_HOSTNAME,
    port: REMOTE_PORT,
} = parseUrl(`http://${process.argv[2]}`);

assert(REMOTE_PORT, 'remote port number required.');

const parseLocalBindInfo = (arg) => {
    if (arg === 'log') {
        return {
            port: 0,
        };
    }
    if (/^\d+$/.test(arg)) {
        const port = Number(arg) || 0;
        return {
            port,
        };
    }
    const {
        hostname,
        port,
    } = parseUrl(`http://${arg}`);
    return {
        hostname,
        port: port || 0,
    };
};

const {
    hostname: LOCAL_HOSTNAME,
    port: LOCAL_PORT,
 } = parseLocalBindInfo(process.argv[3]);

const logEnabled = true;

const currentTime = () => {
    const date = new Date();
    const h = date.getHours();
    const m = date.getMinutes();
    const s = date.getSeconds();
    const ms = date.getMilliseconds();
    return `${h}:${m}:${s}.${ms}`;
};

const log = text => {
    console.info(`\n[${currentTime()}] ------------- ${text} -------------`);
};

const tcpProxyServer = net.createServer();

tcpProxyServer.on('connection', (clientSocket) => {
    if (logEnabled) {
        log(`new connection (client: ${clientSocket.remoteAddress}:${clientSocket.remotePort})`);
    }
    const serverSocket = net.createConnection(REMOTE_PORT, REMOTE_HOSTNAME);
    serverSocket.once('connect', () => {
        clientSocket.pipe(serverSocket);
        serverSocket.pipe(clientSocket);
        if (logEnabled) {
            const length = 50;
            serverSocket.on('data', (data) => {
                log(`server -> client (client: ${clientSocket.remoteAddress}:${clientSocket.remotePort})`);
                console.log(`${data.toString().slice(0, length)}`);
            });
            clientSocket.on('data', (data) => {
                log(`client -> server (client: ${clientSocket.remoteAddress}:${clientSocket.remotePort})`);
                console.log(`${data.toString().slice(0, length)}`);
            });
        }
    });
    serverSocket.on('error', err => {
        clientSocket.end(err.message);
    });
    clientSocket.on('error', (err) => {
        log('clientSocket.on(error, (err)');
        console.error(err);
        serverSocket.destroy();
    });
    if (logEnabled) {
        serverSocket.on('close', (hadError) => {
            log(`serverSocket connection closed (hadError: ${hadError}) (client: ${clientSocket.remoteAddress}:${clientSocket.remotePort})`);
        });
        clientSocket.on('close', (hadError) => {
            log(`clientSocket connection closed (hadError: ${hadError}) (client: ${clientSocket.remoteAddress}:${clientSocket.remotePort})`);
        });
    }
});

tcpProxyServer.on('listening', () => {
    const {
        address,
        port,
    } = tcpProxyServer.address();
    console.info(`TCP server started. (IP:port = ${address}:${port})`);
    console.info(`transport to ${REMOTE_HOSTNAME}:${REMOTE_PORT}`);
});

tcpProxyServer.listen(LOCAL_PORT, LOCAL_HOSTNAME);
