import { type TField } from './field'

export type TFeature = {
  type: 'Feature'
  geometry: {
    type: 'Polygon' | 'MultiPolygon' | 'Line' | 'LineString' | 'MultiLineString' | 'Point' | 'MultiPoint'
    coordinates: any
  }
  properties: {
    id: string
  } | TField
}
