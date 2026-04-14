$tasksFile   = "E:\OneDrive\Collection system\TASKS-meltystudio.md"
$repoPath    = "E:\repos\Meltystudio\meltystudio"
$logFile     = "E:\OneDrive\Collection system\pipeline-meltystudio.log"
$changesPath = "E:\OneDrive\Collection system\Changes\meltystudio"
$lastHash    = ""

$pushoverUser  = "ubbpmoqng7uw44csv4jc218w1fwxak"
$pushoverToken = "am3mmssmtp5g82bw7u6zw26q9pe977"

if (-not (Test-Path $changesPath)) {
    New-Item -ItemType Directory -Path $changesPath | Out-Null
}

function Write-Log($msg) {
    $line = "[$(Get-Date -Format 'HH:mm:ss')] $msg"
    Add-Content $logFile $line
    Write-Host $line
}

function Send-Notification($msg, $priority = 0) {
    $body = @{
        token    = $pushoverToken
        user     = $pushoverUser
        message  = $msg
        title    = "MeltyStudio Pipeline"
        priority = $priority
    }
    try {
        Invoke-RestMethod -Uri "https://api.pushover.net/1/messages.json" `
            -Method POST -Body $body | Out-Null
    } catch {
        Write-Log "Notificatie mislukt: $_"
    }
}

function Get-NextTaskId {
    $lines = Get-Content $tasksFile -ErrorAction SilentlyContinue
    $maxId = 0
    foreach ($line in $lines) {
        if ($line -match "#(\d+)") {
            $id = [int]$matches[1]
            if ($id -gt $maxId) { $maxId = $id }
        }
    }
    return $maxId + 1
}

function Add-TaskId($task) {
    if ($task -match "^#\d+") { return $task }
    $id = Get-NextTaskId
    $newTask = "#$id $task"
    $content = Get-Content $tasksFile -Raw
    $escaped = [regex]::Escape($task)
    $content = $content -replace "(\-\s\[[b~ ]\]\s)$escaped", "`${1}$newTask"
    Set-Content $tasksFile $content -NoNewline
    Write-Log "Taak ID toegewezen: #$id"
    return $newTask
}

function Get-FirstOpenTask {
    $lines = Get-Content $tasksFile
    foreach ($line in $lines) {
        if ($line -match "^- \[ \] (.+)$") {
            return $matches[1].Trim()
        }
    }
    return $null
}

function Get-TaskId($task) {
    if ($task -match "^#(\d+)") { return $matches[1] }
    return "0"
}

function Get-TaskDescription($task) {
    if ($task -match "^#\d+\s+(.+)$") { return $matches[1].Trim() }
    return $task
}

function Update-TaskStatus($task, $oldStatus, $newStatus) {
    $content = Get-Content $tasksFile -Raw
    $escaped = [regex]::Escape($task)
    $content = $content -replace "- $oldStatus $escaped.*", "- $newStatus $task"
    Set-Content $tasksFile $content -NoNewline
}

function New-ChangeReport($taskId, $task, $status, $body) {
    $date      = Get-Date -Format "yyyy-MM-dd"
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $safeTask  = ($task -replace '[\\/:*?"<>|#]', '') -replace '\s+', '-'
    $safeTask  = $safeTask.Substring(0, [Math]::Min($safeTask.Length, 50))
    $fileName  = "TICKET-${taskId}-${date}-${safeTask}.md"
    $filePath  = Join-Path $changesPath $fileName
    $report = @"
# Ticket #${taskId}
**Datum:** $timestamp
**Status:** $status
**Taak:** $task

---

$body
"@
    Set-Content $filePath $report -Encoding UTF8
    Write-Log "Change report aangemaakt: $fileName"
    return $filePath
}

function Append-ChangeReport($taskId, $section, $content) {
    $existing = Get-ChildItem $changesPath -Filter "TICKET-${taskId}-*.md" | Select-Object -First 1
    if (-not $existing) { return }
    $addition = @"

---

## $section
$content
"@
    Add-Content $existing.FullName $addition -Encoding UTF8
}

function Run-Builder($task, $taskId) {
    Write-Log "Builder agent gestart voor: $task"
    $prompt = "Lees CLAUDE.md in $repoPath. Implementeer de volgende feature volledig in de React 19 + Vite frontend: TAAK: $task. Volg alle architectuurregels uit CLAUDE.md. Pure CSS, geen frameworks, JSX. Maak GEEN git commit. Schrijf daarna $repoPath\build-report.md met: 1) Samenvatting van wat je hebt gebouwd. 2) Exacte lijst van aangemaakt of gewijzigde bestanden."
    Set-Location $repoPath
    & claude --dangerously-skip-permissions --print $prompt
    Write-Log "Builder klaar."
    $buildReport = Get-Content "$repoPath\build-report.md" -Raw -ErrorAction SilentlyContinue
    if ($buildReport) { Append-ChangeReport $taskId "Build Report" $buildReport }
}

function Run-Tester($taskId) {
    Write-Log "Tester agent gestart..."
    $prompt = "Lees $repoPath\build-report.md om te zien wat er gebouwd is. Voer deze check uit: cd $repoPath && npm run build. Als de build slaagt schrijf dan STATUS: PASSED op de eerste regel van $repoPath\test-report.md. Als de build faalt schrijf dan STATUS: FAILED op de eerste regel gevolgd door de exacte foutmeldingen."
    Set-Location $repoPath
    & claude --dangerously-skip-permissions --print $prompt
    Write-Log "Tester klaar."
    $testReport = Get-Content "$repoPath\test-report.md" -Raw -ErrorAction SilentlyContinue
    if ($testReport) { Append-ChangeReport $taskId "Test Report" $testReport }
}

function Run-Fixer($taskId) {
    Write-Log "Builder krijgt een tweede kans op basis van test-report..."
    $prompt = "Lees $repoPath\test-report.md - er zijn fouten gevonden. Fix alle fouten. Maak nog GEEN git commit. Update build-report.md met wat je gefixed hebt."
    Set-Location $repoPath
    & claude --dangerously-skip-permissions --print $prompt
    Write-Log "Fixer klaar."
    $buildReport = Get-Content "$repoPath\build-report.md" -Raw -ErrorAction SilentlyContinue
    if ($buildReport) { Append-ChangeReport $taskId "Fix Report (Retry)" $buildReport }
}

function Get-TestStatus {
    $report = Get-Content "$repoPath\test-report.md" -Raw -ErrorAction SilentlyContinue
    if ($report -match "STATUS: PASSED") { return "PASSED" }
    return "FAILED"
}

function Push-Code($task, $taskId) {
    Write-Log "Code pushen..."
    $desc = Get-TaskDescription $task
    Set-Location $repoPath
    git add -A
    git commit -m "feat(#${taskId}) - $desc"
    git push
    Write-Log "Gepusht naar main."
}

function Run-Pipeline($task) {
    Write-Log "=============================="
    Write-Log "Pipeline gestart: $task"
    Write-Log "=============================="

    $task   = Add-TaskId $task
    $taskId = Get-TaskId $task
    $desc   = Get-TaskDescription $task

    Write-Log "Ticket ID: #${taskId}"

    New-ChangeReport $taskId $task "In Progress" @"
## Taak
$desc

## Gestart
$(Get-Date -Format "yyyy-MM-dd HH:mm:ss")
"@ | Out-Null

    Update-TaskStatus $task "\[ \]" "[~]"
    Send-Notification "Gestart #${taskId} - $desc"

    Run-Builder $task $taskId
    Run-Tester $taskId

    if ((Get-TestStatus) -eq "PASSED") {
        Push-Code $task $taskId
        Update-TaskStatus $task "\[~\]" "[x]"
        Write-Log "Pipeline succesvol afgerond. Ticket #${taskId}"
        Send-Notification "Live #${taskId} - $desc"
        Append-ChangeReport $taskId "Resultaat" "**STATUS: SUCCES**`nGepusht naar main op $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
        return
    }

    Write-Log "Tests gefaald. Retry wordt gestart..."
    Send-Notification "Tests gefaald #${taskId} - bezig met fixen..."

    Run-Fixer $taskId
    Run-Tester $taskId

    if ((Get-TestStatus) -eq "PASSED") {
        Push-Code $task $taskId
        Update-TaskStatus $task "\[~\]" "[x]"
        Write-Log "Pipeline succesvol na retry. Ticket #${taskId}"
        Send-Notification "Live (na retry) #${taskId} - $desc"
        Append-ChangeReport $taskId "Resultaat" "**STATUS: SUCCES (na retry)**`nGepusht naar main op $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
        return
    }

    Update-TaskStatus $task "\[~\]" "[!]"
    Write-Log "Pipeline gefaald na 2 pogingen. Ticket #${taskId}"
    Send-Notification "GEFAALD #${taskId} - check log" 1
    Append-ChangeReport $taskId "Resultaat" "**STATUS: GEFAALD**`nNa 2 pogingen niet gelukt op $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')`nHandmatige actie nodig."
}

Write-Log "Watcher gestart. Bewaakt: $tasksFile"
Send-Notification "MeltyStudio watcher is online."

while ($true) {
    try {
        $hash = (Get-FileHash $tasksFile -Algorithm MD5).Hash
        if ($hash -ne $lastHash) {
            $lastHash = $hash
            $task = Get-FirstOpenTask
            if ($task) { Run-Pipeline $task }
        }
    } catch {
        Write-Log "Fout in watcher loop: $_"
    }
    Start-Sleep -Seconds 30
}