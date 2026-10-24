$ErrorActionPreference = 'Stop'

kubectl kustomize k8s/environments/dev | kubectl apply --dry-run=client -f -
Write-Host 'Kubernetes manifests rendered successfully.'
