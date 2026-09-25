# Genera los PNG para la PWA a partir de scripts\logo-source.png (marca personal)
# Uso: powershell -ExecutionPolicy Bypass -File scripts\generate-icons.ps1
$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing

$root = Split-Path -Parent $PSScriptRoot
$out  = Join-Path $root 'public\icons'
if (-not (Test-Path $out)) { New-Item -ItemType Directory -Path $out | Out-Null }

# Logo original (1408x768): el cuadrado redondeado ocupa (452,132)-(956,634)
$srcPath = Join-Path $PSScriptRoot 'logo-source.png'
$img = [System.Drawing.Image]::FromFile($srcPath)
$rect = [System.Drawing.Rectangle]::new(452, 132, 504, 502)

# Fondo floral #fffcf2 (paleta Josmar)
$floral = [System.Drawing.Color]::FromArgb(255, 255, 252, 242)

function New-Icon([int]$size, [string]$path) {
  $bmp = [System.Drawing.Bitmap]::new($size, $size)
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.SmoothingMode = 'AntiAlias'
  $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
  $g.Clear($floral)
  $dest = [System.Drawing.Rectangle]::new(0, 0, $size, $size)
  $g.DrawImage($img, $dest, $rect, [System.Drawing.GraphicsUnit]::Pixel)
  $g.Dispose()
  $bmp.Save($path, [System.Drawing.Imaging.ImageFormat]::Png)
  $bmp.Dispose()
  Write-Host "OK -> $path"
}

New-Icon 192 (Join-Path $out 'icon-192.png')
New-Icon 512 (Join-Path $out 'icon-512.png')

# Versión maskable: contenido dentro del área segura del 80% sobre fondo floral
$inner = [System.Drawing.Image]::FromFile((Join-Path $out 'icon-512.png'))
$mask = [System.Drawing.Bitmap]::new(512, 512)
$g2 = [System.Drawing.Graphics]::FromImage($mask)
$g2.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g2.Clear($floral)
[int]$w = 512 * 0.8
[int]$x = (512 - $w) / 2
$g2.DrawImage($inner, $x, $x, $w, $w)
$g2.Dispose()
$inner.Dispose()
$mask.Save((Join-Path $out 'icon-maskable-512.png'), [System.Drawing.Imaging.ImageFormat]::Png)
$mask.Dispose()
$img.Dispose()
Write-Host "OK -> icon-maskable-512.png"
