const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const ICON_DIR = path.join(__dirname, '..', 'icons');

const COLORS = {
  bgTop: [61, 40, 32, 255],
  bgBottom: [44, 24, 16, 255],
  bagMain: [212, 165, 116, 255],
  bagTop: [244, 216, 183, 255],
  bagBottom: [143, 93, 55, 255],
  beanDark: [44, 24, 16, 255],
  seam: [212, 165, 116, 255],
  shadow: [25, 13, 9, 90]
};

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function blendPixel(buffer, width, x, y, rgba) {
  if (x < 0 || y < 0 || x >= width) return;
  const idx = (y * width + x) * 4;
  const srcA = rgba[3] / 255;
  if (srcA <= 0) return;

  const dstR = buffer[idx];
  const dstG = buffer[idx + 1];
  const dstB = buffer[idx + 2];

  const invA = 1 - srcA;
  buffer[idx] = Math.round(rgba[0] * srcA + dstR * invA);
  buffer[idx + 1] = Math.round(rgba[1] * srcA + dstG * invA);
  buffer[idx + 2] = Math.round(rgba[2] * srcA + dstB * invA);
  buffer[idx + 3] = 255;
}

function inRoundedRect(px, py, x, y, w, h, r) {
  if (px < x || py < y || px >= x + w || py >= y + h) return false;

  const left = x + r;
  const right = x + w - r;
  const top = y + r;
  const bottom = y + h - r;

  if (px >= left && px < right) return true;
  if (py >= top && py < bottom) return true;

  const cx = px < left ? left : right;
  const cy = py < top ? top : bottom;
  const dx = px - cx;
  const dy = py - cy;

  return dx * dx + dy * dy <= r * r;
}

function drawRoundedRect(buffer, size, x, y, w, h, r, rgba) {
  const x0 = Math.floor(x);
  const y0 = Math.floor(y);
  const x1 = Math.ceil(x + w);
  const y1 = Math.ceil(y + h);

  for (let py = y0; py < y1; py += 1) {
    for (let px = x0; px < x1; px += 1) {
      if (inRoundedRect(px + 0.5, py + 0.5, x, y, w, h, r)) {
        blendPixel(buffer, size, px, py, rgba);
      }
    }
  }
}

function drawEllipse(buffer, size, cx, cy, rx, ry, rgba) {
  const x0 = Math.floor(cx - rx);
  const x1 = Math.ceil(cx + rx);
  const y0 = Math.floor(cy - ry);
  const y1 = Math.ceil(cy + ry);

  for (let py = y0; py < y1; py += 1) {
    for (let px = x0; px < x1; px += 1) {
      const dx = (px + 0.5 - cx) / rx;
      const dy = (py + 0.5 - cy) / ry;
      if (dx * dx + dy * dy <= 1) {
        blendPixel(buffer, size, px, py, rgba);
      }
    }
  }
}

function drawBeanSeam(buffer, size, cx, cy, rx, ry, thickness, rgba) {
  const y0 = Math.floor(cy - ry * 0.9);
  const y1 = Math.ceil(cy + ry * 0.9);
  for (let py = y0; py <= y1; py += 1) {
    const t = (py - cy) / ry;
    const x = cx + Math.sin(t * Math.PI * 0.85) * rx * 0.17;
    drawEllipse(buffer, size, x, py, thickness, thickness * 0.9, rgba);
  }
}

function drawBackground(buffer, size) {
  const cx = size / 2;
  const cy = size / 2;
  const maxDist = Math.sqrt(cx * cx + cy * cy);

  for (let y = 0; y < size; y += 1) {
    const v = y / Math.max(1, size - 1);
    for (let x = 0; x < size; x += 1) {
      const dx = x - cx;
      const dy = y - cy;
      const dist = Math.sqrt(dx * dx + dy * dy) / maxDist;
      const vignette = clamp(1 - dist * 0.18, 0.82, 1);

      const r = Math.round(lerp(COLORS.bgTop[0], COLORS.bgBottom[0], v) * vignette);
      const g = Math.round(lerp(COLORS.bgTop[1], COLORS.bgBottom[1], v) * vignette);
      const b = Math.round(lerp(COLORS.bgTop[2], COLORS.bgBottom[2], v) * vignette);

      const idx = (y * size + x) * 4;
      buffer[idx] = r;
      buffer[idx + 1] = g;
      buffer[idx + 2] = b;
      buffer[idx + 3] = 255;
    }
  }
}

