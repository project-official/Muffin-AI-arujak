import { Command } from '../modules'
import { type Message } from 'discord.js'

export default class extends Command {
  public constructor() {
    super('학습데이터량')
  }
  public execute(msg: Message, args: string[]) {
    msg.client.chatBot.db.all().then(rows => {
      const muffin: any[] = []
      rows.forEach(row => {
        if (row.persona === 'muffin') muffin.push(row)
      })
      msg.channel.send(`머핀 데이터: ${muffin.length}개`)
    })
  }
}
