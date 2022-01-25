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

  enum STATUS {
    A = 'a',
    B = 'b',
    X = 'x',
  }

  interface Result {
    1: STATUS
    2: STATUS
    3: STATUS
    4: STATUS
    5: STATUS
  }

  interface Round {
    answer: string
    result: Result
  }

  interface Rounds {
    1: Round
    2: Round
    3: Round
    4: Round
    5: Round
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

  function handleClick(round: keyof Rounds, slot: keyof Result) {
    if (rounds[round].result[slot] === STATUS.X) return rounds[round].result[slot] = STATUS.A
    if (rounds[round].result[slot] === STATUS.A) return rounds[round].result[slot] = STATUS.B
    if (rounds[round].result[slot] === STATUS.B) return rounds[round].result[slot] = STATUS.X
  }

  const words = computed(() => {
    return dictionary.filter((word) => {
      for (const round in rounds) {
        const answer = rounds[round].answer

        if (answer.length !== 5) return true

        for (const slot in rounds[round].result) {
          if (word.includes(answer.slice(+slot - 1, +slot))) return false
        }
      }

      return true
    }).slice(0, 100).shuffle()
  })

  const candidates = computed(() => {
    return dictionary.filter((word) => {
      for (const round in rounds) {
        const answer = rounds[round].answer

        if (answer.length !== 5) return true

        for (const slot in rounds[round].result) {
          const wordLetter = word.slice(+slot - 1, +slot)
          const answerLetter = answer.slice(+slot - 1, +slot)

          if (rounds[round].result[slot] === STATUS.A && wordLetter !== answerLetter) return false
          if (rounds[round].result[slot] === STATUS.B && !word.includes(answerLetter)) return false
          if (rounds[round].result[slot] === STATUS.B && wordLetter === answerLetter) return false
          if (rounds[round].result[slot] === STATUS.X && word.includes(answerLetter)) return false
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
    margin-right: 1rem;
    font-size: 1.5rem;
    font-weight: bold;
  }

  input {
    width: 5rem;
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
    width: 10rem;
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
