import { type Server as S } from 'http'
import { Server, type Socket } from 'socket.io'

const app = process.env.APP_NAME ?? ''

const io = new Server({
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  },
  path: `/socket/${app}/socket.io`
})

export const createSocket = (server: S): void => {
  io.listen(server)
  io.on('connection', onConnection)
}

export const onConnection = (socket: Socket): void => {
  socket.on('join', (channel: string) => {
    console.log('Scoket join to:', channel)
    socket.join(channel)
  })

  socket.on('change', (source: TSocketChange) => {
    emit(source)
  })
}

export const emit = ({ id, type, name, data }: TSocketChange): void => {
  io.to(id).emit('change', { type, name, data })
}
