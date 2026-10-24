variable "aws_region" {
  description = "AWS region for the Jenkins host"
  type        = string
  default     = "ap-south-1"
}

variable "ami_id" {
  description = "Ubuntu 22.04 AMI ID for the selected region"
  type        = string
}

variable "key_name" {
  description = "Existing EC2 key pair name"
  type        = string
}

variable "instance_type" {
  description = "EC2 instance size; t2.large matches the tutorial baseline"
  type        = string
  default     = "t2.large"
}

variable "allowed_cidr" {
  description = "CIDR allowed to access Jenkins, SonarQube, and SSH"
  type        = string
  default     = "0.0.0.0/0"
}
