# Outline Helm Chart

![MIT License](https://img.shields.io/github/license/IQNeoXen/outline-helm-chart)
![Release Charts](https://github.com/IQNeoXen/outline-helm-chart/actions/workflows/release.yml/badge.svg?branch=main)

An independently maintained Helm chart for deploying [Outline](https://www.getoutline.com/) on Kubernetes.

> This repository is an independently maintained fork of the Outline Helm chart
> originally published by community-charts/helm-charts.
>
> It is not affiliated with, endorsed by, or sponsored by Outline or
> community-charts.

## Installation

[Helm](https://helm.sh) must be installed to use this chart.

```console
helm repo add outline https://IQNeoXen.github.io/outline-helm-chart
helm repo update
helm install outline outline/outline
```

## Source and Attribution

This chart was originally derived from the Outline chart in
https://github.com/community-charts/helm-charts, licensed under the MIT License.

## License

MIT. See [LICENSE](LICENSE).
