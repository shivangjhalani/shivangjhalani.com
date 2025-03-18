---
title: NixOS Configuration files
subtitle: 
date: 2025-03-18
tags:
  - nix
  - linux
comments: true
draft: 
enableToc: true
---

> [!INFO] What is this?
> A consistent project ongoing since 1 year, where I maintain my system's (daily driver OS : NixOS) configuration.  
> This is very important to me as I love to keep it very personalised and organised systematically.

# What is NixOS
**NixOS** is a Linux distribution built on the **Nix package manager**, known for its **declarative configuration, atomic upgrades, and reproducibility**.

I will explan it by telling the features it offers and one might be able to judge why I love it
- **Declarative Configuration:**
    - NixOS uses a declarative configuration, meaning you describe the desired state of your system in a configuration file (OR spread the configuration out in multiple files like I did). This makes my system highly reproducible and predictable, can just copy paste my configuration in another laptop in a matter of minutes, I will have exact replica of my system there.
        
- **Reproducible Builds:**
    - The Nix package manager ensures that software builds are reproducible, meaning they produce the same results every time. This is achieved by version locking.
        
- **Atomic Upgrades and Rollbacks:**
    - System upgrades are atomic, so they either succeed entirely or not at all, preventing broken systems. NixOS also makes it easy to roll back to previous system states, if any oopsies, don't have to reset the system! its **UNBREAKABLE**(Configurations are built in isolation, preventing dependency conflicts and ensuring system stability).

I love the control it gives me.

The learning curve for nix was kinda steep, I loved the idea but ditched it 3 times before finally understanding and adopting it.

---
## Link to my configuration files : [GitHub](https://github.com/shivangjhalani/nix-config)

---

```
❯ tree -d nix-config
.
├── home
│   └── shivang
│       └── common
│           ├── core
│           │   └── nixvim
│           │       └── config
│           │           └── plugins
│           │               ├── cmp
│           │               └── lsp
│           └── optional
│               ├── apps
│               ├── cli
│               └── desktop
│                   ├── gnome
│                   └── hyprland
├── hosts
│   ├── common
│   │   ├── core
│   │   └── optional
│   ├── qemu
│   ├── swift
│   └── x390
├── modules
│   ├── home-manager
│   └── nixos
├── overlays
└── pkgs

35 directories
```