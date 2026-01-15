import { defineStore } from 'pinia'

export const useSnackbarStore = defineStore('snackbar', {
  state: () => ({
    visible: false,
    message: '',
    type: 'info', // info | success | error | warning
    timeout: 5000
  }),

  actions: {
    show(message, options = {}) {
      this.message = message
      this.type = options.type || 'info'
      this.timeout = options.timeout || 5000
      this.visible = true

      if (this.timeout) {
        setTimeout(() => {
          this.visible = false
        }, this.timeout)
      }
    },

    hide() {
      this.visible = false
    }
  }
})
