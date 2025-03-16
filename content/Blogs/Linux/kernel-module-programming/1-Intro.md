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
   ![[Pasted image 20250313092959.png]]
2. `cat /proc/modules`
   ![[Pasted image 20250313093138.png]]

 **To note**
1. Modversioning : Module compiled for one kernel will not load for another kernel.  
   This is if `CONFIG_MODVERSIONS` is enabled in kernel. It does strict compatibility checks.
2. Use console and not X / wayland window systems. Modules cannot directly print to the screen like printf() can, but they can log information and warnings. For instant access to this information, it is advisable to perform all tasks from the console.
3. Secure boot : security standard ensuring booting exclusively through trusted software endorsed by the original equipment manufacturer.
   Simplest solution : disabling UEFI SecureBoot from the boot menu of your PC or laptop.
   Intricate solution : generating keys, system key installation, and module signing.
4. Running self-coded, non-tested modules on your daily driver (if you daily drive linux) can potentially disrupt your system, recommended to load kernel modules in a virtual machine so that's what we gonna do now.  
   Recompiling your own kernel is another option, you can enable a number of useful debugging features, such as forced module unloading (`MODULE_FORCE_UNLOAD`): when this option is enabled, you can force the kernel to unload a module even when it believes it is unsafe, via a `sudo rmmod -f module` command.  
   This can save you a lot of time and a number of reboots during development of a module.

---
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

`hello-1.ko` is our compiled kernel object file
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

> Good to know:  Here if we had `return -1;` in the code, we would get an error `insmod: ERROR: could not insert module hello-1.ko: Operation not permitted`  

Now
![[Pasted image 20250313104353.png]]
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

**`__init` macro**
1. **For built-in drivers/modules:** When a function is marked with `__init` and the module is compiled directly into the kernel (not as a loadable module), the kernel will:
    - Run this function during system boot
    - Discard the function's code from memory after it executes (doesn't unload the module)
    - Free up the memory occupied by this function
2. **For loadable modules:** When used with loadable modules, the `__init` macro doesn't cause the function to be discarded from memory. This is because loadable modules can be loaded and unloaded multiple times during system operation.  
3. There is also an `__initdata` which works similarly to `__init` but for init variables rather than functions.

**`__exit` macro**
1. **For built-in drivers/modules:** When a function is marked with `__exit` and the module is built into the kernel, this function is completely omitted from the final binary. This is because built-in modules are never unloaded, so their cleanup functions will never be called.  
   When you boot your kernel and see something like Freeing unused kernel memory: 236k freed, this is precisely what the kernel is freeing.
2. **For loadable modules:** The `__exit` macro has no special effect - the function remains in memory and will be called when the module is unloaded. Built-in drivers do not need a cleanup function, while loadable modules do.

### Passing command line arguments to a module
Modules don't take arguments using `(int argc, char *argv[])`.  
To take arguments
1. Declare variables that will take values of command line arguments as global.
2. Use `module_param()` macro.  

At runtime, `insmod` will fill the variables with any arguments given.  
Eg: `insmod mymodule.ko myvariable=5`

`module_param()` macro takes 3 arguments
1. name of variable
2. type
3. permissions for corresponding file in `sysfs`

```c
int myint = 3;
module_param(myint, int, 0);
```

> Sysfs is a virtual filesystem in Linux that exports kernel data structures, attributes, and device information to userspace. Mounted at `/sys`, it provides a standardized interface for viewing and modifying kernel parameters without requiring specialized tools.  
> When you use `module_param()`, the kernel automatically creates corresponding files in `/sys/module/[module_name]/parameters/` with the permissions specified in the macro's third argument.  
> 
> Permission argument follows default linux permission format for owner, group, and others.

We can also use arrays of integers or strings, see `module_param_array()` and `module_param_string()`.

```c
int myintarray[2];
module_param_array(myintarray, int, NULL, 0); /* not interested in count */

short myshortarray[4];
int count;
module_param_array(myshortarray, short, &count, 0); /* put count into "count" variable */
```
To keep track of the number of parameters you need to pass a pointer to a count variable as third parameter. At your option, you could also ignore the count and pass NULL instead.

Lastly, there is a macro function, `MODULE_PARM_DESC()`, that is used to document arguments that the module can take. It takes two parameters
1. a variable name
2. free form string describing that variable.

