param([switch]$Foreground)
$ErrorActionPreference = 'Stop'
$project = $PSScriptRoot
$nodeCommand = Get-Command node -ErrorAction SilentlyContinue
$nodePath = if ($nodeCommand) { $nodeCommand.Source } else { Join-Path $env:USERPROFILE '.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' }
if (-not (Test-Path -LiteralPath $nodePath)) { throw 'Install Node.js 20 or newer and add it to PATH.' }
if ($Foreground) { & $nodePath (Join-Path $project 'server.mjs'); exit $LASTEXITCODE }
$busy = @(Get-NetTCPConnection -LocalPort 1051,1052,1053 -State Listen -ErrorAction SilentlyContinue)
if ($busy.Count) { throw 'Ports 1051-1053 must be free. The websites may already be running.' }
$runtime = Join-Path $project '.runtime'
New-Item -ItemType Directory -Force -Path $runtime | Out-Null
$process = Start-Process -FilePath $nodePath -ArgumentList ('"' + (Join-Path $project 'server.mjs') + '"') -WorkingDirectory $project -WindowStyle Hidden -RedirectStandardOutput (Join-Path $runtime 'server.log') -RedirectStandardError (Join-Path $runtime 'server-error.log') -PassThru
@{ pid=$process.Id; started=(Get-Date).ToString('o'); ports=@(1051,1052,1053) } | ConvertTo-Json | Set-Content -LiteralPath (Join-Path $runtime 'process.json') -Encoding UTF8
Write-Output ('Started process ' + $process.Id)
Write-Output 'Coffee: http://localhost:1051'
Write-Output 'Clinic: http://localhost:1052'
Write-Output 'Flow:   http://localhost:1053'
