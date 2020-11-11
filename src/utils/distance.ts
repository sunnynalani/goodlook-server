import { SelectQueryBuilder } from 'typeorm'
import { InputType, Field } from 'type-graphql'

//note
//https://wiki.melissadata.com/index.php?title=ZIP*Data%3ADistance_Calculation

@InputType()
export class distanceInput {
  @Field(() => Number)
  latitude: Number

  @Field(() => Number)
  longitude: Number

  @Field(() => Number)
  distance: Number
}

export const distanceQuery = <T>(
  query: SelectQueryBuilder<T>,
  latitude: Number,
  longitude: Number,
  distance: Number
) => {
  if (!latitude || !longitude || !distance) {
    return query
  } else {
    return query.where(
      `
      (
        power ((69.1 * (Provider.longitude - :longitude) * cos(:latitude / 57.3)), 2 ) +
        power ((69.1 * (Provider.latitude - :latitude)) , 2)
      ) < :distance
    `,
      { latitude, longitude, distance }
    )
  }
}

// not sure why this doesn't work
// return query.where(`
// (
//   ((acos(sin((:latitude*pi()/180)) *
//   sin((Provider.latitude*pi()/180))+cos((:latitude*pi()/180)) *
//   cos((Provider.latitude*pi()/180)) *
//   cos(((:longitude - Provider.longitude)*pi()/180))))*180/pi())*60*1.1515*1.609344
// ) < :distance
// `, { latitude, longitude, distance })
