interface HorseModel {
  id?: string,
  event: string,
  horseId: number,
  horseName: string
  startTime: number,
  finishTime: number
}

interface RaceEventModel {
  event: string,
  horse: {
    id: number,
    name: string
  },
  time: number
}

export {
  HorseModel,
  RaceEventModel
}