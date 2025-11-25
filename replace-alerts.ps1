# PowerShell script to replace console.error, alert() and confirm() with SweetAlert2

$files = Get-ChildItem -Path "src\app\components" -Recurse -Filter "*.ts"

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    $modified = $false
    
    # Replace simple console.error patterns
    if ($content -match "console\.error\('Error") {
        $content = $content -replace "console\.error\('Error ([^']+)', error\)", "Swal.fire({icon:'error',title:'Error',text:'`$1',confirmButtonColor:'#667eea'})"
        $modified = $true
    }
    
    # Replace alert patterns
    $content = $content -replace "alert\('([^']+)'\);", "Swal.fire({icon:'info',title:'',text:'`$1',confirmButtonColor:'#667eea'});"
    
    # Replace confirm patterns
    if ($content -match "if \(confirm\(") {
        # This needs manual handling due to complexity
        Write-Host "File needs manual confirm replacement: $($file.FullName)"
    }
    
    if ($modified -or ($content -ne (Get-Content $file.FullName -Raw))) {
        Set-Content $file.FullName -Value $content
        Write-Host "Updated: $($file.FullName)"
    }
}
