import { container } from '@sapphire/framework'
import type { MaaDatabase } from './database'
import type { Message } from 'discord.js'

export default class ChatBot {
  public constructor(public db: MaaDatabase) {
    setInterval(async () => {
      this.db.ping()
    }, 60000)
  }

  public async getResponse(msg: Message): Promise<string | null> {
    const prefix = container.prefix
    const args = msg.content.slice(prefix.length).trim().split(/ +/g).join(' ')
    const learn = await this.db.learn.findOne(args)
    const learnData = learn[Math.floor(Math.random() * learn.length)]

    if (!learnData) return null

    container.logger.debug(`[ChatBot] command: ${args}`)

    container.logger.debug(`[ChatBot] response: ${learnData.result}`)

    return `${learnData.result}\n\`${
      (await msg.client.users.fetch(learnData.user_id)).username
    }님이 알려주셨어요.\``
  }
}
