import { createApp } from 'vue'
import App from './App.vue'

Array.prototype.shuffle = function<T>(this: T[]): T[] {
  const result = this.slice()
  const length = this.length

  for (let i = 0; i < length; i++) {
    const j = Math.floor(Math.random() * i)
    ;[result[i], result[j]] = [result[j], result[i]]
  }

  return result
}

Array.prototype.unique = function<T>(this: T[]): T[] {
  return this.filter((value, index, array) => array.indexOf(value) === index)
}

createApp(App).mount('#app')