function renderIcon(size) {
  const buffer = Buffer.alloc(size * size * 4);
  drawBackground(buffer, size);

  const bagX = size * 0.245;
  const bagY = size * 0.175;
  const bagW = size * 0.51;
  const bagH = size * 0.655;
  const bagRadius = size * 0.115;

  drawRoundedRect(
    buffer,
    size,
    bagX + size * 0.01,
    bagY + size * 0.018,
    bagW,
    bagH,
    bagRadius,
    COLORS.shadow
  );

  drawRoundedRect(buffer, size, bagX, bagY, bagW, bagH, bagRadius, COLORS.bagMain);

  drawRoundedRect(
    buffer,
    size,
    bagX + size * 0.035,
    bagY + size * 0.07,
    bagW - size * 0.07,
    size * 0.19,
    size * 0.05,
    COLORS.bagTop
  );

  drawRoundedRect(
    buffer,
    size,
    bagX + size * 0.035,
    bagY + size * 0.255,
    bagW - size * 0.07,
    size * 0.345,
    size * 0.055,
    COLORS.bagBottom
  );

  const beanCx = size * 0.5;
  const beanCy = size * 0.56;
  const beanRx = size * 0.092;
  const beanRy = size * 0.132;

  drawEllipse(buffer, size, beanCx, beanCy, beanRx, beanRy, COLORS.beanDark);
  drawBeanSeam(buffer, size, beanCx, beanCy, beanRx, beanRy, Math.max(1, size * 0.008), COLORS.seam);

  return buffer;
}

function crc32(buffer) {
  let crc = 0xffffffff;
  for (let i = 0; i < buffer.length; i += 1) {
    crc ^= buffer[i];
    for (let j = 0; j < 8; j += 1) {
      const mask = -(crc & 1);
      crc = (crc >>> 1) ^ (0xedb88320 & mask);
    }
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function pngChunk(type, data) {
  const typeBuf = Buffer.from(type, 'ascii');
  const lengthBuf = Buffer.alloc(4);
  lengthBuf.writeUInt32BE(data.length, 0);

  const crcBuf = Buffer.alloc(4);
  const crc = crc32(Buffer.concat([typeBuf, data]));
  crcBuf.writeUInt32BE(crc, 0);

  return Buffer.concat([lengthBuf, typeBuf, data, crcBuf]);
}

function encodePng(size, rgbaBuffer) {
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8;
  ihdr[9] = 6;
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;

  const stride = size * 4;
  const raw = Buffer.alloc((stride + 1) * size);

  for (let y = 0; y < size; y += 1) {
    const rawRowStart = y * (stride + 1);
    raw[rawRowStart] = 0;
    rgbaBuffer.copy(raw, rawRowStart + 1, y * stride, y * stride + stride);
  }

  const compressed = zlib.deflateSync(raw, { level: 9 });

  return Buffer.concat([
    signature,
    pngChunk('IHDR', ihdr),
    pngChunk('IDAT', compressed),
    pngChunk('IEND', Buffer.alloc(0))
  ]);
}

function writeIcon(size, filename) {
  const rgba = renderIcon(size);
  const png = encodePng(size, rgba);
  fs.writeFileSync(path.join(ICON_DIR, filename), png);
}

function main() {
  fs.mkdirSync(ICON_DIR, { recursive: true });

  writeIcon(16, 'favicon-16x16.png');
  writeIcon(32, 'favicon-32x32.png');
  writeIcon(180, 'apple-touch-icon.png');
  writeIcon(192, 'icon-192.png');
  writeIcon(512, 'icon-512.png');

  const svgPath = path.join(ICON_DIR, 'app-icon.svg');
  if (!fs.existsSync(svgPath)) {
    fs.writeFileSync(
      svgPath,
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024"><rect width="1024" height="1024" fill="#2C1810"/></svg>'
    );
  }

  console.log('Generated icons in', ICON_DIR);
}

main();
