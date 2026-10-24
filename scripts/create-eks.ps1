param(
  [string]$ClusterName = 'gitops-progressive-delivery',
  [string]$Region = 'ap-south-1',
  [string]$NodeType = 't3.medium',
  [int]$Nodes = 2
)

$ErrorActionPreference = 'Stop'
eksctl create cluster --name $ClusterName --region $Region --node-type $NodeType --nodes $Nodes
kubectl get nodes
