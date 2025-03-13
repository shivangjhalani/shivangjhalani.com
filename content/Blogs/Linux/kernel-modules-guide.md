---
title: A quick guide to linux kernel module programming
date: 2025-03-14
tags:
  - linux
  - C
  - low-level
comments: true
draft: false
enableToc: true
---
A Linux kernel module is precisely defined as a code segment capable of
dynamic loading and unloading within the kernel as needed. These modules
enhance kernel capabilities without necessitating a system reboot.

If not for modules the prevailing approach leans toward monolithic kernels, requiring direct integration of new functionalities into the kernel image. This approach leads to larger kernels and necessitates kernel rebuilding and subsequent system rebooting when new functionalities are desired.

`sudo apt-get install build-essential kmod`

> build-essential : commands like gcc, make, libc
> kmod : kernel module package we will explore

### View modules
1. `lsmod` : Know currently loaded kernel modules
   ![[Pasted image 20250313092959.png]]
2. `cat /proc/modules`
   ![[Pasted image 20250313093138.png]]

### To note
1. Modversioning : Module compiled for one kernel will not load for another kernel.  
   This is if `CONFIG_MODVERSIONS` is enabled in kernel. It does strict compatibility checks.
2. Use console and not X / wayland window systems. Modules cannot directly print to the screen like printf() can, but they can log information and warnings. For instant access to this information, it is advisable to perform all tasks from the console.
3. Secure boot : security standard ensuring booting exclusively through trusted software endorsed by the original equipment manufacturer.
   Simplest solution : disabling UEFI SecureBoot from the boot menu of your PC or laptop.
   Intricate solution : generating keys, system key installation, and module signing.

## Headers
Install header files for the kernel : 
```
sudo apt-get update
apt-cache search linux-headers-`uname -r`
```
![[Pasted image 20250313095240.png]]
```
sudo apt-get install kmod linux-headers-6.8.0-52-generic
```

## Hello world

### 1. The simplest module
```
mkdir -p ~/develop/kernel/hello-1
cd ~/develop/kernel/hello-1
nvim hello-1.c
```

```c
/*
 * hello-1.c - The simplest kernel module.
 */
#include <linux/module.h> /* Needed by all modules */
#include <linux/printk.h> /* Needed for pr_info() */

int init_module(void) {
  pr_info("Hello, world 1.\n");
  /* A non 0 return means init_module failed; module can't be loaded. */
  return 0;
}

void cleanup_module(void) {
  pr_info("Goodbye world 1.\n");
}

MODULE_LICENSE("GPL");
```

The Makefile
```
nvim Makefile
```

```Makefile
obj-m += hello-1.o

PWD := $(CURDIR)

all:
	$(MAKE) -C /lib/modules/$(shell uname -r)/build M=$(PWD) modules
clean:
	$(MAKE) -C /lib/modules/$(shell uname -r)/build M=$(PWD) clean

```
> Important to use tabspaces for padding in Makefile not spaces

![[Pasted image 20250313103146.png]]
> Text is just warning, it works for now ig :)

> If there is no PWD := $(CURDIR) statement in Makefile, then it may not compile correctly with sudo make. Because some environment variables arespecified by the security policy, they can’t be inherited. The default securitypolicy is sudoers. In the sudoers security policy, env_reset is enabled bydefault, which restricts environment variables. Specifically, path variables arenot retained from the user environment, they are set to default values.
> 
> 3 ways to solve
> 1. You can use the -E flag to temporarily preserve them.
> 2. You can set the env_reset disabled by editing the /etc/sudoers with root and visudo.
> 3. You can preserve environment variables by appending them to env_keep in /etc/sudoers. `Defaults env_keep += "PWD"`

If all went well...
![[Pasted image 20250313104029.png]]

`hello-1.ko` is our compiled kernel module
```
modinfo hello-1.ko
```
![[Pasted image 20250313104102.png]]

The module is not loaded yet
```
lsmod | grep hello
```
returns nothing
![[Pasted image 20250313104255.png]]

**Loading the module**
```
sudo insmod hello-1.ko
```
Now
![[Pasted image 20250313104353.png]]
The module loaded is `hello_1`, the `-` from `hello-1` was converted to `_`.
Let's investigate
```
journalctl --since "1 hour ago" | grep kernel

Mar 13 10:43:37 ubuntu kernel: hello_1: loading out-of-tree module taints kernel.
Mar 13 10:43:37 ubuntu kernel: hello_1: module verification failed: signature and/or required key missing - tainting kernel
Mar 13 10:43:37 ubuntu kernel: Hello, world 1.
```

**Remove / Unload the module**
```
sudo rmmod hello_1
```

#### How the module works
