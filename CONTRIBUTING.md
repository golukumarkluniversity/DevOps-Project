# Contributing

1. Create a branch and make a focused change.
2. Run `npm test`.
3. Render the deployment with `kubectl kustomize k8s/environments/dev`.
4. Open a pull request and describe the rollout and rollback impact.

Merges to `main` are the only path that updates the development GitOps image tag. Production promotion should use a separate protected environment and approval rule rather than editing the development overlay directly.
