# Local console access

These commands assume Docker Desktop Kubernetes is running and the port-forwards from the README are active.

| Console | URL | Demo login |
| --- | --- | --- |
| Release dashboard | http://localhost:18084 | No login |
| Argo CD | https://localhost:18443 | `admin` plus the `argocd-initial-admin-secret` password |
| Grafana | http://localhost:18082 | `admin` plus the `monitoring-grafana` secret password |
| Prometheus | http://localhost:18083 | No login in this demo |

Argo CD uses a local self-signed certificate. Accept the browser warning for local development.

Retrieve the demo passwords without committing them to Git:

```powershell
$argo = kubectl get secret argocd-initial-admin-secret -n argocd -o jsonpath='{.data.password}' | %{ [Text.Encoding]::UTF8.GetString([Convert]::FromBase64String($_)) }
$grafana = kubectl get secret monitoring-grafana -n monitoring -o jsonpath='{.data.admin-password}' | %{ [Text.Encoding]::UTF8.GetString([Convert]::FromBase64String($_)) }
```

The next production step is to rotate both generated passwords and replace them with secrets managed outside the repository.
