import {
  Repository,
  EntityTarget,
  ObjectLiteral,
  FindOptionsWhere,
  DataSource,
} from 'typeorm';

export abstract class AbstractRepository<
  TEntity extends ObjectLiteral,
> extends Repository<TEntity> {
  constructor(entity: EntityTarget<TEntity>, dataSource: DataSource) {
    super(entity, dataSource.createEntityManager());
  }

  async getOneByColumn(
    where: FindOptionsWhere<TEntity> | FindOptionsWhere<TEntity>[],
    relations?: string[],
  ): Promise<TEntity> {
    return this.findOne({
      where,
      relations,
    });
  }

  async getColumnCount(
    where: FindOptionsWhere<TEntity> | FindOptionsWhere<TEntity>[],
    relations?: string[],
  ): Promise<number> {
    return this.count({
      where,
      relations,
    });
  }
}
