<h1 align="center">
  <br>
  <img src="https://raw.githubusercontent.com/gabrielmaialva33/winx-ai/master/.github/assets/fairy.png" alt="Winx IA" width="200">
  <br>
  OpenAI bot for <a href="https://web.telegram.org/">Telegram</a>
  <br>
</h1>

<p align="center">
  <img src="https://wakatime.com/badge/user/e61842d0-c588-4586-96a3-f0448a434be4/project/30a1c561-2429-4ca9-813a-3f081cb9b391.svg" alt="wakatime">
  <img src="https://img.shields.io/github/languages/top/gabrielmaialva33/winx-ai?style=flat&logo=appveyor" alt="GitHub top language" >
  <img src="https://img.shields.io/github/languages/count/gabrielmaialva33/winx-ai?style=flat&logo=appveyor" alt="GitHub language count" >
  <img src="https://img.shields.io/github/repo-size/gabrielmaialva33/winx-ai?style=flat&logo=appveyor" alt="Repository size" >
  <img src="https://img.shields.io/github/license/gabrielmaialva33/winx-ai?color=00b8d3?style=flat&logo=appveyor" alt="License" /> 
  <a href="https://github.com/gabrielmaialva33/winx-ai/commits/master">
    <img src="https://img.shields.io/github/last-commit/gabrielmaialva33/winx-ai?style=flat&logo=appveyor" alt="GitHub last commit" >
    <img src="https://img.shields.io/badge/made%20by-Maia-15c3d6?style=flat&logo=appveyor" alt="Maia" >  
  </a>
</p>

<p align="center">
  <a href="#bookmark-about">About</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#computer-technologies">Technologies</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#package-installation">Installation</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#memo-license">License</a>
</p>

<br>

## :bookmark: About

**Winx AI** is a simple and easy to use OpenAI to interact in group chats. written in Typescript.

<br>

## :computer: Technologies

- **[Typescript](https://www.typescriptlang.org/)**
- **[Node.js](https://nodejs.org/)**
- **[GrammY](https://grammy.dev/)**
- **[OpenAI](https://openai.com/)**

## :package: Installation

```bash
# clone the repository
git clone https://github.com/gabrielmaialva33/winx-ai.git
# enter the directory
cd winx-ai
# install the dependencies
yarn # or npm install
# copy the .env.example file to .env
cp .env.example .env
# run the bot
yarn start:dev # or pm2 start ecosystem.config.js
```

### :wrench: **Configuration**

open the .env file and fill in the fields

```env
# Telegram
API_ID=123456 # Your API ID
API_HASH=123456 # Your API HASH

# Bot
BOT_TOKEN=123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11 # Your bot token
GROUP_ID=-123456789, 123456789 # Your group ids allowed to use the bot (separated by commas)

# Sessions
STRING_SESSION=1AZ... # Your session 1

# OpenIA
OPENAI_TOKEN=sk-1234567890... # Your OpenAI token
```

### :arrow_forward: **Commands**

```bash
/start - Start the bot
/imagine - Imagine an image
/variation - Variation of reply image
```

### :writing_hand: **Author**

| [![Maia](https://avatars.githubusercontent.com/u/26732067?size=100)](https://github.com/mrootx) |
| ----------------------------------------------------------------------------------------------- |
| [Maia](https://github.com/gabrielmaialva33)                                                     |

## License

[MIT License](./LICENSE)
