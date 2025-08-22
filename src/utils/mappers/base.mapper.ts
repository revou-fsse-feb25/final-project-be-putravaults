import { plainToInstance, ClassConstructor } from 'class-transformer';

export abstract class BaseMapper {
  /**
   * Maps a single entity to a DTO
   */
  static mapToDto<T, U>(
    dtoClass: ClassConstructor<U>,
    entity: T,
    options?: any
  ): U {
    return plainToInstance(dtoClass, entity, {
      excludeExtraneousValues: true,
      enableImplicitConversion: true,
      ...options,
    });
  }

  /**
   * Maps an array of entities to DTOs
   */
  static mapToDtoArray<T, U>(
    dtoClass: ClassConstructor<U>,
    entities: T[],
    options?: any
  ): U[] {
    return entities.map(entity => 
      this.mapToDto(dtoClass, entity, options)
    );
  }

  /**
   * Maps with nested relations
   */
  static mapWithRelations<T, U>(
    dtoClass: ClassConstructor<U>,
    entity: T,
    relationMappers?: { [key: string]: ClassConstructor<any> }
  ): U {
    const mapped = this.mapToDto(dtoClass, entity);
    
    if (relationMappers && entity) {
      Object.keys(relationMappers).forEach(relationKey => {
        const relationData = (entity as any)[relationKey];
        if (relationData) {
          if (Array.isArray(relationData)) {
            (mapped as any)[relationKey] = this.mapToDtoArray(
              relationMappers[relationKey],
              relationData
            );
          } else {
            (mapped as any)[relationKey] = this.mapToDto(
              relationMappers[relationKey],
              relationData
            );
          }
        }
      });
    }
    
    return mapped;
  }
}
