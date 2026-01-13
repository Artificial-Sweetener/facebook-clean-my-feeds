param(
    [switch]$SkipTests
)

$ErrorActionPreference = "Stop"

function Get-NodeMajor {
    try {
        $versionOutput = & node --version 2>$null
    } catch {
        return $null
    }

    if (-not $versionOutput) {
        return $null
    }

    if ($versionOutput.StartsWith("v")) {
        $versionOutput = $versionOutput.Substring(1)
    }

    $parts = $versionOutput.Split(".")
    if ($parts.Length -lt 1) {
        return $null
    }

    return [int]$parts[0]
}

$nodeMajor = Get-NodeMajor
if ($null -eq $nodeMajor) {
    Write-Host "Node.js is not available. Install Node 22.x and retry."
    exit 1
}

if ($nodeMajor -ne 22) {
    Write-Host "Warning: Node.js 22.x is recommended. Detected $nodeMajor.x."
}

Write-Host "Installing dependencies..."
npm install

if (-not $SkipTests) {
    Write-Host "Running checks..."
    npm run lint
    npm run format:check
    npm test
}

Write-Host "Setup complete."
