export type TWeather = {
  x?: number
  y?: number
  units?: 'standard' | 'metric' | 'imperial'
  cnt?: number
}

// OpenWeather Api type
type TOWMain = {
  'temp': number
  'feels_like': number
  'temp_min': number
  'temp_max': number
  'pressure': number
  'humidity': number
  'sea_level': number
  'grnd_level': number
  'temp_kf'?: number
}

type TOWWind = {
  'speed': number
  'deg': number
  'gust': number
}

type TOWWeather = {
  'id': number
  'main': string
  'description': string
  'icon': string
}

type TOWCoord = {
  'lon': number
  'lat': number
}

type TOWCity = {
  'id': number
  'name': string
  'coord': TOWCoord
  'country': string
  'population': number
  'timezone': number
  'sunrise': number
  'sunset': number
}

export type TOWCurrent = {
  'coord': TOWCoord
  'weather': TOWWeather[]
  'base': string | 'stations'
  'main': TOWMain
  'visibility': number
  'wind': TOWWind
  'timezone': number
  'id': number
  'name': string
  'cod': number
  'clouds': {
    'all': number
  }
  'dt': number
  'sys': {
    'type': number
    'id': number
    'country': string
    'sunrise': number
    'sunset': number
  }
}

export type TOWForecast = {
  'cod': number
  'message': number
  'cnt': number
  'city': TOWCity
  'list': {
    'dt': number
    'main': TOWMain
    'weather': TOWWeather[]
    'clouds': {
      'all': number
    }
    'wind': TOWWind
    'visibility': number
    'pop': number
    'sys': {
      'pod': string
    }
    'dt_txt': string
  }[]
}