```c
/*
 * hello-5.c - Demonstrates command line argument passing to a module.
 */
#include <linux/init.h>
#include <linux/kernel.h> /* for ARRAY_SIZE() */
#include <linux/module.h>
#include <linux/moduleparam.h>
#include <linux/printk.h>
#include <linux/stat.h>

MODULE_LICENSE("GPL");

static short int myshort = 1;
static int myint = 420;
static long int mylong = 9999;
static char *mystring = "shivang";
static int myintarray[2] = {420, 420};
static int arr_argc = 0;

/* module_param(foo, int, 0000)
 * The first param is the parameter's name.
 * The second param is its data type.
 * The final argument is the permissions bits,
 * for exposing parameters in sysfs (if non-zero) at a later stage.
 */
module_param(myshort, short, S_IRUSR | S_IWUSR | S_IRGRP | S_IWGRP);
MODULE_PARM_DESC(myshort, "A short integer");
module_param(myint, int, S_IRUSR | S_IWUSR | S_IRGRP | S_IROTH);
MODULE_PARM_DESC(myint, "An integer");
module_param(mylong, long, S_IRUSR);
MODULE_PARM_DESC(mylong, "A long integer");
module_param(mystring, charp, 0000);
MODULE_PARM_DESC(mystring, "A character string");

/* module_param_array(name, type, num, perm);
 * The first param is the parameter's (in this case the array's) name.
 * The second param is the data type of the elements of the array.
 * The third argument is a pointer to the variable that will store the number
 * of elements of the array initialized by the user at module loading time.
 * The fourth argument is the permission bits.
 */
module_param_array(myintarray, int, &arr_argc, 0000);
MODULE_PARM_DESC(myintarray, "An array of integers");

static int __init hello_5_init(void) {
  int i;

  pr_info("Hello, world 5\n=============\n");
  pr_info("myshort is a short integer: %hd\n", myshort);
  pr_info("myint is an integer: %d\n", myint);
  pr_info("mylong is a long integer: %ld\n", mylong);
  pr_info("mystring is a string: %s\n", mystring);

  for (i = 0; i < ARRAY_SIZE(myintarray); i++)
    pr_info("myintarray[%d] = %d\n", i, myintarray[i]);

  pr_info("got %d arguments for myintarray.\n", arr_argc);
  return 0;
}

static void __exit hello_5_exit(void) {
  pr_info("Goodbye, world 5\n");
}

module_init(hello_5_init);
module_exit(hello_5_exit);
```

#### Experimenting with the cli arguments

```
// Update Makefile += hello-5.o
make

sudo insmod hello-5.ko
sudo dmesg -t | tail -11

hello_5: loading out-of-tree module taints kernel.
hello_5: module verification failed: signature and/or required key missing - tainting kernel
Hello, world 5
=============
myshort is a short integer: 1
myint is an integer: 420
mylong is a long integer: 9999
mystring is a string: blah
myintarray[0] = 420
myintarray[1] = 420
got 0 arguments for myintarray.

sudo rmmod hello_5
```

```
sudo insmod hello-5.ko mystring="bebop" myintarray=-1
sudo dmesg -t | tail -7

myshort is a short integer: 1
myint is an integer: 420
mylong is a long integer: 9999
mystring is a string: bebop
myintarray[0] = -1
myintarray[1] = 420
got 1 arguments for myintarray.

sudo rmmod hello_5
```

```
sudo rmmod hello_5
sudo dmesg -t | tail -1

Goodbye, world 5
```

```
sudo insmod hello-5.ko mystring="supercalifragilisticexpialidocious" myintarray=-1,-1
sudo dmesg -t | tail -7

myshort is a short integer: 1
myint is an integer: 420
mylong is a long integer: 9999
mystring is a string: supercalifragilisticexpialidocious
myintarray[0] = -1
myintarray[1] = -1
got 2 arguments for myintarray.

sudo rmmod hello_5
```

```
sudo insmod hello-5.ko mylong=hello
insmod: ERROR: could not insert module hello-5.ko: Invalid parameters
```

### Dividing modules b/w multiple source files

```c title="start.c"
/*
 * start.c - Illustration of multi filed modules
 */

#include <linux/kernel.h> /* We are doing kernel work */
#include <linux/module.h> /* Specifically, a module */

int init_module(void) {
  pr_info("Hello, world - this is the kernel speaking\n");
  return 0;
}

MODULE_LICENSE("GPL");
```

```c title="stop.c"
/*
 * stop.c - Illustration of multi filed modules
 */

#include <linux/kernel.h> /* We are doing kernel work */
#include <linux/module.h> /* Specifically, a module  */

void cleanup_module(void) {
  pr_info("Short is the life of a kernel module\n");
}

MODULE_LICENSE("GPL");
```

```makefile title="Finally, the Makefile" {6,7}
obj-m += hello-1.o 
obj-m += hello-2.o 
obj-m += hello-3.o 
# obj-m += hello-4.o 
obj-m += hello-5.o
obj-m += startstop.o 
startstop-objs := start.o stop.o 
 
PWD := $(CURDIR) 
 
all: 
    $(MAKE) -C /lib/modules/$(shell uname -r)/build M=$(PWD) modules 
 
clean: 
    $(MAKE) -C /lib/modules/$(shell uname -r)/build M=$(PWD) clean
```

We need 2 lines for compiling multiple source files into one object file.
1. We invent an object name for our combined module
2. Tell what object files are part of that module

```
sudo insmod startstop.ko
sudo rmmod startstop
sudo dmesg -t | tail -5

startstop: loading out-of-tree module taints kernel.
startstop: module verification failed: signature and/or required key missing - tainting kernel
Hello, world - this is the kernel speaking
Short is the life of a kernel module
```