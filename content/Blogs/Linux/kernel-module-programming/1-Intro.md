---
title: 1-Intro
date: 2025-03-14
tags:
  - linux
  - C
  - low-level
  - kernel
comments: true
draft: false
enableToc: true
---
# Intro
A Linux kernel module is precisely defined as a code segment capable of
dynamic loading and unloading within the kernel as needed. These modules
enhance kernel capabilities without necessitating a system reboot.

If not for modules the prevailing approach leans toward monolithic kernels, requiring direct integration of new functionalities into the kernel image. This approach leads to larger kernels and necessitates kernel rebuilding and subsequent system rebooting when new functionalities are desired.

`sudo apt-get install build-essential kmod`

> build-essential : commands like gcc, make, libc
> kmod : kernel module package we will explore

**View modules**
1. `lsmod` : Know currently loaded kernel modules
   ![[attachments/Pasted image 20250313092959.png]]
2. `cat /proc/modules`
   ![[attachments/Pasted image 20250313093138.png]]

 **To note**
1. Modversioning : Module compiled for one kernel will not load for another kernel.  
   This is if `CONFIG_MODVERSIONS` is enabled in kernel. It does strict compatibility checks.
2. Use console and not X / wayland window systems. Modules cannot directly print to the screen like printf() can, but they can log information and warnings. For instant access to this information, it is advisable to perform all tasks from the console.
3. Secure boot : security standard ensuring booting exclusively through trusted software endorsed by the original equipment manufacturer.
   Simplest solution : disabling UEFI SecureBoot from the boot menu of your PC or laptop.
   Intricate solution : generating keys, system key installation, and module signing.

---
# Let's start
## Headers
Install header files for the kernel : 
```
sudo apt-get update
apt-cache search linux-headers-`uname -r`
```
![[attachments/Pasted image 20250313095240.png]]
```
sudo apt-get install kmod linux-headers-6.8.0-52-generic
```

## Hello world

### Simplest module

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

```makefile
obj-m += hello-1.o

PWD := $(CURDIR)

all:
	$(MAKE) -C /lib/modules/$(shell uname -r)/build M=$(PWD) modules
clean:
	$(MAKE) -C /lib/modules/$(shell uname -r)/build M=$(PWD) clean

```
> Good and almost necessary convention to use tabspaces for padding.

![[attachments/Pasted image 20250313103146.png]]
> Text is just warning, it works for now ig :)

> If there is no PWD := $(CURDIR) statement in Makefile, then it may not compile correctly with sudo make. Because some environment variables arespecified by the security policy, they can’t be inherited. The default securitypolicy is sudoers. In the sudoers security policy, env_reset is enabled bydefault, which restricts environment variables. Specifically, path variables arenot retained from the user environment, they are set to default values.
> 
> 3 ways to solve
> 1. You can use the -E flag to temporarily preserve them.
> 2. You can set the env_reset disabled by editing the /etc/sudoers with root and visudo.
> 3. You can preserve environment variables by appending them to env_keep in /etc/sudoers. `Defaults env_keep += "PWD"`

If all went well...
![[attachments/Pasted image 20250313104029.png]]

`hello-1.ko` is our compiled kernel object file
```
modinfo hello-1.ko
```
![[attachments/Pasted image 20250313104102.png]]

The module is not loaded yet
```
lsmod | grep hello
```
returns nothing
![[attachments/Pasted image 20250313104255.png]]

**Loading the module**
```
sudo insmod hello-1.ko
```

> Good to know:  Here if we had `return -1;` in the code, we would get an error `insmod: ERROR: could not insert module hello-1.ko: Operation not permitted`  

Now
![[attachments/Pasted image 20250313104353.png]]
The module loaded is `hello_1`, the `-` from `hello-1` was converted to `_`.

**Remove / Unload the module**
```
sudo rmmod hello_1
```

**See the output**
```
journalctl --since "1 hour ago" | grep kernel

Mar 14 22:58:33 ubuntu sudo[2935]:  shivang : TTY=pts/0 ; PWD=/home/shivang/develop/kernel/hello-1 ; USER=root ; COMMAND=/usr/sbin/insmod hello-1.ko
Mar 14 22:58:33 ubuntu kernel: hello_1: loading out-of-tree module taints kernel.
Mar 14 22:58:33 ubuntu kernel: hello_1: module verification failed: signature and/or required key missing - tainting kernel
Mar 14 22:58:33 ubuntu kernel: Hello, world 1.
Mar 14 22:58:41 ubuntu sudo[2958]:  shivang : TTY=pts/0 ; PWD=/home/shivang/develop/kernel/hello-1 ; USER=root ; COMMAND=/usr/sbin/rmmod hello_1
Mar 14 22:58:41 ubuntu kernel: Goodbye world 1.
```


