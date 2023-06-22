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
exports.testGetContributorCount = exports.testGetRepositoryTopics = void 0
var githubApi_1 = require('../api/githubApi')
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function testGetRepositoryTopics(githubToken) {
  return __awaiter(this, void 0, void 0, function () {
    var noTopicsResponse,
      otherLanguageResponse,
      expectedOtherLanguageTopics,
      nonExistentRepoResponse,
      manyCategoriesResponse,
      expectedManyCategories,
      emptyParamsResponse
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          // Case: No topics
          console.log('Case: No topics')
          return [
            4 /*yield*/,
            (0, githubApi_1.getRepositoryTopics)('AntonOsika', 'gpt-engineer', githubToken)
          ]
        case 1:
          noTopicsResponse = _a.sent()
          console.log(noTopicsResponse === null ? 'Pass' : 'Fail') // Logs whether the response is null (Pass) or not null (Fail)
          // Case: Topics in another language
          console.log('Case: Topics in another language')
          return [
            4 /*yield*/,
            (0, githubApi_1.getRepositoryTopics)('HqWu-HITCS', 'Awesome-Chinese-LLM', githubToken)
          ]
        case 2:
          otherLanguageResponse = _a.sent()
          expectedOtherLanguageTopics = [
            'llm',
            'nlp',
            'chatglm',
            'chinese',
            'llama',
            'awesome-lists'
          ]
          console.log(
            JSON.stringify(otherLanguageResponse) === JSON.stringify(expectedOtherLanguageTopics)
              ? 'Pass'
              : 'Fail'
          ) // Logs whether the response matches the expected topics (Pass) or not (Fail)
          // Case: Repo does not exist
          console.log('Case: Repo does not exist')
          return [4 /*yield*/, (0, githubApi_1.getRepositoryTopics)('no', 'repo', githubToken)]
        case 3:
          nonExistentRepoResponse = _a.sent()
          console.log(nonExistentRepoResponse === null ? 'Pass' : 'Fail') // Logs whether the response is null (Pass) or not null (Fail)
          // Case: Many categories
          console.log('Case: Many categories')
          return [
            4 /*yield*/,
            (0, githubApi_1.getRepositoryTopics)('AI4Finance-Foundation', 'FinGPT', githubToken)
          ]
        case 4:
          manyCategoriesResponse = _a.sent()
          expectedManyCategories = [
            'chatgpt',
            'finance',
            'fintech',
            'large-language-models',
            'machine-learning',
            'nlp',
            'prompt-engineering',
            'pytorch',
            'reinforcement-learning',
            'robo-advisor',
            'sentiment-analysis',
            'technical-analysis',
            'fingpt'
          ]
          console.log(
            JSON.stringify(manyCategoriesResponse) === JSON.stringify(expectedManyCategories)
              ? 'Pass'
              : 'Fail'
          ) // Logs whether the response matches the expected categories (Pass) or not (Fail)
          // Case: Empty string parameters
          console.log('Case: Empty string parameters')
          return [4 /*yield*/, (0, githubApi_1.getRepositoryTopics)('', '', githubToken)]
        case 5:
          emptyParamsResponse = _a.sent()
          console.log(emptyParamsResponse === null ? 'Pass' : 'Fail') // Logs whether the response is null (Pass) or not null (Fail)
          return [2 /*return*/]
      }
    })
  })
}
exports.testGetRepositoryTopics = testGetRepositoryTopics
//test function that calls the method and prints out all contributors
function testGetContributorCount(githubToken) {
  return __awaiter(this, void 0, void 0, function () {
    var _a,
      _b,
      _c,
      _d,
      _e,
      _f,
      _g,
      _h,
      _j,
      _k,
      _l,
      _m,
      _o,
      _p,
      _q,
      _r,
      _s,
      _t,
      _u,
      _v,
      _w,
      _x,
      _y,
      _z,
      _0,
      _1,
      _2,
      _3,
      _4,
      _5,
      _6,
      _7,
      _8,
      _9,
      _10,
      _11
    return __generator(this, function (_12) {
      switch (_12.label) {
        case 0:
          console.log('Case: Many contributors')
          console.log('Expected:', 311)
          _b = (_a = console).log
          _c = ['Actual:']
          return [
            4 /*yield*/,
            (0, githubApi_1.getContributorCount)('desktop', 'desktop', githubToken)
          ]
        case 1:
          _b.apply(_a, _c.concat([_12.sent()]))
          console.log('Case: Few contributors')
          console.log('Expected:', 20)
          _e = (_d = console).log
          _f = ['Actual:']
          return [
            4 /*yield*/,
            (0, githubApi_1.getContributorCount)('microsoft', 'AI-For-Beginners', githubToken)
          ]
        case 2:
          _e.apply(_d, _f.concat([_12.sent()]))
          //console.log('Case: Zero contributors')
          //console.log('Expected:', 0)
          //console.log('Actual:', await getContributorCount('acreturus', 'HackathonGitHub', githubToken))
          console.log('Case: 7 contributors')
          console.log('Expected:', 7)
          _h = (_g = console).log
          _j = ['Actual:']
          return [
            4 /*yield*/,
            (0, githubApi_1.getContributorCount)('Zeqiang-Lai', 'DragGAN', githubToken)
          ]
        case 3:
          _h.apply(_g, _j.concat([_12.sent()]))
          console.log('Case: 143 contributors')
          console.log('Expected:', 143)
          _l = (_k = console).log
          _m = ['Actual:']
          return [
            4 /*yield*/,
            (0, githubApi_1.getContributorCount)('geohot', 'tinygrad', githubToken)
          ]
        case 4:
          _l.apply(_k, _m.concat([_12.sent()]))
          console.log('Case: 1623 contributors')
          console.log('Expected:', 1623)
          _p = (_o = console).log
          _q = ['Actual:']
          return [
            4 /*yield*/,
            (0, githubApi_1.getContributorCount)('facebook', 'react', githubToken)
          ]
        case 5:
          _p.apply(_o, _q.concat([_12.sent()]))
          console.log('Case: 63 contributors')
          console.log('Expected:', 63)
          _s = (_r = console).log
          _t = ['Actual:']
          return [
            4 /*yield*/,
            (0, githubApi_1.getContributorCount)('spacedriveapp', 'spacedrive', githubToken)
          ]
        case 6:
          _s.apply(_r, _t.concat([_12.sent()]))
          console.log('Case: 22 contributors')
          console.log('Expected:', 22)
          _v = (_u = console).log
          _w = ['Actual:']
          return [
            4 /*yield*/,
            (0, githubApi_1.getContributorCount)('iam-abbas', 'Reddit-Stock-Trends', githubToken)
          ]
        case 7:
          _v.apply(_u, _w.concat([_12.sent()]))
          console.log('Case: 75 contributors')
          console.log('Expected:', 75)
          _y = (_x = console).log
          _z = ['Actual:']
          return [
            4 /*yield*/,
            (0, githubApi_1.getContributorCount)('GeneralMills', 'pytrends', githubToken)
          ]
        case 8:
          _y.apply(_x, _z.concat([_12.sent()]))
          console.log('Case: 3 contributors')
          console.log('Expected:', 3)
          _1 = (_0 = console).log
          _2 = ['Actual:']
          return [
            4 /*yield*/,
            (0, githubApi_1.getContributorCount)('vitalets', 'github-trending-repos', githubToken)
          ]
        case 9:
          _1.apply(_0, _2.concat([_12.sent()]))
          console.log('Case: 0 contributors')
          console.log('Expected:', 0)
          _4 = (_3 = console).log
          _5 = ['Actual:']
          return [
            4 /*yield*/,
            (0, githubApi_1.getContributorCount)('mbadry1', 'Trending-Deep-Learning', githubToken)
          ]
        case 10:
          _4.apply(_3, _5.concat([_12.sent()]))
          console.log('Case: 17 contributors')
          console.log('Expected:', 17)
          _7 = (_6 = console).log
          _8 = ['Actual:']
          return [
            4 /*yield*/,
            (0, githubApi_1.getContributorCount)('QasimWani', 'LeetHub', githubToken)
          ]
        case 11:
          _7.apply(_6, _8.concat([_12.sent()]))
          console.log('Case: 0 contributors')
          console.log('Expected:', 0)
          _10 = (_9 = console).log
          _11 = ['Actual:']
          return [
            4 /*yield*/,
            (0, githubApi_1.getContributorCount)('datawrangling', 'trendingtopics', githubToken)
          ]
        case 12:
          _10.apply(_9, _11.concat([_12.sent()]))
          return [2 /*return*/]
      }
    })
  })
}
exports.testGetContributorCount = testGetContributorCount
//void testGetRepositoryTopics('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')
void testGetContributorCount('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')
/*
testGetContributorCount('iv-org', 'invidious') //268
testGetContributorCount('microsoft', 'guidance') //98
testGetContributorCount('smol-ai', 'developer') //14
testGetContributorCount('sunner', 'ChatALL') //15
testGetContributorCount('google', 'comprehensive-rust') //155*/
