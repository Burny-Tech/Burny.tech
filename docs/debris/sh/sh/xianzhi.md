# 限制某个用户使用命令（Restricted Shell）

Restricted Shell 将限制用户执行大多数命令，并且限制更改当前工作目录，具体有如下限制：

- 不允许执行 cd 命令，所以我们哪个目录也进不了，只能停留在当前工作目录中。
- 不允许修改 $PATH，$SHELL，$BASH_ENV 或 $ENV 等环境变量的值。
- 不允许执行包含 `/` 字符的程序。例如，我们不能运行 /usr/bin/uname 或 ./uname 命令。但是，我们可以执行 uname 命令。换句话说，就是我们只能在当前路径里运行命令。
- 也不允许使用 `>` 、`>|` 、`<>`、`>&`、`&>` 和 `>>` 重定向运算符重定向输出。
- 也不允许我们在脚本中退出 Restricted Shell 模式。
- 也不允许我们使用 `set+r` 或 `set+o restricted` 关闭 Restricted Shell 模式。

首先，从 bash 创建一个名为 rbash 的符号链接，如下所示。以下命令需以 root 用户身份运行。

```shell
# ln -s /bin/bash /bin/rbash
```

接下来，创建一个名为 harry 的用户，并指定默认 Shell 为 rbash ：

```shell
# useradd harry -s /bin/rbash
```

为新用户设置密码。

```bash
# passwd harry
```

在新用户的文件夹内创建一个bin目录。

```shell
# mkdir /home/harry/bin
```

现在，我们需要指定用户可以运行哪些命令。

在这里我选择让用户仅运行 ls 、 mkdir 、和 ping 命令。大家也可以自定义自己允许的命令。

为此，运行以下命令：

```shell
# ln -s /bin/ls /home/harry/bin/ls
# ln -s /bin/mkdir /home/harry/bin/mkdir
# ln -s /bin/ping /home/harry/bin/ping
```

现在大家就了解为什么我在前面的步骤中创建了 bin 目录。**除以上三个命令外，用户无法运行其它任何命令**。

接下来，让我们来阻止用户修改 .bash_profile 。

```shell
# chown root /home/harry/.bash_profile
# chmod 755 /home/harry/.bash_profile
```

编辑 /home/harry/.bash_profile 文件：

```shell
# vi /home/harry/.bash_profile
```

修改PATH变量。

```shell
[root@ecs-eef4-0002 zhiyuan]# cat .bash_profile 
# .bash_profile

# Get the aliases and functions
if [ -f ~/.bashrc ]; then
        . ~/.bashrc
fi
PATH=$HOME/bin
export PATH
# User specific environment and startup programs


```

按 ESC 键，然后键入 :wq 以保存并关闭文件。

现在当用户登录时，Restricted Shell（rbash）将作为默认 Shell 运行，并读取 .bash_profile ，将 PATH 环境变量设置为 $HOME/bin ，这样用户只能运行 ls，mkdir 和 ping 命令。

Restricted Shell 将不允许用户更改 PATH ，并且 .bash_profile 上的权限将不允许用户在下次登录以更改环境绕过限制。

#### 确认新用户是否受限

现在，我们从 root 用户注销，然后以新创建的用户（即harry）的身份重新登陆。

我们现在运行一些命令，确认我们上面的修改是否生效。

例如我们要清除终端，运行以下命令：

```powershell
$ clear
```

终端将输出：

```bash
-rbash: clear: command not found
```

好家伙，真的不行！那我们再试试看看能不能切换到其它目录。

```shell
$ cd /root
```

终端输出：

```bash
-rbash: cd: restricted
```

依然受到限制！不灰心，再试一下，看看能不能使用 > 运算符重定向输出。

```shell
$ cat > file.txt
```

终端输出：

```diff
-rbash: file.txt: restricted: cannot redirect output
```

