import { LearnTable, NSFWContentTable, StatementTable } from './model'
import { createPool, type QueryResult } from 'mysql2/promise'
import { container } from '@sapphire/framework'

export class MaaDatabase {
  public readonly database = createPool({
    ...container.config.mysql,
    keepAliveInitialDelay: 10000,
    enableKeepAlive: true,
  })
    .on('release', conn => {
      container.logger.debug(`[MaaDatabase] ${conn.threadId} Released.`)
    })
    .on('connection', conn => {
      container.logger.debug(`[MaaDatabase] ${conn.threadId} Connected.`)
    })
  public statement = new StatementTable(this.database)
  public nsfwContent = new NSFWContentTable(this.database)
  public learn = new LearnTable(this.database)

  public ping() {
    this.database.getConnection().then(conn => {
      conn.ping()
      conn.release()
    })
  }
}
