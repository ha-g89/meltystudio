@"
`$action = New-ScheduledTaskAction -Execute "powershell.exe" -Argument "-WindowStyle Hidden -ExecutionPolicy Bypass -File E:\repos\Meltystudio\meltystudio\watch-tasks-meltystudio.ps1"
`$trigger = New-ScheduledTaskTrigger -AtStartup
Register-ScheduledTask -TaskName "MeltyStudio Watcher" -Action `$action -Trigger `$trigger -RunLevel Highest -Force
Start-ScheduledTask -TaskName "MeltyStudio Watcher"
"@ | Set-Content "E:\register-melty.ps1"

powershell.exe -ExecutionPolicy Bypass -File "E:\register-melty.ps1"