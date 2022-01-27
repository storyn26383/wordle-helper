declare global {
  interface Array<T> {
    shuffle: () => T[]
    unique: () => T[]
  }
}

export {}
