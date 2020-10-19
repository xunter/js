const util = require('util');
const config = require('config');
const IORedis = require('ioredis');
const RedisCommands = require('redis-commands')

const defaultClientSettings = {
    host: "127.0.0.1",
    port: 6379,
    keyPrefix: "x:"
};

const configuredClientSettings = Object.assign({}, defaultClientSettings, config.get("redis"));

let _client = null;

const modexps = {
    initializeAsync,
    getClient
};

function jsonback(json) {
    return JSON.parse(json);
}

function jsonforth(obj) {
    return JSON.stringify(obj);
}

RedisCommands.list.forEach(function (command) {
    modexps[command] = function() {
        if (_client) {
            return _client[command].apply(_client, arguments);
        }
    };

    modexps[command.concat("Async")] = async function() {
        if (_client) {
            return _client[command].apply(_client, arguments);
        }
    };
});

modexps.oget = function() {
    let raw = modexps.get.apply(modexps, arguments);
    if (raw) {
        return jsonback(raw);
    }
    return raw;
}

modexps.ogetAsync = async function() {
    let raw = await modexps.getAsync.apply(modexps, arguments);
    if (raw) {
        return jsonback(raw);
    }
    return raw;
}

modexps.oset = function() {
    let obj = arguments[1];
    let json = obj ? jsonforth(obj) : "";
    let argumentsWithJson = [...arguments];
    argumentsWithJson[1] = json;
    return modexps.set.apply(modexps, argumentsWithJson);
}

modexps.osetAsync = async function() {
    let obj = arguments[1];
    let json = obj ? jsonforth(obj) : "";
    let argumentsWithJson = [...arguments];
    argumentsWithJson[1] = json;
    return await modexps.setAsync.apply(modexps, argumentsWithJson);
}

modexps.pipeline = function() {
    if (_client) {
        let ppln = _client.pipeline.apply(_client, arguments);
        ppln.execAsync = async function() {
            return ppln.exec.apply(ppln, arguments);
        };
        return ppln;
    } else {
        let mock = {};
        
        RedisCommands.list.forEach(function (command) {
            mock[command] = function() {
                return mock;
            };
        });

        mock.exec = function() {};
        mock.execAsync = async function() {};

        return mock;
    }
}

function getClient() {
    return _client;
}

async function checkAvailabilityAsync() {
    try {
        if (_client === null) {
            return false;
        }
        await _client.ping();
        return true;
    } catch (err) {
        return false;
    }
}

async function initializeAsync(settings) {
    settings = Object.assign({}, configuredClientSettings, settings);

    if (_client === null) {
        _client = new IORedis(settings);
    }

    let available = await checkAvailabilityAsync();
    if (!available) {
        _client = null;
    }
    return available;
}

module.exports = modexps;
