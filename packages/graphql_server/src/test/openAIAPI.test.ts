import { getRepositoryTopics } from '../api/githubApi'
import {
  getCategoryFromGPT,
  getELI5FromReadMe,
  getHackernewsSentiment
  // categorizeProjectGeneral
} from '../api/openAIApi'

//difficult to test because openAi always returns different information
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function testgetEli5FromReadMe() {
  //Test for an invalid ReadMe File
  console.log(
    '\ncalled without readme: should tell you in some way that this is not a valid ReadMe\n'
  )
  console.log(await getELI5FromReadMe('This is not a readme file'))

  //Test for an empty string as readMe
  console.log(
    '\ncalled with empty string: Should tell you in some way that this is not a valid ReadMe\n'
  )
  console.log(await getELI5FromReadMe(' '))

  //Test for "null" as a string since the method only accepts a string as parameter
  console.log(
    '\ncalled with null in string form: should tell you in some form that this is not a valid ReadMe\n'
  )
  console.log(await getELI5FromReadMe('null'))

  //Tests if the method works correctly if provided with a correct ReadMe
  const readMe = `
    SuperAGI logo, Open-source framework to build, manage and run useful Autonomous AI Agents. SuperAGI forks SuperAGI stars SuperAGI pull-requests SuperAGI Commits. Follow SuperAGI. Follow _superAGI Join SuperAGI Discord Community. Share SuperAGI Repository. Follow _superAGI Share on Telegram Share on Reddit Buy Me A Coffee. bulb Features Provision, Spawn & Deploy Autonomous AI Agents. Extend Agent Capabilities with Tools. Run Concurrent Agents Seamlessly. Graphical User Interface. Action Console. Multiple Vector DBs. Multi-Modal Agents. Agent Trajectory Fine-Tuning. Performance Telemetry. Optimized Token Usage. Agent Memory Storage. Looping Detection Heuristics. Concurrent Agents. Resource Manager. hammer_and_wrench Tools Slack Email Jira File Manager Google Search Dall-E Github Web Interaction Zapier Instagram Trello Google Analytics Duckduckgo Discord. computer Screenshots GUI. SuperAGI logo. motorway Roadmap Click here to checkout the latest roadmap link. gear Setting up Download the repo using git clone https://github.com/TransformerOptimus/SuperAGI.git in your terminal or directly from github page in zip format. Navigate to the directory using cd SuperAGI and create a copy of config_template.yaml and name it config.yaml. Enter your unique OpenAI API Key, Google key, Custom search engine ID without any quotes or spaces in config.yaml file. Follow the links below to get your keys: Keys Accessing the keys OpenAI API Key Sign up and create an API key at OpenAI Developer Google API key Create a project in the Google Cloud Console and enable the API you need (for example: Google Custom Search JSON API). Then, create an API key in the "Credentials" section. Custom search engine ID Visit Google Programmable Search Engine to create a custom search engine for your application and obtain the search engine ID. Ensure that Docker is installed in your system, if not, Install it from here. Once you have Docker Desktop running, run command : docker-compose up --build in SuperAGI directory. Open your browser and go to localhost:3000 to see SuperAGI running. warning Under Development! This project is under active development and may still have issues. We appreciate your understanding and patience. If you encounter any problems, please first check the open issues. If your issue is not listed, kindly create a new issue detailing the error or problem you experienced. Thank you for your support! film_projector Curated Videos How To Install SuperAGI on: Github Codespaces Windows/MacOS/Linux woman_technologist Contributors TransformerOptimus Cptsnowcrasher vectorcrow Akki-jain Autocop-AgentCOLONAYUSHluciferlinx101mukundans89Fluder-ParadynenborthynihirrTarraann starStar History Star History Chart
    `
  console.log('\ncalled with valid readme: should return a summary of the readMe\n')
  console.log(await getELI5FromReadMe(readMe))

  //Tests what happens when readMe just contains random simbols
  console.log(
    '\ncalled with random signs: Should tell you in some way that the provided ReadMe is not valid\n'
  )
  console.log(await getELI5FromReadMe('!@#$%^&*'))

  //tests what happens when the readMe is in a different language
  const readMechinese = `✯ 一个国内可直连的直播源分享项目 ✯
no_bell 永久免费 直连访问 完整开源 不含广告 完善的台标 直播源支持IPv4/IPv6双栈访问 no_bell
GitHub Repo stars GitHub forks GitHub issues GitHub watchers GitHub contributors GitHub

man_juggling直播源:
名称	直播源地址	完善源	频道数	更新时间
tvIPTV(IPV6专用)	https://live.fanmingming.com/tv/m3u/ipv6.m3u	编辑该源	112个	2023.6.16
earth_asiaGlobal直播源	https://live.fanmingming.com/tv/m3u/global.m3u	编辑该源	194个	2023.5.21
radioRadio直播源	https://live.fanmingming.com/radio/m3u/index.m3u	编辑该源	317个	2023.5.3
hammer_and_wrench工具
newEPG接口地址(测试)
https://live.fanmingming.com/e.xml
globe_with_meridiansM3U8 Web Player
Demolink https://live.fanmingming.com/player/?vurl=https://livedoc.cgtn.com/500d/prog_index.m3u8
book说明
所有播放源均收集于互联网，仅供测试研究使用，切勿商用。
通过M3U8 Web Player测试直播源需使用https协议的直播源链接。
部分广播电台节目播出具有一定的时效性，需要在指定时段进行收听。
本项目不存储任何的流媒体内容，所有的法律责任与后果应由使用者自行承担。
您可以Fork本项目，但引用本项目内容到其他仓库的情况，务必要遵守开源协议。
本项目不保证直播频道的有效性，直播内容可能受直播服务提供商因素影响而失效。
所有文件均托管在GitHub且自动构建，由项目发起人公益维护，欢迎Star本项目或点击Issues反馈您的问题。
您可以编辑本项目的m3u文件或上传缺失的频道Logo到tv或radio目录下并发起拉取请求，收到请求后我们会对您提交的内容进行验证，审核通过后会自动发布。
notebook_with_decorative_cover更新
2023.6.16
IPv6源去掉了两个失效的频道。`

  console.log('\ncalled with chinese ReadMe: Should return an english summary of the readMe\n')
  console.log(await getELI5FromReadMe(readMechinese))
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function testHackerNewsSentiment() {
  //get real comments from method in hackerNewsScraper. E.g. searchHackerNewsStories('SuperAGI')

  const comments =
    '&gt; What do you think?<p>Universal basic incoom. This is what I argue in my post on AI&#x27;s impact on programming jobs -- my take is that if AI ends up automating low end tasks, then it opens up opportunities for us to spend our time on more creative and challenging problems. The current generation of models know all the data structures and algorithms but do they have the ability to extrapolate their knowledge to come up with novel solutions to unseen problems -- which is what we are good at. Similarly, there are tons of interesting problems which are unsolved in other domains and we could use AI&#x27;s help to tackle those. Naval Ravikant talks about something similar on Joe Rogan Podcast -- where he says everybody can be rich. His argument was that if every human on the planet could become an engineer, or doctor, or scientist, we would solve all of our basic problems in few years and then humanity would be free to explore creative things. So if AI gets us there, we could be writers, actors, scientists.<p><a href='
  console.log(await getHackernewsSentiment(comments))
}

//das ganze ding ist noch bisschen unpredictable
export async function testGetHackernewsSentiment() {
  // Test for an empty call
  console.log(
    '\nCalled with empty string: Should tell you that you that it can not find any comments\n'
  )
  console.log(await getHackernewsSentiment(''))

  // Test for invalid strings as parameters
  console.log('\nCalled with invalid strings: Should tell you that no comments can be found\n')
  console.log(await getHackernewsSentiment('These are not valid comments'))

  // Test for null parameters
  console.log(
    '\nCalled with null parameter as a string: Should tell you that the parameters are not valid\n' //hier reeturned er aus irgendeinem grund noch was
  )
  console.log(await getHackernewsSentiment('null'))

  // Test for a very long string as parameters
  console.log(
    '\nCalled with a very long string as parameters: Should tell you that there are no comments\n'
  )
  const longString = 'a'.repeat(10000)
  console.log(await getHackernewsSentiment(longString))

  // Test for different languages as parameters
  console.log(
    '\nCalled with different languages as parameters: Should return a sentiment analysis in English\n'
  )
  console.log(
    await getHackernewsSentiment(
      '&gt; Was denken Sie?<p>Bedingungsloses Grundeinkommen. Das ist das, wofür ich mich in meinem Beitrag über die Auswirkungen von KI auf Programmierjobs einsetze - meiner Meinung nach eröffnen sich durch die Automatisierung einfacher Aufgaben durch KI Möglichkeiten für uns, unsere Zeit mit kreativeren und anspruchsvolleren Problemen zu verbringen. Die aktuellen Modelle kennen alle Datenstrukturen und Algorithmen, aber haben sie die Fähigkeit, ihr Wissen zu extrapolieren, um neuartige Lösungen für ungelöste Probleme zu finden - das ist es, was wir können. Ebenso gibt es in anderen Bereichen viele interessante ungelöste Probleme, bei denen wir die Hilfe von KI nutzen könnten. Naval Ravikant spricht in einem ähnlichen Zusammenhang im Joe Rogan Podcast darüber - er sagt, jeder könne reich sein. Sein Argument war, dass, wenn jeder Mensch auf dem Planeten Ingenieur, Arzt oder Wissenschaftler werden könnte, wir alle grundlegenden Probleme in wenigen Jahren lösen würden und dann die Menschheit frei wäre, kreative Dinge zu erkunden. Wenn uns KI dorthin bringt, könnten wir Schriftsteller, Schauspieler, Wissenschaftler sein.<p><a href='
    )
  )

  // Test for multiple languages as parameters
  console.log(
    '\nCalled with multiple languages as parameters: Should return a sentiment analysis in English\n'
  )
  console.log(
    await getHackernewsSentiment(
      '&gt; What do you think?<p>Universal basic incoom. This is what I argue in my post on AI&#x27;s impact on programming jobs -- meine Meinung zu Ai ist, dass sie in jeder hinsicht hilfreich ist und besonders an dieser stelle'
    )
  )
}

//void testCategorization('next.js', 'vercel')
//void testgetEli5FromReadMe()
void testGetHackernewsSentiment()
