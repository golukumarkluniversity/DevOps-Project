# Tutorial mapping

This project follows the public tutorial [DevOps Real Time Projects](https://youtu.be/Ybx_CGiEKZ4) while adapting the deployment to a safer GitOps layout.

| Tutorial section | Project implementation |
| --- | --- |
| Terraform EC2 for Jenkins and SonarQube | `terraform/` |
| Jenkins CI pipeline | `Jenkinsfile` |
| Docker build and Trivy scan | `docker/Dockerfile` and Jenkins stages |
| EKS cluster | `scripts/create-eks.ps1` |
| Prometheus and Grafana | `scripts/install-platform.ps1` |
| Argo CD | `k8s/argocd/application.yaml` |
| GitOps deployment | `k8s/environments/dev/` |
| Progressive delivery | Argo Rollouts and `AnalysisTemplate` in `k8s/base/` |

The tutorial uses a direct Deployment. This project keeps the same CI/CD path but upgrades the Kubernetes delivery step to canary releases with automated analysis and rollback.

## AWS cost control

Do not run `terraform apply` or `eksctl create cluster` unless you have an AWS budget and credentials configured. Destroy resources after the exercise:

```powershell
terraform -chdir=terraform destroy
eksctl delete cluster --name gitops-progressive-delivery --region ap-south-1
```
