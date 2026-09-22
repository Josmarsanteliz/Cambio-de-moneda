# Genera los PNG para la PWA a partir de icon.svg (ejecutar una sola vez)
# Uso: powershell -ExecutionPolicy Bypass -File scripts\generate-icons.ps1
$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing

$root = Split-Path -Parent $PSScriptRoot
$out  = Join-Path $root 'public\icons'
if (-not (Test-Path $out)) { New-Item -ItemType Directory -Path $out | Out-Null }

# Fuente instalada en Windows (Arial como respaldo seguro)
$fontFamily = 'Arial Black'
try { $null = [System.Drawing.Font]::new($fontFamily, 10) } catch { $fontFamily = 'Arial' }

function New-Icon([int]$size, [string]$path) {
  $bmp = [System.Drawing.Bitmap]::new($size, $size)
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.SmoothingMode = 'AntiAlias'
  $g.TextRenderingHint = 'AntiAlias'
  $g.Clear([System.Drawing.Color]::FromArgb(255, 5, 5, 5))   # fondo #050505

  [float]$s = $size / 512.0

  # Placa blanca (badge Jdev) con esquinas redondeadas
  [float]$px = 96 * $s
  [float]$py = 176 * $s
  [float]$pw = 320 * $s
  [float]$ph = 160 * $s
  [float]$radius = 24 * $s
  $plate = [System.Drawing.RectangleF]::new($px, $py, $pw, $ph)
  $pathPlate = [System.Drawing.Drawing2D.GraphicsPath]::new()
  [float]$d = $radius * 2
  $pathPlate.AddArc($plate.X, $plate.Y, $d, $d, 180, 90)
  $pathPlate.AddArc($plate.Right - $d, $plate.Y, $d, $d, 270, 90)
  $pathPlate.AddArc($plate.Right - $d, $plate.Bottom - $d, $d, $d, 0, 90)
  $pathPlate.AddArc($plate.X, $plate.Bottom - $d, $d, $d, 90, 90)
  $pathPlate.CloseFigure()
  $g.FillPath([System.Drawing.Brushes]::White, $pathPlate)

  $brushDark = [System.Drawing.SolidBrush]::new([System.Drawing.Color]::FromArgb(255, 5, 5, 5))
  $brushGray = [System.Drawing.SolidBrush]::new([System.Drawing.Color]::FromArgb(255, 163, 163, 163))
  $fontBig = [System.Drawing.Font]::new($fontFamily, [float](112 * $s), [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Pixel)
  $fontSmall = [System.Drawing.Font]::new($fontFamily, [float](38 * $s), [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Pixel)
  $fmt = [System.Drawing.StringFormat]::new()
  $fmt.Alignment = 'Center'
  $fmt.LineAlignment = 'Center'

  # centrar "Jdev" dentro de la placa (y: 176s..336s)
  $g.DrawString('Jdev', $fontBig, $brushDark, [System.Drawing.RectangleF]::new(0, [float](176 * $s), $size, [float](160 * $s)), $fmt)
  $g.DrawString('TASAS VZLA', $fontSmall, $brushGray, [System.Drawing.RectangleF]::new(0, [float](340 * $s), $size, [float](90 * $s)), $fmt)

  $g.Dispose()
  $bmp.Save($path, [System.Drawing.Imaging.ImageFormat]::Png)
  $bmp.Dispose()
  Write-Host "OK -> $path"
}

New-Icon 192 (Join-Path $out 'icon-192.png')
New-Icon 512 (Join-Path $out 'icon-512.png')

# Versión maskable: contenido dentro del área segura del 80%
$inner = [System.Drawing.Image]::FromFile((Join-Path $out 'icon-512.png'))
$mask = [System.Drawing.Bitmap]::new(512, 512)
$g2 = [System.Drawing.Graphics]::FromImage($mask)
$g2.SmoothingMode = 'AntiAlias'
$g2.Clear([System.Drawing.Color]::FromArgb(255, 5, 5, 5))
[int]$w = 512 * 0.8
[int]$x = (512 - $w) / 2
$g2.DrawImage($inner, $x, $x, $w, $w)
$g2.Dispose()
$inner.Dispose()
$mask.Save((Join-Path $out 'icon-maskable-512.png'), [System.Drawing.Imaging.ImageFormat]::Png)
$mask.Dispose()
Write-Host "OK -> icon-maskable-512.png"