#### How the module works
- Modules have atleast two functions
	- start `init_module()` : called when the module is *insmod*ed into the kernel.
	- end `cleanup_module()` : called just before it is removed from the kernel.
		> Starting with kernel 2.3.13, you can now use whatever name you like for the start and end functions of a module, and we will learn that in the [[#Building up on our simple module]].
		> In fact, the new method is the preferred method.
- `init_module()` registers a new handler for something in the kernel OR replaces some existing kernel function.  
  `cleanup_module()` undoes whatever `init_module()` did so that module can be unloaded safely.
- Print macros : Included using `<linux/printk.h>`. Exist in [printk.h](https://github.com/torvalds/linux/blob/master/include/linux/printk.h). `pr_info` and `pr_debug` etc. are various priorities of `printk`.
- Compiling kernel modules require a lot of settings managed primarily in Makefiles. It is much easier to achieve using `kbuild`, the build process for external loadable modules is fully integrated into standard kernel build mechanism.  
  See [kbuild, how do build externel modules documentation](https://www.kernel.org/doc/Documentation/kbuild/modules.rst) and [makefiles for modules documentation](https://www.kernel.org/doc/Documentation/kbuild/makefiles.rst)

## Building up on our simple module

### The `module_init` and `module_exit` Macros
In early kernel versions you had to use the init_module and cleanup_module
functions.  
Now you can name those anything you want by using the `module_init` and `module_exit` macros defined in [module.h](https://github.com/torvalds/linux/blob/master/include/linux/module.h).

```
cd ~/develop/kernel/hello-1
nvim hello-2.c
```

```c
/*
 * hello-2.c - Demonstrating the module_init() and module_exit() macros.
 * This is preferred over using init_module() and cleanup_module().
 */

#include <linux/init.h>   /* Needed for the macros */
#include <linux/module.h> /* Needed by all modules */
#include <linux/printk.h> /* Needed for pr_info() */

static int __init hello_2_init(void) {
  pr_info("Hello, world 2\n");
  return 0;
}
static void __exit hello_2_exit(void) {
  pr_info("Goodbye, world 2\n");
}

module_init(hello_2_init);
module_exit(hello_2_exit);

MODULE_LICENSE("GPL");
```

We can simply update our Makefile to include our new module `hello-2`
```makefile
obj-m += hello-1.o
obj-m += hello-2.o

PWD := $(CURDIR)
all:
$(MAKE) -C /lib/modules/$(shell uname -r)/build M=$(PWD) modules

clean:
$(MAKE) -C /lib/modules/$(shell uname -r)/build M=$(PWD) clean
```

### Real world example of a Makefile
```makefile title="linux/drivers/char/Makefile"
# SPDX-License-Identifier: GPL-2.0
#
# Makefile for the kernel character device drivers.
#

obj-y				+= mem.o random.o
obj-$(CONFIG_TTY_PRINTK)	+= ttyprintk.o
obj-y				+= misc.o
obj-$(CONFIG_ATARI_DSP56K)	+= dsp56k.o
obj-$(CONFIG_VIRTIO_CONSOLE)	+= virtio_console.o
obj-$(CONFIG_UV_MMTIMER)	+= uv_mmtimer.o
obj-$(CONFIG_IBM_BSR)		+= bsr.o

obj-$(CONFIG_PRINTER)		+= lp.o

obj-$(CONFIG_APM_EMULATION)	+= apm-emulation.o

obj-$(CONFIG_DTLK)		+= dtlk.o
obj-$(CONFIG_APPLICOM)		+= applicom.o
obj-$(CONFIG_SONYPI)		+= sonypi.o
obj-$(CONFIG_HPET)		+= hpet.o
obj-$(CONFIG_XILINX_HWICAP)	+= xilinx_hwicap/
obj-$(CONFIG_NVRAM)		+= nvram.o
obj-$(CONFIG_TOSHIBA)		+= toshiba.o
obj-$(CONFIG_DS1620)		+= ds1620.o
obj-$(CONFIG_HW_RANDOM)		+= hw_random/
obj-$(CONFIG_PPDEV)		+= ppdev.o
obj-$(CONFIG_NWBUTTON)		+= nwbutton.o
obj-$(CONFIG_NWFLASH)		+= nwflash.o
obj-$(CONFIG_SCx200_GPIO)	+= scx200_gpio.o
obj-$(CONFIG_PC8736x_GPIO)	+= pc8736x_gpio.o
obj-$(CONFIG_NSC_GPIO)		+= nsc_gpio.o
obj-$(CONFIG_TELCLOCK)		+= tlclk.o

obj-$(CONFIG_MWAVE)		+= mwave/
obj-y				+= agp/

obj-$(CONFIG_HANGCHECK_TIMER)	+= hangcheck-timer.o
obj-$(CONFIG_TCG_TPM)		+= tpm/

obj-$(CONFIG_PS3_FLASH)		+= ps3flash.o

obj-$(CONFIG_XILLYBUS_CLASS)	+= xillybus/
obj-$(CONFIG_POWERNV_OP_PANEL)	+= powernv-op-panel.o
obj-$(CONFIG_ADI)		+= adi.o
```

There are some hardcoded `obj-y` and a lot of `obj-$(CONFIG_FOO)` entries. These `obj-$(CONFIG_FOO)` expand into `obj-y` or `obj-m`, depending on whether the `CONFIG_FOO` variable has been set to y or m.  These were exactly the kind of variables that you have set in the `.config` file in the top-level directory of Linux kernel source tree.

### The `__init` and `__exit` Macros

```
nvim hello-3.c
```

```c
/*
 * hello-3.c - Illustrating the __init, __initdata and __exit macros.
 */
#include <linux/init.h>   /* Needed for the macros */
#include <linux/module.h> /* Needed by all modules */
#include <linux/printk.h> /* Needed for pr_info() */

static int hello3_data __initdata = 3;

static int __init hello_3_init(void) {
  pr_info("Hello, world %d\n", hello3_data);
  return 0;
}

static void __exit hello_3_exit(void) { pr_info("Goodbye, world 3\n"); }

module_init(hello_3_init);
module_exit(hello_3_exit);

MODULE_LICENSE("GPL");
```