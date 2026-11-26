# GitHub repository setup

Verified on 27 November 2026 for `Bvitriak/bvitriak`.

## Repository

- Visibility: public.
- Default branch: `main`.
- Issues and Projects are enabled. Pull requests are enabled.
- Repository description: `Bvitriak portfolio – design and development`.
- Homepage: `https://bvitriak.github.io/bvitriak/`.
- Repository topics: `github-pages`, `nextjs`, `portfolio`.
- Merge methods: squash and rebase. Merge commits are disabled to keep history linear.
- Merged head branches are deleted automatically.
- Actions workflow permissions default to read-only; workflows cannot approve pull requests.
- Secret scanning, push protection, and Dependabot security updates are enabled.

## GitHub Pages

- Build source: GitHub Actions (`build_type: workflow`).
- Pages URL: `https://bvitriak.github.io/bvitriak/`.
- The deployment workflow runs on pushes to `main` or manual dispatch from `main`.
- The workflow builds with the repository base path and deploys through the `github-pages` environment.
- The Pages environment deployment policy permits only `main`.
- No deployment has run yet. The first deployment requires the workflow to be merged into `main` and run there.

## Main branch protection

- Pull requests are required; approving reviews are not required because this is a single-owner repository.
- Administrator enforcement is enabled.
- Force pushes and branch deletion are blocked.
- Linear history and pull request conversation resolution are required.
- Required status checks are pending the first pull request workflow run. Add the exact CI check name after GitHub reports it.

## Issues and project tracking

- Issue forms are provided for bug reports and feature requests.
- Pull requests use a repository template and should link the related issue with `Closes #<issue>`.
- Dependabot checks npm packages and GitHub Actions weekly.
- Milestone `Portfolio repository setup` tracks the initial setup.
- Private linked Project: [Bvitriak Kanban](https://github.com/users/Bvitriak/projects/8).
- The project has an `Issues` table and a `Kanban` board. Its built-in statuses are `Todo`, `In Progress`, and `Done`.
- Keep issue labels, assignees, milestones, linked pull requests, and project status current.
- Issue #1 tracks the repository setup and is in progress.
