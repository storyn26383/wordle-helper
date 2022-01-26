<template>
  <div class="round" :key="round" v-for="(_, round) in rounds">
    <input type="text" v-model="rounds[round].answer">
    <div class="results">
      <button
        :class="`status-${status}`"
        :key="slot"
        tabindex="99999"
        v-for="(status, slot) in rounds[round].result"
        @click="handleClick(round, slot)"
      />
    </div>
  </div>
  <div>
    <label><input type="checkbox" v-model="duplicate">Duplicate Letters</label>
  </div>
  <div class="list">
    <section>
      <h2>Words</h2>
      <ul>
        <li :key="i" v-for="(word, i) in words">{{ word }}</li>
      </ul>
    </section>
    <section>
      <h2>Candidates</h2>
      <ul>
        <li :key="i" v-for="(candidate, i) in candidates">{{ candidate }}</li>
      </ul>
    </section>
  </div>
</template>

<script setup lang="ts">
  import dictionary from './dictionary'
  import { ref, reactive, computed } from 'vue'

  declare global {
    interface Array<T> {
      shuffle: () => T[]
      unique: () => T[]
    }
  }

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

  enum STATUS {
    A = 'a',
    B = 'b',
    X = 'x',
  }

  type Result = {
    1: STATUS,
    2: STATUS,
    3: STATUS,
    4: STATUS,
    5: STATUS,
  }

  interface Round {
    answer: string
    result: Result
  }

  type Rounds = {
    1: Round,
    2: Round,
    3: Round,
    4: Round,
    5: Round,
  }

  const rounds = reactive<Rounds>({
    1: {
      answer: '',
      result: {
        1: STATUS.X,
        2: STATUS.X,
        3: STATUS.X,
        4: STATUS.X,
        5: STATUS.X,
      },
    },
    2: {
      answer: '',
      result: {
        1: STATUS.X,
        2: STATUS.X,
        3: STATUS.X,
        4: STATUS.X,
        5: STATUS.X,
      },
    },
    3: {
      answer: '',
      result: {
        1: STATUS.X,
        2: STATUS.X,
        3: STATUS.X,
        4: STATUS.X,
        5: STATUS.X,
      },
    },
    4: {
      answer: '',
      result: {
        1: STATUS.X,
        2: STATUS.X,
        3: STATUS.X,
        4: STATUS.X,
        5: STATUS.X,
      },
    },
    5: {
      answer: '',
      result: {
        1: STATUS.X,
        2: STATUS.X,
        3: STATUS.X,
        4: STATUS.X,
        5: STATUS.X,
      },
    },
  })

  const duplicate = ref(false)

  function handleClick(round: keyof Rounds, slot: keyof Result) {
    if (rounds[round].result[slot] === STATUS.X) return rounds[round].result[slot] = STATUS.A
    if (rounds[round].result[slot] === STATUS.A) return rounds[round].result[slot] = STATUS.B
    if (rounds[round].result[slot] === STATUS.B) return rounds[round].result[slot] = STATUS.X
  }

  const words = computed(() => {
    return dictionary.filter((word) => {
      const letters = word.split('')

      if (!duplicate.value && letters.length !== letters.unique().length) {
        return false
      }

      for (const { answer, result } of Object.values(rounds)) {
        if (answer.length !== 5) return true

        let slot = 0

        for (const _ of Object.values(result)) {
          if (word.includes(answer.slice(slot, ++slot))) return false
        }
      }

      return true
    }).slice(0, 100).shuffle()
  })

  const candidates = computed(() => {
    return dictionary.filter((word) => {
      const letters = word.split('')

      for (const { answer, result } of Object.values(rounds)) {
        if (answer.length !== 5) return true

        let slot = 0

        for (const status of Object.values(result)) {
          const w = letters[slot]
          const a = answer.slice(slot, ++slot)

          if (status === STATUS.A && w !== a) return false
          if (status === STATUS.B && !word.includes(a)) return false
          if (status === STATUS.B && w === a) return false
          if (status === STATUS.X && word.includes(a)) return false
        }
      }

      return true
    }).slice(0, 100).shuffle()
  })
</script>

<style>
  * {
    margin: 0;
    padding: 0;
  }

  #app {
    font-family: monospace;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    touch-action: manipulation;
    text-align: center;
    color: #2c3e50;
    padding: 2rem 0;
  }

  div + div {
    margin-top: 1rem;
  }

  label {
    font-size: 1.5rem;
    font-weight: bold;
    display: inline-flex;
    align-items: center;
  }

  input {
    width: 6rem;
    height: 3rem;
    padding: 0 0.5rem;
    font-size: 1.5rem;
  }

  button {
    width: 2.5rem;
    height: 2.5rem;
    border: none;
  }

  button + button {
    margin-left: 0.5rem;
  }

  h2 {
    margin-bottom: 0.5rem;
    font-weight: bolder;
  }

  ul {
    width: 8rem;
    padding: 0;
  }

  li {
    list-style: none;
    font-size: 1.5rem;
    font-weight: bold;
  }

  .round {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .results {
    padding-left: 1rem;
  }

  .status-a {
    background-color: #538d4e;
  }

  .status-b {
    background-color: #b59f3b;
  }

  .status-x {
    background-color: #3a3a3c;
  }

  .list {
    display: flex;
    justify-content: center;
    text-align: center;
  }
</style>
