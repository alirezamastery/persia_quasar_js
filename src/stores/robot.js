import {defineStore} from 'pinia'

export const useRobotStore = defineStore({
  id: 'robot',
  state: () => ({
    robotRunning: false,
    robotIsOn: null,
  }),
  getters: {},
  actions: {
    HandleFetch(response) {
      console.log('HandleRobotFetch | response:', response)
      const data = response['data']
      this.robotRunning = data['robot_running']
      this.robotIsOn = data['robot_is_on']
    },
    HandleRobotStatus(response) {
      console.log('HandleRobotStatus | response:', response)
      this.robotRunning = response['data']['robot_running']
    },
    HandleRobotStop(response) {
      console.log('HandleRobotStop | response:', response)
      this.robotIsOn = response['data']['robot_is_on']
    },
  }
})

export default useRobotStore
