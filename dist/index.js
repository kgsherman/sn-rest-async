"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var SNAPI = /** @class */ (function () {
    function SNAPI(_a) {
        var token = _a.token, instance = _a.instance;
        this.instance = instance;
        this.endpoint = "https://" + this.instance + ".service-now.com";
        this.attachmentEndpoint = "https://" + this.instance + ".service-now.com/api/now/attachment";
        this.tableEndpoint = "https://" + this.instance + ".service-now.com/api/now/table";
        this.defaultHeaders = new Headers({
            'Content-Type': 'application/json',
            'Authorization': "Bearer " + token
        });
    }
    SNAPI.prototype.handleResponse = function (response) {
        return __awaiter(this, void 0, void 0, function () {
            var json, json, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!response.ok) return [3 /*break*/, 2];
                        return [4 /*yield*/, response.json()];
                    case 1:
                        json = _a.sent();
                        return [2 /*return*/, {
                                status: response.status,
                                data: json.result,
                            }];
                    case 2:
                        _a.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, response.json()];
                    case 3:
                        json = _a.sent();
                        console.error("ServiceNow returned error " + response.status + ":\n" + JSON.stringify(json, null, 2));
                        return [2 /*return*/, {
                                status: response.status,
                                data: json,
                            }];
                    case 4:
                        e_1 = _a.sent();
                        console.error('Error attempting to parse response. \n' + e_1);
                        return [2 /*return*/, {
                                status: 500,
                                data: null
                            }];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    SNAPI.prototype.getRecords = function (table, _a) {
        var _b = _a.displayValue, displayValue = _b === void 0 ? false : _b, _c = _a.excludeReferenceLink, excludeReferenceLink = _c === void 0 ? false : _c, _d = _a.fields, fields = _d === void 0 ? [] : _d, _e = _a.limit, limit = _e === void 0 ? 10000 : _e, _f = _a.offset, offset = _f === void 0 ? 0 : _f, _g = _a.query, query = _g === void 0 ? '' : _g, _h = _a.queryNoDomain, queryNoDomain = _h === void 0 ? false : _h, _j = _a.suppressPaginationHeader, suppressPaginationHeader = _j === void 0 ? false : _j, _k = _a.view, view = _k === void 0 ? '' : _k;
        return __awaiter(this, void 0, void 0, function () {
            var queryParameters, response;
            return __generator(this, function (_l) {
                switch (_l.label) {
                    case 0:
                        queryParameters = [
                            "sysparm_display_value=" + displayValue,
                            "sysparm_exclude_reference_link=" + excludeReferenceLink,
                            "sysparm_fields=" + fields.join(),
                            "sysparm_limit=" + limit,
                            "sysparm_offset=" + offset,
                            "sysparm_query=" + query,
                            "sysparm_query_no_domain=" + queryNoDomain,
                            "sysparm_suppress_pagination_header=" + suppressPaginationHeader,
                            "sysparm_view=" + view
                        ].join('&');
                        return [4 /*yield*/, fetch(this.tableEndpoint + "/" + table + "?" + queryParameters, {
                                method: 'GET',
                                headers: this.defaultHeaders
                            })];
                    case 1:
                        response = _l.sent();
                        return [2 /*return*/, response];
                }
            });
        });
    };
    SNAPI.prototype.getRecord = function (table, sysId, _a) {
        var _b = _a === void 0 ? {} : _a, _c = _b.displayValue, displayValue = _c === void 0 ? false : _c, _d = _b.excludeReferenceLink, excludeReferenceLink = _d === void 0 ? false : _d, _e = _b.fields, fields = _e === void 0 ? [] : _e, _f = _b.queryNoDomain, queryNoDomain = _f === void 0 ? false : _f, _g = _b.view, view = _g === void 0 ? '' : _g;
        return __awaiter(this, void 0, void 0, function () {
            var queryParameters, response;
            return __generator(this, function (_h) {
                switch (_h.label) {
                    case 0:
                        queryParameters = [
                            "sysparm_display_value=" + displayValue,
                            "sysparm_exclude_reference_link=" + excludeReferenceLink,
                            "sysparm_fields=" + fields.join(),
                            "sysparm_query_no_domain=" + queryNoDomain,
                            "sysparm_view=" + view
                        ].join('&');
                        return [4 /*yield*/, fetch(this.tableEndpoint + "/" + table + "/" + sysId + "?" + queryParameters, {
                                method: 'GET',
                                headers: this.defaultHeaders
                            })];
                    case 1:
                        response = _h.sent();
                        return [2 /*return*/, response];
                }
            });
        });
    };
    SNAPI.prototype.getProperty = function (property) {
        return __awaiter(this, void 0, void 0, function () {
            var response, json, e_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, fetch(this.tableEndpoint + "/sys_properties?sysparm_query=name=" + property, {
                                method: 'GET',
                                headers: this.defaultHeaders
                            })];
                    case 1:
                        response = _a.sent();
                        return [4 /*yield*/, response.json()];
                    case 2:
                        json = _a.sent();
                        return [2 /*return*/, json.result[0].value];
                    case 3:
                        e_2 = _a.sent();
                        return [2 /*return*/, null];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    SNAPI.prototype.createRecord = function (table, data, _a) {
        var _b = _a === void 0 ? {} : _a, _c = _b.displayValue, displayValue = _c === void 0 ? false : _c, _d = _b.fields, fields = _d === void 0 ? [] : _d, _e = _b.excludeReferenceLink, excludeReferenceLink = _e === void 0 ? false : _e, _f = _b.inputDisplayValue, inputDisplayValue = _f === void 0 ? false : _f, _g = _b.view, view = _g === void 0 ? '' : _g;
        return __awaiter(this, void 0, void 0, function () {
            var queryParameters, response;
            return __generator(this, function (_h) {
                switch (_h.label) {
                    case 0:
                        queryParameters = [
                            "sysparm_display_value=" + displayValue,
                            "sysparm_fields=" + fields.join(),
                            "sysparm_exclude_reference_link=" + excludeReferenceLink,
                            "sysparm_input_display_value=" + inputDisplayValue,
                            "sysparm_view=" + view
                        ].join('&');
                        return [4 /*yield*/, fetch(this.tableEndpoint + "/" + table + "?" + queryParameters, {
                                method: 'POST',
                                headers: this.defaultHeaders
                            })];
                    case 1:
                        response = _h.sent();
                        return [4 /*yield*/, this.handleResponse(response)];
                    case 2: return [2 /*return*/, _h.sent()];
                }
            });
        });
    };
    SNAPI.prototype.getProfilePicture = function (sysId, abortSignal) {
        return __awaiter(this, void 0, void 0, function () {
            var response, attachment, attachmentId, response_1, buffer, u8, b64encoded, mimetype;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getRecords('sys_attachment', {
                            query: "table_sys_id=" + sysId + "^file_name=photo",
                            limit: 1,
                            fields: ['sys_id'],
                        })];
                    case 1:
                        response = _a.sent();
                        return [4 /*yield*/, response.json()];
                    case 2:
                        attachment = (_a.sent()).result;
                        if (!(attachment && attachment[0] && attachment[0].sys_id)) return [3 /*break*/, 5];
                        attachmentId = attachment[0].sys_id;
                        return [4 /*yield*/, fetch(this.attachmentEndpoint + "/" + attachmentId + "/file", {
                                signal: abortSignal || null,
                                method: 'GET',
                                headers: this.defaultHeaders,
                            })];
                    case 3:
                        response_1 = _a.sent();
                        return [4 /*yield*/, response_1.arrayBuffer()];
                    case 4:
                        buffer = _a.sent();
                        u8 = new Uint8Array(buffer);
                        b64encoded = btoa([].reduce.call(new Uint8Array(buffer), function (p, c) { return p + String.fromCharCode(c); }, ''));
                        mimetype = "image/jpeg";
                        return [2 /*return*/, "data:" + mimetype + ";base64," + b64encoded];
                    case 5: return [2 /*return*/, ''];
                }
            });
        });
    };
    SNAPI.prototype.scriptedRestApi = function (resourcePath, httpMethod, _a) {
        var _b = _a.additionalHeaders, additionalHeaders = _b === void 0 ? {} : _b;
        return __awaiter(this, void 0, void 0, function () {
            var headers, key, response;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        headers = new Headers(this.defaultHeaders);
                        for (key in additionalHeaders) {
                            headers.set(key, additionalHeaders[key]);
                        }
                        return [4 /*yield*/, fetch(this.endpoint + "/" + resourcePath, {
                                method: httpMethod,
                                headers: headers,
                            })];
                    case 1:
                        response = _c.sent();
                        return [2 /*return*/, response];
                }
            });
        });
    };
    return SNAPI;
}());
exports.default = SNAPI;
