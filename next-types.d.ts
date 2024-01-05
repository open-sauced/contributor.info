// User defined type definitions. Please add type definitions for global types here

interface Meta {
  readonly itemCount: number;
}

interface DBContributorsPR {
  readonly event_id: string;
  readonly pr_additions: number;
  readonly pr_author_login: string;
  readonly pr_base_label: string;
  readonly pr_changed_files: number;
  readonly pr_comments: number;
  readonly pr_commits: number;
  readonly pr_created_at: string;
  readonly pr_deletions: number;
  readonly pr_head_label: string;
  readonly pr_is_draft: boolean;
  readonly pr_is_merged: boolean;
  readonly pr_head_ref: string;
  readonly pr_merged_at: string;
  readonly pr_number: number;
  readonly pr_state: string;
  readonly pr_title: string;
  readonly pr_updated_at: string;
  readonly repo_name: string;
  readonly pr_closed_at: string;
}
