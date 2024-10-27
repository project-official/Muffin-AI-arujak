import { ChatInputCommandInteraction, Message, codeBlock } from 'discord.js'
import { ApplyOptions } from '@sapphire/decorators'
import { Command } from '@sapphire/framework'

@ApplyOptions<Command.Options>({
  name: '리스트',
  aliases: ['list', '목록'],
  description: '당신이 가ㄹ르쳐준 단어를 나열해요.',
  detailedDescription: {
    usage: '머핀아 리스트',
  },
})
export default class ListCommand extends Command {
  public registerApplicationCommands(registry: Command.Registry) {
    registry.registerChatInputCommand(builder =>
      builder.setName(this.name).setDescription(this.description),
    )
  }

  private async _run(ctx: Message | ChatInputCommandInteraction) {
    const user = ctx instanceof Message ? ctx.author : ctx.user
    const ephemeral =
      ctx instanceof ChatInputCommandInteraction ? { ephemeral: true } : null
    const db = this.container.database
    const data = await db.learn.findMany({
      where: {
        user_id: user.id,
      },
    })
    const list: string[] = []

    if (!data[0]) {
      return await ctx.reply({
        ...ephemeral,
        content: '당신ㄴ은 단어를 가르쳐준 기억이 없ㅅ는데요.',
      })
    }

    for (const listData of data) {
      list.push(listData.command)
    }

    await ctx.reply({
      embeds: [
        {
          title: `${user.username}님의 지식`,
          description: `총합: ${data.length}개\n${codeBlock(
            'md',
            list.map(item => `-  ${item}`).join('\n'),
          )}`,
          color: this.container.embedColors.default,
          timestamp: new Date().toISOString(),
        },
      ],
    })
  }

  public async messageRun(msg: Message<boolean>) {
    await this._run(msg)
  }

  public async chatInputRun(interaction: ChatInputCommandInteraction) {
    await this._run(interaction)
  }
}
