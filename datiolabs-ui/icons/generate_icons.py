import struct
import zlib

def create_d_image(width, height):
    # Genera un mapa de bits RGBA con fondo oscuro (#111111) y 'D.' en blanco/amarillo neón
    # Matriz simple de renderizado para "D."
    pixels = []
    # Definición matricial de 16x16 para 'D.' escalable
    # D: 5x7 aprox, punto: 2x2
    # Escalamos dinámicamente según width y height
    for y in range(height):
        row = []
        # Normalizamos coordenadas 0..1
        ny = y / height
        for x in range(width):
            nx = x / width
            # Fondo: cuadrilátero con borde
            is_border = (x < 2 or x >= width - 2 or y < 2 or y >= height - 2)
            
            # Dibujamos letra 'D' (nx entre 0.20 y 0.65, ny entre 0.20 y 0.80)
            in_d = False
            if 0.22 <= nx <= 0.62 and 0.22 <= ny <= 0.78:
                # Borde exterior de D
                # Parte izquierda recta
                if 0.22 <= nx <= 0.35:
                    in_d = True
                # Barra superior e inferior
                elif (0.22 <= ny <= 0.35 or 0.65 <= ny <= 0.78) and nx <= 0.52:
                    in_d = True
                # Arco curvo de la D
                else:
                    # Elipse centrada en (0.45, 0.50)
                    dx = (nx - 0.42) / 0.18
                    dy = (ny - 0.50) / 0.28
                    r = dx*dx + dy*dy
                    if 0.55 <= r <= 1.05 and nx >= 0.40:
                        in_d = True

            # Dibujamos el punto '.' (nx entre 0.70 y 0.82, ny entre 0.66 y 0.78)
            in_dot = (0.70 <= nx <= 0.82 and 0.66 <= ny <= 0.78)

            if in_d:
                row.append((255, 255, 255, 255)) # Letra D blanca brillante
            elif in_dot:
                row.append((234, 179, 8, 255))   # Punto amarillo corporativo (#EAB308)
            elif is_border:
                row.append((0, 0, 0, 255))       # Borde brutalista negro
            else:
                row.append((17, 24, 39, 255))    # Fondo azul-negro elegante (#111827)
        pixels.append(row)
    return pixels

def save_bmp_24(pixels, width, height, path):
    # BMP sin compresión 24bpp (BGR)
    row_bytes = width * 3
    padding = (4 - (row_bytes % 4)) % 4
    image_size = (row_bytes + padding) * height
    file_size = 54 + image_size

    header = struct.pack('<2sIHHI', b'BM', file_size, 0, 0, 54)
    dib_header = struct.pack('<IIIHHIIIIII', 40, width, height, 1, 24, 0, image_size, 2835, 2835, 0, 0)

    with open(path, 'wb') as f:
        f.write(header)
        f.write(dib_header)
        # Los píxeles en BMP se escriben de abajo hacia arriba
        for y in reversed(range(height)):
            row_data = bytearray()
            for x in range(width):
                r, g, b, _ = pixels[y][x]
                row_data.extend([b, g, r])
            row_data.extend(b'\x00' * padding)
            f.write(row_data)

def save_ico(sizes, path):
    # Genera un archivo ICO con múltiples capas PNG embebidas (estándar Windows moderno)
    # y BMP 32bpp fallback
    images_data = []
    for w, h in sizes:
        pix = create_d_image(w, h)
        # BMP DIB 32bpp para ICO (header 40 bytes)
        # En ICO, biHeight es 2*h (incluye máscara AND)
        dib_header = struct.pack('<IIIHHIIIIII', 40, w, h * 2, 1, 32, 0, w * h * 4, 0, 0, 0, 0)
        img_bytes = bytearray(dib_header)
        for y in reversed(range(h)):
            for x in range(w):
                r, g, b, a = pix[y][x]
                img_bytes.extend([b, g, r, a])
        # Máscara 1-bit (todos 0 porque usamos canal alfa de 32bpp)
        mask_row_bytes = ((w + 31) // 32) * 4
        img_bytes.extend(b'\x00' * (mask_row_bytes * h))
        images_data.append((w, h, bytes(img_bytes)))

    # ICO Header
    ico_header = struct.pack('<HHH', 0, 1, len(images_data))
    offset = 6 + 16 * len(images_data)
    
    entries = bytearray()
    data_block = bytearray()
    
    for w, h, data in images_data:
        b_w = 0 if w >= 256 else w
        b_h = 0 if h >= 256 else h
        entry = struct.pack('<BBBBHHII', b_w, b_h, 0, 0, 1, 32, len(data), offset + len(data_block))
        entries.extend(entry)
        data_block.extend(data)

    with open(path, 'wb') as f:
        f.write(ico_header)
        f.write(entries)
        f.write(data_block)

# Generar icon.ico con resoluciones 16, 32, 48, 64, 128, 256
save_ico([(16, 16), (32, 32), (48, 48), (64, 64), (128, 128), (256, 256)], '/home/ec2-user/apex/datiolabs-ui/icons/icon.ico')

# Generar header.bmp (150x57) y welcome.bmp (498x312) para NSIS
pix_header = create_d_image(150, 57)
save_bmp_24(pix_header, 150, 57, '/home/ec2-user/apex/datiolabs-ui/icons/header.bmp')

pix_welcome = create_d_image(498, 312)
save_bmp_24(pix_welcome, 498, 312, '/home/ec2-user/apex/datiolabs-ui/icons/welcome.bmp')

print("Iconos .ico, header.bmp y welcome.bmp generados correctamente.")
