# Local console access

These commands assume Docker Desktop Kubernetes is running and the port-forwards from the README are active.

| Console | URL | Demo login |
| --- | --- | --- |
| Release dashboard | http://localhost:18084 | No login |
| Argo CD | http://localhost:18081 | `admin` plus the `argocd-initial-admin-secret` password |
| Grafana | http://localhost:18082 | `admin` plus the `monitoring-grafana` secret password |
| Prometheus | http://localhost:18083 | No login in this demo |

Argo CD runs in insecure HTTP mode for this local demo, so no certificate warning is required.

Retrieve the demo passwords without committing them to Git:

```powershell
$argo = kubectl get secret argocd-initial-admin-secret -n argocd -o jsonpath='{.data.password}' | %{ [Text.Encoding]::UTF8.GetString([Convert]::FromBase64String($_)) }
$grafana = kubectl get secret monitoring-grafana -n monitoring -o jsonpath='{.data.admin-password}' | %{ [Text.Encoding]::UTF8.GetString([Convert]::FromBase64String($_)) }
```

The next production step is to rotate both generated passwords and replace them with secrets managed outside the repository.
