---
title: Scaling to 1M requests per second
subtitle:
date: 2026-02-09
tags:
comments: true
draft: true
enableToc: true
---
At this scale, we need to know what's going on under the hood, there is no way we can scale to this level efficiently without doing so.

### A local setup to understand resource utilization
> A few concepts
> Core utilization = (total time - total idle time) / total time \* 100
> CPU utilization = sum(all core utilization) -> you get a % higher than 100

