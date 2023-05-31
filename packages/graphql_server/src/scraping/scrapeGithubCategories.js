'use strict'
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value)
          })
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value))
        } catch (e) {
          reject(e)
        }
      }
      function rejected(value) {
        try {
          step(generator['throw'](value))
        } catch (e) {
          reject(e)
        }
      }
      function step(result) {
        result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected)
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next())
    })
  }
var __generator =
  (this && this.__generator) ||
  function (thisArg, body) {
    var _ = {
        label: 0,
        sent: function () {
          if (t[0] & 1) throw t[1]
          return t[1]
        },
        trys: [],
        ops: []
      },
      f,
      y,
      t,
      g
    return (
      (g = { next: verb(0), throw: verb(1), return: verb(2) }),
      typeof Symbol === 'function' &&
        (g[Symbol.iterator] = function () {
          return this
        }),
      g
    )
    function verb(n) {
      return function (v) {
        return step([n, v])
      }
    }
    function step(op) {
      if (f) throw new TypeError('Generator is already executing.')
      while ((g && ((g = 0), op[0] && (_ = 0)), _))
        try {
          if (
            ((f = 1),
            y &&
              (t =
                op[0] & 2
                  ? y['return']
                  : op[0]
                  ? y['throw'] || ((t = y['return']) && t.call(y), 0)
                  : y.next) &&
              !(t = t.call(y, op[1])).done)
          )
            return t
          if (((y = 0), t)) op = [op[0] & 2, t.value]
          switch (op[0]) {
            case 0:
            case 1:
              t = op
              break
            case 4:
              _.label++
              return { value: op[1], done: false }
            case 5:
              _.label++
              y = op[1]
              op = [0]
              continue
            case 7:
              op = _.ops.pop()
              _.trys.pop()
              continue
            default:
              if (
                !((t = _.trys), (t = t.length > 0 && t[t.length - 1])) &&
                (op[0] === 6 || op[0] === 2)
              ) {
                _ = 0
                continue
              }
              if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) {
                _.label = op[1]
                break
              }
              if (op[0] === 6 && _.label < t[1]) {
                _.label = t[1]
                t = op
                break
              }
              if (t && _.label < t[2]) {
                _.label = t[2]
                _.ops.push(op)
                break
              }
              if (t[2]) _.ops.pop()
              _.trys.pop()
              continue
          }
          op = body.call(thisArg, _)
        } catch (e) {
          op = [6, e]
          y = 0
        } finally {
          f = t = 0
        }
      if (op[0] & 5) throw op[1]
      return { value: op[0] ? op[1] : void 0, done: true }
    }
  }
Object.defineProperty(exports, '__esModule', { value: true })
var axios_1 = require('axios')
var openAIApi_1 = require('../api/openAIApi')
/**
 * Retrieves the repository topics from GitHub API for the specified repository.
 * @param repositoryOwner - The owner of the repository.
 * @param repositoryName - The name of the repository.
 * @returns A Promise that resolves to a string representing the repository topics.
 * @throws Error if the repository topics cannot be retrieved.
 */
function getRepositoryTopics(repositoryOwner, repositoryName) {
  var _a, _b
  return __awaiter(this, void 0, void 0, function () {
    var apiUrl, token, query, headers, response, data, topics, error_1
    return __generator(this, function (_c) {
      switch (_c.label) {
        case 0:
          apiUrl = 'https://api.github.com/graphql'
          token = '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'
          query = '\n    query {\n      repository(owner: "'
            .concat(repositoryOwner, '", name: "')
            .concat(
              repositoryName,
              '") {\n        repositoryTopics(first: 10) {\n          nodes {\n            topic {\n              name\n            }\n          }\n        }\n      }\n    }\n  '
            )
          console.log(query)
          headers = {
            Authorization: 'Bearer '.concat(token)
          }
          _c.label = 1
        case 1:
          _c.trys.push([1, 3, , 4])
          return [4 /*yield*/, axios_1.default.post(apiUrl, { query: query }, { headers: headers })]
        case 2:
          response = _c.sent()
          data =
            (_b =
              (_a = response === null || response === void 0 ? void 0 : response.data) === null ||
              _a === void 0
                ? void 0
                : _a.data) === null || _b === void 0
              ? void 0
              : _b.repository
          if (data.repositoryTopics.nodes.length > 0) {
            topics = data.repositoryTopics.nodes.map(function (node) {
              return node.topic.name
            })
            console.log(topics.join(', '))
            return [2 /*return*/, (0, openAIApi_1.categorizeProjectGeneral)(topics.join(' '))] //return the openai response as a string
          } else {
            throw new Error('No repository topics found.')
          }
          return [3 /*break*/, 4]
        case 3:
          error_1 = _c.sent()
          console.log('Could not retrieve the categories')
          throw new Error('Failed to get repository topics.')
        case 4:
          return [2 /*return*/]
      }
    })
  })
}
var works = getRepositoryTopics('sjvasquez', 'handwriting-synthesis')
console.log(works)
