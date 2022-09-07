// User defined type definitions. Please add type definitions for global types here

interface DBContributors {
  readonly id: string
  readonly commits: number,
  readonly first_commit_time: string
  readonly last_commit_time: string
}

interface Meta {
  readonly itemCount: number,
}